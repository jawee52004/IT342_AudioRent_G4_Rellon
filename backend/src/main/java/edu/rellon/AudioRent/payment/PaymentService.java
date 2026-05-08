package edu.rellon.AudioRent.payment;

import edu.rellon.AudioRent.payment.model.Payment;
import edu.rellon.AudioRent.payment.model.PaymentStatus;
import edu.rellon.AudioRent.rental.model.Rental;
import edu.rellon.AudioRent.rental.RentalRepository;
import com.google.cloud.Timestamp;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RentalRepository rentalRepository;

    @Value("${paymongo.secret.key}")
    private String paymongoSecretKey;

    @Value("${paymongo.base.url}")
    private String paymongoBaseUrl;

    public PaymentService(PaymentRepository paymentRepository, RentalRepository rentalRepository) {
        this.paymentRepository = paymentRepository;
        this.rentalRepository = rentalRepository;
    }

    // Build Basic Auth header: Base64(secretKey + ":")
    private String getBasicAuth() {
        String credentials = paymongoSecretKey + ":";
        return "Basic " + Base64.getEncoder()
                .encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Full sandbox payment flow:
     * 1. Create a PaymentIntent via PayMongo API
     * 2. Create a PaymentMethod using the test card number
     * 3. Attach the PaymentMethod to the PaymentIntent
     * 4. Persist result to Firestore payments collection
     */
    public Payment processPayment(String rentalId, String customerId) throws Exception {

        // --- Fetch rental ---
        Optional<Rental> rentalOpt = rentalRepository.findById(rentalId);
        if (rentalOpt.isEmpty()) {
            throw new RuntimeException("Rental not found: " + rentalId);
        }
        Rental rental = rentalOpt.get();

        // Verify ownership
        if (!rental.getCustomerId().equals(customerId)) {
            throw new RuntimeException("Unauthorized: rental does not belong to this customer");
        }

        // PayMongo requires amount in centavos; minimum 10000 (PHP 100)
        long amountInCentavos = Math.round(rental.getTotalPrice() * 100);
        if (amountInCentavos < 10000) {
            amountInCentavos = 10000;
        }

        HttpClient client = HttpClient.newHttpClient();
        String auth = getBasicAuth();

        // ----------------------------------------------------------------
        // STEP 1 – Create PaymentIntent
        // ----------------------------------------------------------------
        String intentBody = buildPaymentIntentBody(amountInCentavos, rental.getPackageName());

        HttpRequest createIntentReq = HttpRequest.newBuilder()
                .uri(URI.create(paymongoBaseUrl + "/payment_intents"))
                .header("Authorization", auth)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(intentBody))
                .build();

        HttpResponse<String> intentResp = client.send(createIntentReq,
                HttpResponse.BodyHandlers.ofString());

        JsonObject intentJson = JsonParser.parseString(intentResp.body()).getAsJsonObject();

        if (!intentJson.has("data")) {
            return saveFailedPayment(rentalId, customerId, rental, "pi_create_failed");
        }

        String paymentIntentId = intentJson.getAsJsonObject("data").get("id").getAsString();

        // ----------------------------------------------------------------
        // STEP 2 – Create PaymentMethod (sandbox test card 4343434343434345)
        // ----------------------------------------------------------------
        String pmBody = buildTestPaymentMethodBody(rental.getCustomerName());

        HttpRequest createPmReq = HttpRequest.newBuilder()
                .uri(URI.create(paymongoBaseUrl + "/payment_methods"))
                .header("Authorization", auth)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(pmBody))
                .build();

        HttpResponse<String> pmResp = client.send(createPmReq,
                HttpResponse.BodyHandlers.ofString());

        JsonObject pmJson = JsonParser.parseString(pmResp.body()).getAsJsonObject();

        if (!pmJson.has("data")) {
            return saveFailedPayment(rentalId, customerId, rental, paymentIntentId);
        }

        String paymentMethodId = pmJson.getAsJsonObject("data").get("id").getAsString();

        // ----------------------------------------------------------------
        // STEP 3 – Attach PaymentMethod to PaymentIntent
        // ----------------------------------------------------------------
        String attachBody = buildAttachBody(paymentMethodId);

        HttpRequest attachReq = HttpRequest.newBuilder()
                .uri(URI.create(paymongoBaseUrl + "/payment_intents/" + paymentIntentId + "/attach"))
                .header("Authorization", auth)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(attachBody))
                .build();

        HttpResponse<String> attachResp = client.send(attachReq,
                HttpResponse.BodyHandlers.ofString());

        JsonObject attachJson = JsonParser.parseString(attachResp.body()).getAsJsonObject();

        PaymentStatus status = PaymentStatus.FAILED;
        String transactionRef = paymentIntentId;

        if (attachJson.has("data")) {
            JsonObject attachAttrs = attachJson.getAsJsonObject("data")
                    .getAsJsonObject("attributes");
            String piStatus = attachAttrs.get("status").getAsString();
            if ("succeeded".equals(piStatus)) {
                status = PaymentStatus.SUCCESS;
            } else if ("awaiting_next_action".equals(piStatus)) {
                // 3DS required – treat as PENDING in sandbox
                status = PaymentStatus.PENDING;
            }
            transactionRef = attachJson.getAsJsonObject("data").get("id").getAsString();
        }

        Payment payment = Payment.builder()
                .rentalId(rentalId)
                .customerId(customerId)
                .amount(rental.getTotalPrice())
                .currency("PHP")
                .status(status)
                .transactionReference(transactionRef)
                .paymongoPaymentIntentId(paymentIntentId)
                .description("AudioRent payment for: " + rental.getPackageName())
                .createdAt(Timestamp.now())
                .updatedAt(Timestamp.now())
                .build();

        return paymentRepository.save(payment);
    }

    // ----------------------------------------------------------------
    // Helper: save a FAILED payment record in Firestore
    // ----------------------------------------------------------------
    private Payment saveFailedPayment(String rentalId, String customerId,
                                      Rental rental, String ref)
            throws Exception {
        Payment failed = Payment.builder()
                .rentalId(rentalId)
                .customerId(customerId)
                .amount(rental.getTotalPrice())
                .currency("PHP")
                .status(PaymentStatus.FAILED)
                .transactionReference(ref)
                .paymongoPaymentIntentId(ref)
                .description("AudioRent payment for: " + rental.getPackageName())
                .createdAt(Timestamp.now())
                .updatedAt(Timestamp.now())
                .build();
        return paymentRepository.save(failed);
    }

    // ----------------------------------------------------------------
    // Request body builders
    // ----------------------------------------------------------------
    private String buildPaymentIntentBody(long amountCentavos, String description) {
        String safeDesc = description == null ? "AudioRent Package"
                : description.replace("\"", "\\\"");
        return "{"
                + "\"data\":{"
                + "\"attributes\":{"
                + "\"amount\":" + amountCentavos + ","
                + "\"payment_method_allowed\":[\"card\"],"
                + "\"currency\":\"PHP\","
                + "\"capture_type\":\"automatic\","
                + "\"description\":\"AudioRent: " + safeDesc + "\""
                + "}}}";
    }

    private String buildTestPaymentMethodBody(String customerName) {
        String safeName = (customerName == null || customerName.isBlank())
                ? "AudioRent Customer" : customerName.replace("\"", "\\\"");
        return "{"
                + "\"data\":{"
                + "\"attributes\":{"
                + "\"type\":\"card\","
                + "\"details\":{"
                + "\"card_number\":\"4242424242424242\","
                + "\"exp_month\":12,"
                + "\"exp_year\":2025,"
                + "\"cvc\":\"123\""
                + "},"
                + "\"billing\":{"
                + "\"name\":\"" + safeName + "\","
                + "\"email\":\"customer@audiorent.com\""
                + "}"
                + "}}}";
    }

    private String buildAttachBody(String paymentMethodId) {
        return "{"
                + "\"data\":{"
                + "\"attributes\":{"
                + "\"payment_method\":\"" + paymentMethodId + "\","
                + "\"return_url\":\"http://localhost:3000/payment-success\""
                + "}}}";
    }
}

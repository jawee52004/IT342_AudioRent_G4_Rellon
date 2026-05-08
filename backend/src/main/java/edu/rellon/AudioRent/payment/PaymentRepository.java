package edu.rellon.AudioRent.payment;

import edu.rellon.AudioRent.payment.model.Payment;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Repository
public class PaymentRepository {

    private static final String COLLECTION = "payments";

    public Payment save(Payment payment) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        if (payment.getId() == null) {
            payment.setId(UUID.randomUUID().toString());
        }
        db.collection(COLLECTION).document(payment.getId()).set(payment).get();
        return payment;
    }

    public Optional<Payment> findById(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        var doc = db.collection(COLLECTION).document(id).get().get();
        if (!doc.exists()) return Optional.empty();
        return Optional.ofNullable(doc.toObject(Payment.class));
    }

    public List<Payment> findByRentalId(String rentalId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        QuerySnapshot snapshot = db.collection(COLLECTION)
                .whereEqualTo("rentalId", rentalId)
                .get().get();
        List<Payment> payments = new ArrayList<>();
        snapshot.getDocuments().forEach(doc -> {
            Payment payment = doc.toObject(Payment.class);
            if (payment != null) payments.add(payment);
        });
        return payments;
    }

    public List<Payment> findByCustomerId(String customerId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        QuerySnapshot snapshot = db.collection(COLLECTION)
                .whereEqualTo("customerId", customerId)
                .get().get();
        List<Payment> payments = new ArrayList<>();
        snapshot.getDocuments().forEach(doc -> {
            Payment payment = doc.toObject(Payment.class);
            if (payment != null) payments.add(payment);
        });
        return payments;
    }
}

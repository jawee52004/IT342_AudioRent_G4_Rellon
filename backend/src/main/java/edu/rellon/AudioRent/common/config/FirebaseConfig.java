package edu.rellon.AudioRent.common.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            InputStream serviceAccount;

            String base64Json = System.getenv("FIREBASE_SERVICE_ACCOUNT_JSON");

            if (base64Json != null && !base64Json.isBlank()) {
                // Running on Railway or any cloud host — read from base64 env var
                byte[] decoded = Base64.getDecoder().decode(base64Json);
                serviceAccount = new ByteArrayInputStream(decoded);
                System.out.println("Firebase: loading credentials from environment variable.");
            } else {
                // Running locally — read from resources/firebase-service-account.json
                serviceAccount = getClass().getClassLoader()
                        .getResourceAsStream("firebase-service-account.json");
                System.out.println("Firebase: loading credentials from local file.");
            }

            if (serviceAccount == null) {
                System.err.println("Firebase: Could not find credentials! " +
                        "Set FIREBASE_SERVICE_ACCOUNT_JSON env var or add firebase-service-account.json to resources.");
                return;
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setStorageBucket("audiorent-26b13.firebasestorage.app")
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase initialized successfully!");
            }
        } catch (IOException e) {
            System.err.println("Error initializing Firebase: " + e.getMessage());
        }
    }
}

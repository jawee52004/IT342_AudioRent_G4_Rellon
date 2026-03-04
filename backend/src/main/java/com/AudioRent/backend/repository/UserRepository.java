package com.AudioRent.backend.repository;

import com.AudioRent.backend.model.User;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Repository
public class UserRepository {

    private static final String COLLECTION_NAME = "users";

    public User save(User user) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        if (user.getId() == null) {
            user.setId(UUID.randomUUID().toString());
        }

        db.collection(COLLECTION_NAME)
                .document(user.getId())
                .set(user)
                .get();

        return user;
    }

    public Optional<User> findByEmail(String email)
            throws ExecutionException, InterruptedException {

        Firestore db = FirestoreClient.getFirestore();

        QuerySnapshot snapshot = db.collection(COLLECTION_NAME)
                .whereEqualTo("email", email)
                .get()
                .get();

        if (snapshot.isEmpty()) {
            return Optional.empty();
        }

        User user = snapshot.getDocuments().get(0).toObject(User.class);
        return Optional.ofNullable(user);
    }

    public Optional<User> findById(String id)
            throws ExecutionException, InterruptedException {

        Firestore db = FirestoreClient.getFirestore();

        var document = db.collection(COLLECTION_NAME)
                .document(id)
                .get()
                .get();

        if (!document.exists()) {
            return Optional.empty();
        }

        return Optional.ofNullable(document.toObject(User.class));
    }
}

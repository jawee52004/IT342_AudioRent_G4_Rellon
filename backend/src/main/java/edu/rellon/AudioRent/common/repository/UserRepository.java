package edu.rellon.AudioRent.common.repository;

import edu.rellon.AudioRent.common.model.User;
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

        var doc = snapshot.getDocuments().get(0);
        User user = doc.toObject(User.class);
        if (user != null && user.getId() == null) {
            user.setId(doc.getId());
        }
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

        User user = document.toObject(User.class);
        if (user != null && user.getId() == null) {
            user.setId(document.getId());
        }
        return Optional.ofNullable(user);
    }

    public List<User> findAll() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        QuerySnapshot snapshot = db.collection(COLLECTION_NAME).get().get();
        List<User> users = new ArrayList<>();
        snapshot.getDocuments().forEach(doc -> {
            User user = doc.toObject(User.class);
            if (user != null) {
                if (user.getId() == null) user.setId(doc.getId());
                users.add(user);
            }
        });
        return users;
    }
}

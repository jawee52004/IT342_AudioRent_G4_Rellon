package com.AudioRent.backend.repository;

import com.AudioRent.backend.model.Rental;
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
public class RentalRepository {

    private static final String COLLECTION = "rentals";

    public Rental save(Rental rental) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        if (rental.getId() == null) {
            rental.setId(UUID.randomUUID().toString());
        }
        db.collection(COLLECTION).document(rental.getId()).set(rental).get();
        return rental;
    }

    public Optional<Rental> findById(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        var doc = db.collection(COLLECTION).document(id).get().get();
        if (!doc.exists()) return Optional.empty();
        return Optional.ofNullable(doc.toObject(Rental.class));
    }

    public List<Rental> findByCustomerId(String customerId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        QuerySnapshot snapshot = db.collection(COLLECTION)
                .whereEqualTo("customerId", customerId)
                .get().get();
        List<Rental> rentals = new ArrayList<>();
        snapshot.getDocuments().forEach(doc -> {
            Rental rental = doc.toObject(Rental.class);
            if (rental != null) rentals.add(rental);
        });
        return rentals;
    }

    public List<Rental> findByProviderId(String providerId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        QuerySnapshot snapshot = db.collection(COLLECTION)
                .whereEqualTo("providerId", providerId)
                .get().get();
        List<Rental> rentals = new ArrayList<>();
        snapshot.getDocuments().forEach(doc -> {
            Rental rental = doc.toObject(Rental.class);
            if (rental != null) rentals.add(rental);
        });
        return rentals;
    }

    public List<Rental> findByPackageId(String packageId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        QuerySnapshot snapshot = db.collection(COLLECTION)
                .whereEqualTo("packageId", packageId)
                .get().get();
        List<Rental> rentals = new ArrayList<>();
        snapshot.getDocuments().forEach(doc -> {
            Rental rental = doc.toObject(Rental.class);
            if (rental != null) rentals.add(rental);
        });
        return rentals;
    }

    public List<Rental> findAll() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        QuerySnapshot snapshot = db.collection(COLLECTION).get().get();
        List<Rental> rentals = new ArrayList<>();
        snapshot.getDocuments().forEach(doc -> {
            Rental rental = doc.toObject(Rental.class);
            if (rental != null) rentals.add(rental);
        });
        return rentals;
    }
}

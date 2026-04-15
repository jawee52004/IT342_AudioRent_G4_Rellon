package com.AudioRent.backend.repository;

import com.AudioRent.backend.model.Package;
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
public class PackageRepository {

    private static final String COLLECTION = "packages";

    public Package save(Package pkg) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        if (pkg.getId() == null) {
            pkg.setId(UUID.randomUUID().toString());
        }
        db.collection(COLLECTION).document(pkg.getId()).set(pkg).get();
        return pkg;
    }

    public Optional<Package> findById(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        var doc = db.collection(COLLECTION).document(id).get().get();
        if (!doc.exists()) return Optional.empty();
        return Optional.ofNullable(doc.toObject(Package.class));
    }

    public List<Package> findAll() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        QuerySnapshot snapshot = db.collection(COLLECTION).get().get();
        List<Package> packages = new ArrayList<>();
        snapshot.getDocuments().forEach(doc -> {
            Package pkg = doc.toObject(Package.class);
            if (pkg != null && Boolean.TRUE.equals(pkg.getIsActive())) {
                packages.add(pkg);
            }
        });
        return packages;
    }

    public List<Package> findByProviderId(String providerId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        QuerySnapshot snapshot = db.collection(COLLECTION)
                .whereEqualTo("providerId", providerId)
                .get().get();
        List<Package> packages = new ArrayList<>();
        snapshot.getDocuments().forEach(doc -> {
            Package pkg = doc.toObject(Package.class);
            if (pkg != null) packages.add(pkg);
        });
        return packages;
    }

    public void delete(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION).document(id).delete().get();
    }
}

package edu.rellon.AudioRent.packages;

import edu.rellon.AudioRent.packages.model.Package;
import com.google.cloud.Timestamp;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service
public class PackageService {

    private final PackageRepository packageRepository;
    private final Cloudinary cloudinary;

    public PackageService(PackageRepository packageRepository, Cloudinary cloudinary) {
        this.packageRepository = packageRepository;
        this.cloudinary = cloudinary;
    }

    public List<Package> getAllActivePackages() throws ExecutionException, InterruptedException {
        return packageRepository.findAll();
    }

    public List<Package> getPackagesByProvider(String providerId) throws ExecutionException, InterruptedException {
        return packageRepository.findByProviderId(providerId);
    }

    public Optional<Package> getPackageById(String id) throws ExecutionException, InterruptedException {
        return packageRepository.findById(id);
    }

    public Package createPackage(String providerId, String providerName, String name,
                                  String description, Double price, Integer quantity,
                                  String category, List<MultipartFile> images)
            throws ExecutionException, InterruptedException, IOException {

        List<String> imageUrls = uploadImages(images);

        Package pkg = Package.builder()
                .providerId(providerId)
                .providerName(providerName)
                .name(name)
                .description(description)
                .price(price)
                .quantity(quantity)
                .category(category)
                .imageUrls(imageUrls)
                .isActive(true)
                .createdAt(Timestamp.now())
                .updatedAt(Timestamp.now())
                .build();

        return packageRepository.save(pkg);
    }

    public Package updatePackage(String id, String providerId, String name, String description,
                                  Double price, Integer quantity, String category,
                                  List<MultipartFile> images)
            throws ExecutionException, InterruptedException, IOException {

        Optional<Package> existing = packageRepository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Package not found");
        }

        Package pkg = existing.get();

        // Only the owner provider can edit
        if (!pkg.getProviderId().equals(providerId)) {
            throw new RuntimeException("Unauthorized: You do not own this package");
        }

        pkg.setName(name);
        pkg.setDescription(description);
        pkg.setPrice(price);
        pkg.setQuantity(quantity);
        pkg.setCategory(category);
        pkg.setUpdatedAt(Timestamp.now());

        // If new images are uploaded, replace old ones
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = uploadImages(images);
            pkg.setImageUrls(imageUrls);
        }

        return packageRepository.save(pkg);
    }

    public void deletePackage(String id, String providerId)
            throws ExecutionException, InterruptedException {

        Optional<Package> existing = packageRepository.findById(id);
        if (existing.isEmpty()) throw new RuntimeException("Package not found");
        if (!existing.get().getProviderId().equals(providerId)) {
            throw new RuntimeException("Unauthorized: You do not own this package");
        }
        packageRepository.delete(id);
    }

    // Upload images to Cloudinary and return public URLs
    private List<String> uploadImages(List<MultipartFile> images) throws IOException {
        List<String> urls = new ArrayList<>();
        if (images == null || images.isEmpty()) return urls;

        for (MultipartFile file : images) {
            if (file.isEmpty()) continue;
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "packages"));
            urls.add(uploadResult.get("url").toString());
        }
        return urls;
    }
}

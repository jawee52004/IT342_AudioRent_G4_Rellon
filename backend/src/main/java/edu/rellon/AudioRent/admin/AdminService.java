package edu.rellon.AudioRent.admin;

import edu.rellon.AudioRent.packages.model.Package;
import edu.rellon.AudioRent.common.model.User;
import edu.rellon.AudioRent.packages.PackageRepository;
import edu.rellon.AudioRent.common.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PackageRepository packageRepository;

    public AdminService(UserRepository userRepository, PackageRepository packageRepository) {
        this.userRepository = userRepository;
        this.packageRepository = packageRepository;
    }

    // --- User Management ---

    public List<User> getAllUsers() throws ExecutionException, InterruptedException {
        return userRepository.findAll();
    }

    public User deactivateUser(String userId) throws ExecutionException, InterruptedException {
        var userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found: " + userId);
        }
        User user = userOpt.get();
        user.setIsActive(false);
        return userRepository.save(user);
    }

    // --- Package Moderation ---

    public List<Package> getAllPackages() throws ExecutionException, InterruptedException {
        return packageRepository.findAllIncludingInactive();
    }

    public void removePackage(String packageId) throws ExecutionException, InterruptedException {
        packageRepository.delete(packageId);
    }
}

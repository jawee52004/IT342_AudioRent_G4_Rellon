package com.AudioRent.backend.service;

import com.AudioRent.backend.dto.CreateRentalRequest;
import com.AudioRent.backend.model.Package;
import com.AudioRent.backend.model.Rental;
import com.AudioRent.backend.model.RentalStatus;
import com.AudioRent.backend.model.User;
import com.AudioRent.backend.repository.PackageRepository;
import com.AudioRent.backend.repository.RentalRepository;
import com.AudioRent.backend.repository.UserRepository;
import com.google.cloud.Timestamp;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;
    private final PackageRepository packageRepository;
    private final UserRepository userRepository;

    public RentalService(RentalRepository rentalRepository,
                         PackageRepository packageRepository,
                         UserRepository userRepository) {
        this.rentalRepository = rentalRepository;
        this.packageRepository = packageRepository;
        this.userRepository = userRepository;
    }

    public Rental createRental(String customerId, CreateRentalRequest request)
            throws ExecutionException, InterruptedException {

        // Validate dates
        LocalDate start = LocalDate.parse(request.getStartDate());
        LocalDate end = LocalDate.parse(request.getEndDate());
        LocalDate today = LocalDate.now();

        if (start.isBefore(today)) {
            throw new RuntimeException("Start date must not be in the past");
        }
        if (!end.isAfter(start)) {
            throw new RuntimeException("End date must be after start date");
        }

        // Fetch package
        Optional<Package> pkgOpt = packageRepository.findById(request.getPackageId());
        if (pkgOpt.isEmpty()) {
            throw new RuntimeException("Package not found");
        }
        Package pkg = pkgOpt.get();
        if (!Boolean.TRUE.equals(pkg.getIsActive())) {
            throw new RuntimeException("Package is not available");
        }

        // Fetch customer name
        Optional<User> userOpt = userRepository.findById(customerId);
        String customerName = userOpt.map(User::getFullName).orElse("Unknown");

        long totalDays = ChronoUnit.DAYS.between(start, end);
        double totalPrice = totalDays * pkg.getPrice();

        Rental rental = Rental.builder()
                .customerId(customerId)
                .customerName(customerName)
                .packageId(pkg.getId())
                .packageName(pkg.getName())
                .providerId(pkg.getProviderId())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalDays((int) totalDays)
                .totalPrice(totalPrice)
                .notes(request.getNotes())
                .status(RentalStatus.PENDING)
                .createdAt(Timestamp.now())
                .updatedAt(Timestamp.now())
                .build();

        return rentalRepository.save(rental);
    }

    public List<Rental> getRentalsByCustomer(String customerId)
            throws ExecutionException, InterruptedException {
        return rentalRepository.findByCustomerId(customerId);
    }

    public List<Rental> getAllRentals() throws ExecutionException, InterruptedException {
        return rentalRepository.findAll();
    }
}

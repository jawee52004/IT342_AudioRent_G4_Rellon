package edu.rellon.AudioRent.rental;

import edu.rellon.AudioRent.rental.model.Rental;
import edu.rellon.AudioRent.rental.model.RentalStatus;
import edu.rellon.AudioRent.packages.PackageRepository;
import com.google.cloud.Timestamp;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class RentalScheduler {

    private final RentalRepository rentalRepository;
    private final PackageRepository packageRepository;

    public RentalScheduler(RentalRepository rentalRepository, PackageRepository packageRepository) {
        this.rentalRepository = rentalRepository;
        this.packageRepository = packageRepository;
    }

    /**
     * Runs every hour to manage inventory availability based on rental dates.
     * 1. Auto-completes rentals that have passed their end date.
     */
    @Scheduled(fixedRate = 3600000) // 1 Hour
    public void manageInventoryLifecycle() {
        try {
            System.out.println("[RentalScheduler] Starting inventory lifecycle management...");
            
            List<Rental> allRentals = rentalRepository.findAll();
            LocalDate today = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            // 1. Auto-complete passed rentals
            for (Rental rental : allRentals) {
                try {
                    LocalDate endDate = LocalDate.parse(rental.getEndDate(), formatter);
                    if (rental.getStatus() == RentalStatus.CONFIRMED && endDate.isBefore(today)) {
                        rental.setStatus(RentalStatus.COMPLETED);
                        rental.setUpdatedAt(Timestamp.now());
                        rentalRepository.save(rental);
                        System.out.println("[RentalScheduler] Auto-completed rental: " + rental.getId());
                    }
                } catch (Exception e) {
                    // Ignore parsing or save errors
                }
            }
            
            System.out.println("[RentalScheduler] Management cycle complete.");
        } catch (Exception e) {
            System.err.println("[RentalScheduler] Critical error in scheduler: " + e.getMessage());
        }
    }
}

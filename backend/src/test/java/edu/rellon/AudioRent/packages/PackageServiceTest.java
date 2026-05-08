package edu.rellon.AudioRent.packages;

import edu.rellon.AudioRent.packages.model.Package;
import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class PackageServiceTest {

    private PackageService packageService;

    @Mock
    private PackageRepository packageRepository;

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private Uploader uploader;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(cloudinary.uploader()).thenReturn(uploader);
        packageService = new PackageService(packageRepository, cloudinary);
    }

    @Test
    void testCreatePackage_Success() throws ExecutionException, InterruptedException, IOException {
        // Arrange
        String providerId = "p123";
        String providerName = "Provider One";
        String name = "Sound System";
        Double price = 1500.0;
        Integer quantity = 2;
        String category = "Professional (Large Events)";

        when(packageRepository.save(any(Package.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Package created = packageService.createPackage(providerId, providerName, name, "Good quality", price, quantity, category, new ArrayList<>());

        // Assert
        assertNotNull(created);
        assertEquals(name, created.getName());
        assertEquals(price, created.getPrice());
        assertEquals(providerId, created.getProviderId());
        assertTrue(created.getIsActive());
        verify(packageRepository, times(1)).save(any(Package.class));
    }

    @Test
    void testDeletePackage_Unauthorized() throws ExecutionException, InterruptedException {
        // Arrange
        String id = "pkg123";
        String ownerId = "owner";
        String thiefId = "thief";
        
        Package pkg = Package.builder().providerId(ownerId).build();
        when(packageRepository.findById(id)).thenReturn(java.util.Optional.of(pkg));

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            packageService.deletePackage(id, thiefId);
        });

        assertEquals("Unauthorized: You do not own this package", exception.getMessage());
        verify(packageRepository, never()).delete(anyString());
    }
}

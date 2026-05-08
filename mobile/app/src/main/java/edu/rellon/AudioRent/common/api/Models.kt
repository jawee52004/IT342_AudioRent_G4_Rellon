package edu.rellon.audiorent.common.api

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val fullName: String,
    val role: String,
    val id: String
)

data class RegisterRequest(
    val fullName: String,
    val email: String,
    val password: String,
    val role: String = "CUSTOMER"
)

data class UserResponse(
    val id: String?,
    val email: String,
    val fullName: String,
    val role: String
)

data class PackageResponse(
    val id: String,
    val providerId: String,
    val providerName: String,
    val name: String,
    val description: String,
    val price: Double,
    val quantity: Int,
    val category: String,
    val imageUrls: List<String>,
    val isActive: Boolean
)

data class RentalRequest(
    val packageId: String,
    val startDate: String,
    val endDate: String,
    val notes: String
)

data class RentalResponse(
    val id: String,
    val customerId: String,
    val customerName: String,
    val packageId: String,
    val packageName: String,
    val packageImageUrl: String?,
    val startDate: String,
    val endDate: String,
    val totalPrice: Double,
    val status: String
)

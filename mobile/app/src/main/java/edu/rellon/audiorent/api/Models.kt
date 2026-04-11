package edu.rellon.audiorent.api

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val fullName: String,
    val role: String
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

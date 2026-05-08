package edu.rellon.audiorent.common.api

import retrofit2.Call
import retrofit2.http.*

interface ApiService {
    @POST("auth/login")
    fun login(@Body request: LoginRequest): Call<LoginResponse>

    @POST("auth/google")
    fun googleAuth(@Body request: Map<String, String>): Call<LoginResponse>

    @POST("auth/register")
    fun register(@Body request: RegisterRequest): Call<UserResponse>

    @GET("packages")
    fun getPackages(): Call<List<PackageResponse>>

    @GET("packages/{id}")
    fun getPackageById(@Path("id") id: String): Call<PackageResponse>

    @POST("rentals")
    fun createRental(@Header("Authorization") token: String, @Body request: RentalRequest): Call<RentalResponse>

    @GET("rentals")
    fun getMyRentals(@Header("Authorization") token: String): Call<List<RentalResponse>>

    @GET("admin/users")
    fun getAllUsers(@Header("Authorization") token: String): Call<List<UserResponse>>

    @PUT("admin/users/{userId}/deactivate")
    fun deactivateUser(@Header("Authorization") token: String, @Path("userId") userId: String): Call<Void>

    @GET("admin/packages")
    fun getAllAdminPackages(@Header("Authorization") token: String): Call<List<PackageResponse>>

    @GET("packages/my")
    fun getMyProviderPackages(@Header("Authorization") token: String): Call<List<PackageResponse>>

    @Multipart
    @POST("packages")
    fun createProviderPackage(
        @Header("Authorization") token: String,
        @Part("name") name: okhttp3.RequestBody,
        @Part("description") description: okhttp3.RequestBody,
        @Part("price") price: okhttp3.RequestBody,
        @Part("quantity") quantity: okhttp3.RequestBody,
        @Part("category") category: okhttp3.RequestBody,
        @Part images: List<okhttp3.MultipartBody.Part>?
    ): Call<PackageResponse>

    @GET("rentals/provider")
    fun getProviderRentals(@Header("Authorization") token: String): Call<List<RentalResponse>>

    @DELETE("admin/packages/{packageId}")
    fun deletePackage(@Header("Authorization") token: String, @Path("packageId") packageId: String): Call<Void>
}

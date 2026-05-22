import axios, { AxiosInstance } from 'axios';

class ApiService {
    private static instance: ApiService;
    private axiosInstance: AxiosInstance;

    private constructor() {
        // Singleton pattern: private constructor prevents instantiation
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
        });

        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    public getAxiosInstance(): AxiosInstance {
        return this.axiosInstance;
    }

    // --- Admin User Management ---
    public async getAllUsers() {
        return this.axiosInstance.get("/admin/users");
    }

    public async deactivateUser(userId: string) {
        return this.axiosInstance.put(`/admin/users/${userId}/deactivate`);
    }

    // --- Admin Package Management ---
    public async getAllAdminPackages() {
        return this.axiosInstance.get("/admin/packages");
    }

    public async deletePackage(packageId: string) {
        return this.axiosInstance.delete(`/admin/packages/${packageId}`);
    }

    // --- Provider Management ---
    public async getProviderRentals() {
        return this.axiosInstance.get("/rentals/provider");
    }

    public async updateRentalStatus(rentalId: string, status: string) {
        return this.axiosInstance.put(`/rentals/${rentalId}/status?status=${status}`);
    }

    // --- Payment Management ---
    public async processPayment(rentalId: string) {
        return this.axiosInstance.post("/api/v1/payments", { rentalId });
    }
}

export default ApiService;

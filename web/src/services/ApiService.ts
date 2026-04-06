import axios, { AxiosInstance } from 'axios';

class ApiService {
    private static instance: ApiService;
    private axiosInstance: AxiosInstance;

    private constructor() {
        // Singleton pattern: private constructor prevents instantiation
        this.axiosInstance = axios.create({
            baseURL: "http://localhost:8080",
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
}

export default ApiService;

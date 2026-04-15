package com.AudioRent.backend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "da94s7zea",
            "api_key", "388614535797235",
            "api_secret", "XY2CeMCwBUkrEa4F-vjbJIpjZiQ"
        ));
    }
}

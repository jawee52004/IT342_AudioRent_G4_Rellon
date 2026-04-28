package com.AudioRent.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

	public static void main(String[] args) {
		loadEnv();
		SpringApplication.run(BackendApplication.class, args);
	}

	private static void loadEnv() {
		try (FileInputStream fis = new FileInputStream(".env")) {
			Properties props = new Properties();
			props.load(fis);
			props.forEach((key, value) -> System.setProperty(key.toString(), value.toString()));
			System.out.println(".env file loaded successfully.");
		} catch (IOException e) {
			System.out.println("No .env file found. Using system environment variables.");
		}
	}
}

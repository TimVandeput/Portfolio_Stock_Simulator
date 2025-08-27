package com.portfolio.demo_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan("com.portfolio.demo_backend.config")
public class DemoBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(DemoBackendApplication.class, args);
	}
}

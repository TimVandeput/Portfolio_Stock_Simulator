package com.portfolio.demo_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.portfolio.demo_backend.config.JwtProperties;
import com.portfolio.demo_backend.config.RegistrationProperties;

@EnableConfigurationProperties({ JwtProperties.class, RegistrationProperties.class })
@SpringBootApplication
public class DemoBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoBackendApplication.class, args);
	}

}

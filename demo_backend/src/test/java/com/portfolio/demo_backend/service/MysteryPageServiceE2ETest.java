package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.CreateMysteryPageDTO;
import com.portfolio.demo_backend.dto.CreateUserDTO;
import com.portfolio.demo_backend.dto.MysteryPageDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;

import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class MysteryPageServiceE2ETest {

    @LocalServerPort
    int port;

    @Autowired
    TestRestTemplate restTemplate;

    @Test
    void createMysteryPage_endToEnd() {
        String base = "http://localhost:" + port + "/api/users";

        CreateUserDTO user = new CreateUserDTO();
        user.setUsername("intuser");
        user.setPassword("Password1");
        user.setPasscode("ItWorks123");

        ResponseEntity<CreateUserDTO> created = restTemplate.postForEntity(base, user, CreateUserDTO.class);
        assertThat(created.getStatusCode().is2xxSuccessful()).isTrue();
        CreateUserDTO createdBody = created.getBody();
        org.junit.jupiter.api.Assertions.assertNotNull(createdBody);
        Long id = createdBody.getId();
        CreateMysteryPageDTO dto = new CreateMysteryPageDTO();
        dto.setTitle("Albert Einstein");

        ResponseEntity<MysteryPageDTO> resp = restTemplate.postForEntity(base + "/" + id + "/mystery-page", dto,
                MysteryPageDTO.class);
        assertThat(resp.getStatusCode().is2xxSuccessful()).isTrue();
        MysteryPageDTO page = resp.getBody();
        org.junit.jupiter.api.Assertions.assertNotNull(page);
        assertThat(page.getTitle()).isEqualTo("Albert Einstein");
        assertThat(page.getContent()).isNotBlank();
    }
}

package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.user.CreateUserDTO;
import com.portfolio.demo_backend.model.User;
import org.mapstruct.factory.Mappers;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserMapperTest {

    private final UserMapper mapper = Mappers.getMapper(UserMapper.class);

    @Test
    void toEntity_mapsFieldsCorrectly() {
        CreateUserDTO dto = new CreateUserDTO();
        dto.setId(1L);
        dto.setUsername("demo");
        dto.setEmail("demo@example.com");
        dto.setPassword("password123");

        User user = mapper.toEntity(dto);

        assertThat(user).isNotNull();
        assertThat(user.getUsername()).isEqualTo("demo");
        assertThat(user.getEmail()).isEqualTo("demo@example.com");
        assertThat(user.getPassword()).isEqualTo("password123");
    }

    @Test
    void toDTO_mapsFieldsCorrectlyExcludingPassword() {
        User user = User.builder()
                .id(2L)
                .username("realuser")
                .email("real@example.com")
                .password("secret")
                .build();

        CreateUserDTO dto = mapper.toDTO(user);

        assertThat(dto).isNotNull();
        assertThat(dto.getUsername()).isEqualTo("realuser");
        assertThat(dto.getEmail()).isEqualTo("real@example.com");
        assertThat(dto.getPassword()).isNull();
    }
}

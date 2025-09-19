package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.user.CreateUserDTO;
import com.portfolio.demo_backend.model.User;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserMapperTest {

    @Test
    void toEntity_setsIsFake_whenDtoProvidesTrue() {
        CreateUserDTO dto = new CreateUserDTO();
        dto.setId(1L);
        dto.setUsername("demo");
        dto.setPassword("password123");
        dto.setIsFake(Boolean.TRUE);

        User user = UserMapper.toEntity(dto);

        assertThat(user).isNotNull();
        assertThat(user.isFake()).isTrue();
        assertThat(user.getUsername()).isEqualTo("demo");
    }

    @Test
    void toDTO_includesIsFake_fromEntity() {
        User user = User.builder()
                .id(2L)
                .username("realuser")
                .password("secret")
                .isFake(true)
                .build();

        CreateUserDTO dto = UserMapper.toDTO(user);

        assertThat(dto).isNotNull();
        assertThat(dto.getIsFake()).isTrue();
        assertThat(dto.getUsername()).isEqualTo("realuser");
    }
}

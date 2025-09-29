package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.user.CreateUserDTO;
import com.portfolio.demo_backend.dto.user.UpdateUserDTO;
import com.portfolio.demo_backend.model.User;

public class UserMapper {

    public static User toEntity(CreateUserDTO dto) {
        return User.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .build();
    }

    public static CreateUserDTO toDTO(User user) {
        CreateUserDTO dto = new CreateUserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPassword(null);
        return dto;
    }

    public static User fromUpdateDTO(UpdateUserDTO dto) {
        return User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .build();
    }
}

package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.CreateUserDTO;
import com.portfolio.demo_backend.dto.UpdateUserDTO;
import com.portfolio.demo_backend.model.User;

public class UserMapper {

    public static User toEntity(CreateUserDTO dto) {
        return User.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .password(dto.getPassword())
                .build();
    }

    public static CreateUserDTO toDTO(User user) {
        CreateUserDTO dto = new CreateUserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setPassword(null);
        return dto;
    }

    public static User fromUpdateDTO(UpdateUserDTO dto) {
        return User.builder()
                .username(dto.getUsername())
                .password(dto.getPassword())
                .build();
    }
}

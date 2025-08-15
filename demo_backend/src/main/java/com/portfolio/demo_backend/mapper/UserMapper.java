package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.UserDTO;
import com.portfolio.demo_backend.model.User;

public class UserMapper {

    public static User toEntity(UserDTO dto) {
        return User.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .password(dto.getPassword())
                .build();
    }

    public static UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setPassword(null);
        return dto;
    }
}

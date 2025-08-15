package com.portfolio.demo_backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserDTO {
    @Size(min = 3, max = 30)
    private String username;

    @Size(min = 8)
    private String password;
}

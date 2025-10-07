package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.service.UserService;

import jakarta.validation.Valid;

import com.portfolio.demo_backend.dto.user.CreateUserDTO;
import com.portfolio.demo_backend.dto.user.UpdateUserDTO;
import com.portfolio.demo_backend.mapper.UserMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PostMapping
    public ResponseEntity<CreateUserDTO> createUser(@Valid @RequestBody CreateUserDTO dto) {
        User saved = userService.createUser(dto);
        return ResponseEntity.ok(userMapper.toDTO(saved));
    }

    @GetMapping
    public List<CreateUserDTO> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CreateUserDTO> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(userMapper.toDTO(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CreateUserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserDTO dto) {
        System.out.println("Updating user with ID: " + id);
        User updated = userService.updateUser(id, dto);
        return ResponseEntity.ok(userMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}

package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.CreateUserDTO;
import com.portfolio.demo_backend.dto.UpdateUserDTO;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.service.PasscodeService;
import com.portfolio.demo_backend.service.UserService;

import jakarta.validation.Valid;

import com.portfolio.demo_backend.mapper.UserMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasscodeService passcodeService;

    public UserController(UserService userService, PasscodeService passcodeService) {
        this.userService = userService;
        this.passcodeService = passcodeService;
    }

    @PostMapping
    public ResponseEntity<CreateUserDTO> createUser(@Valid @RequestBody CreateUserDTO dto) {
        passcodeService.validate(dto.getPasscode());
        User user = UserMapper.toEntity(dto);
        User saved = userService.createUser(user);
        return ResponseEntity.ok(UserMapper.toDTO(saved));
    }

    @GetMapping
    public List<CreateUserDTO> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CreateUserDTO> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(UserMapper.toDTO(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CreateUserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserDTO dto) {
        System.out.println("Updating user with ID: " + id);
        User updated = userService.updateUser(id, UserMapper.fromUpdateDTO(dto));
        return ResponseEntity.ok(UserMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}

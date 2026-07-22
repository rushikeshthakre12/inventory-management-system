package com.beram.inventory.controller;

import com.beram.inventory.dto.*;
import com.beram.inventory.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request){

        return new AuthResponse(authService.register(request));
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request){

        return new AuthResponse(authService.login(request));
    }
}
package com.servicenest.dto;

public class LoginRequest {
    private String email;
    private String password;
    private String role;

    // Default constructor
    public LoginRequest() {}

    // Parameterized constructor
    public LoginRequest(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "LoginRequest{" +
                "email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
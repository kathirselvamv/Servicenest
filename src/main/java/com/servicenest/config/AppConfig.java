package com.servicenest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new SimplePasswordEncoder();
    }
    
    public interface PasswordEncoder {
        String encode(CharSequence rawPassword);
        boolean matches(CharSequence rawPassword, String encodedPassword);
    }
    
    public static class SimplePasswordEncoder implements PasswordEncoder {
        
        @Override
        public String encode(CharSequence rawPassword) {
            // For development - store as plain text
            // In production, use proper hashing like BCrypt
            return rawPassword.toString();
        }
        
        @Override
        public boolean matches(CharSequence rawPassword, String encodedPassword) {
            return rawPassword.toString().equals(encodedPassword);
        }
    }
}
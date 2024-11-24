package com.Server.config;

import com.Server.auth.AuthenticationService;
import com.Server.auth.RegisterRequest;
import com.Server.user.User;
import com.Server.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.CommandLineRunner;

import java.util.Optional;

@Configuration
public class CommandLineRunnerConfig {

    @Autowired
    private AuthenticationService service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner commandLineRunner() {
        return args -> {
            String email = "admin@admin.com";
            Optional<User> existingUser = userRepository.findByEmail(email);

            if (existingUser.isEmpty()) {
                var admin = RegisterRequest.builder()
                        .full_name("Admin")
                        .email(email)
                        //password admin la admin1234
                        .password("$2a$08$D8/vC0A7RWU5vPBn0vV.seH2cs8eaP4IV481ug4FAJvFKTStBdMTy")
                        .role("ADMIN")
                        .code("123456")
                        .build();
                System.out.println("Admin token: " + service.register(admin).getAccessToken());
            } else {
                System.out.println("Admin email already exists, registration skipped.");
            }
        };
    }
}

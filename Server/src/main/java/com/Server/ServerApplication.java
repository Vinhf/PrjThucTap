package com.Server;

import com.Server.auth.AuthenticationService;
import com.Server.auth.RegisterRequest;
import com.Server.user.User;
import com.Server.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Timestamp;
import java.util.Optional;

import static com.Server.role.Role.ADMIN;
import static com.Server.role.Role.INSTRUCTOR;

@SpringBootApplication
@RequiredArgsConstructor
public class ServerApplication {
	private final PasswordEncoder passwordEncoder;
	private final PasswordEncoder passwordEncode;

	public static void main(String[] args) {

		SpringApplication.run(ServerApplication.class, args);
	}

}

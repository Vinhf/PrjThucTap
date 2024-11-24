package com.Server.auth;

import com.Server.Token.TokenRepository;
import com.Server.Token.TokenType;
import com.Server.Token.token;
import com.Server.config.JwtService;
import com.Server.role.Role;
import com.Server.sendMail.ServiceSendMail.ForgetPassWordVerificationService;
import com.Server.sendMail.ServiceSendMail.SignUpVerificationService;
import com.Server.user.User;
import com.Server.user.UserRepository;
import com.Server.wallet.Wallet;
import com.Server.wallet.WalletRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final WalletRepository walletRepository;

    @Autowired
    private SignUpVerificationService signUpVerificationService;
    @Autowired
    private ForgetPassWordVerificationService forgetPassWordVerificationService;

    public AuthenticationResponse register(RegisterRequest request) {
        try {
            String jwtToken;
            String refreshToken;
            if (request.getCode() == null) {
                throw new IllegalArgumentException("Code cannot be null");
            }
            if(signUpVerificationService.verifyCode(request.getCode(), request.getEmail()) || request.getRole().equals("ADMIN")) {
                signUpVerificationService.clearVerificationCode(request.getEmail());
                userRepository.findByEmail(request.getEmail())
                        .ifPresent(user -> {
                            throw new RuntimeException("Email already exists");
                        });
                System.out.println("request email: " + request.getEmail());
                System.out.println("request code: " + request.getCode());
                User user = User.builder()
                        .full_name(request.getFull_name())
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .sex(request.getSex())
                        .phone(request.getPhone())
                        .birth_day(request.getBirthDay())
                        .address(request.getAddress())
                        .role(Role.valueOf(request.getRole()))
                        .school_name(request.getSchool_name())
                        .create_date(new Timestamp(System.currentTimeMillis()))
                        .build();

                User savedUser = userRepository.save(user);

                // Create and save a wallet for the user
                Wallet wallet = Wallet.builder()
                        .user(savedUser)
                        .balance(BigDecimal.ZERO)
                        .build();
                walletRepository.save(wallet);

                jwtToken = jwtService.generateToken(savedUser);
                refreshToken = jwtService.generateRefreshToken(savedUser);
                savedUserToken(savedUser, jwtToken);
            } else {
                throw new RuntimeException("OPT WRONG");
            }
            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .build();

        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to register user: " + e.getMessage());
        }
    }

    public AuthenticationResponse changePassword(RegisterNewPass request) {
        try {
            String jwtToken;
            String refreshToken;

                User user = userRepository.findByEmail(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("Email not found"));
            System.out.println("EMAIL THAY ĐỔI MẬT KHẨU LÀ: " + request.getEmail());

                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                User savedUser = userRepository.save(user);
                jwtToken = jwtService.generateToken(savedUser);
                refreshToken = jwtService.generateRefreshToken(savedUser);
                return AuthenticationResponse.builder()
                        .accessToken(jwtToken)
                        .refreshToken(refreshToken)
                        .build();

        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to change password: " + e.getMessage());
        }
    }
    public AuthenticationResponse verify(RegisterNewPass request) {
        try {
            String jwtToken;
            String refreshToken;

            if (request.getCode() == null) {
                throw new IllegalArgumentException("Mã xác nhận không thể để trống");
            }

            // Xác minh mã OTP
            if (forgetPassWordVerificationService.verifyCode(request.getCode(), request.getEmail())) {
                // Tìm người dùng bằng email
                System.out.println("Email yêu cầu: " + request.getEmail());
                System.out.println("Mã yêu cầu: " + request.getCode());
                User user = userRepository.findByEmail(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("Email không tồn tại"));
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                forgetPassWordVerificationService.clearVerificationCode(request.getEmail());
                User savedUser = userRepository.save(user);
                // Tạo JWT token
                jwtToken = jwtService.generateToken(savedUser);
                refreshToken = jwtService.generateRefreshToken(savedUser);
                savedUserToken(savedUser, jwtToken);

                // Trả về phản hồi xác thực với các token
                return AuthenticationResponse.builder()
                        .accessToken(jwtToken)
                        .refreshToken(refreshToken)
                        .build();
            } else {
                throw new RuntimeException("Mã xác nhận không hợp lệ");
            }
        } catch (RuntimeException e) {
            System.out.println("Không thể xác minh OTP");
            throw e;
        }
    }




    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var savedUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        savedUserToken(savedUser,jwtToken);
        System.out.println("Email đã đăng nhập là: " + request.getEmail());
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();

    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getUser_id());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    private void savedUserToken(User user, String jwtToken) {
        var Token = token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(Token);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.userRepository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                savedUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }


}

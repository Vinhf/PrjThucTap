package com.Server.sendMail.ServiceSendMail;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ForgetPassWordVerificationService {

        // Mock database to store verification codes
        private Map<String, String> verificationCodes = new HashMap<>();

        // Store verification code for email
        public void storeVerificationCode(String code, String email) {
            verificationCodes.put(code, email);
            System.out.println("đây là storeVerificationCode: " + verificationCodes);
        }

        // Verify code for email
        public boolean verifyCode(String code, String email) {
            if (code == null) {
                throw new IllegalArgumentException("Code cannot be null");
            }
            return code.equals(verificationCodes.get(email));
        }

        // Clear verification code after verification
        public void clearVerificationCode(String email) {
            verificationCodes.remove(email);
        }
    }

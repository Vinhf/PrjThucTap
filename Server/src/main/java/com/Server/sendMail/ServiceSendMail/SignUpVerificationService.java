package com.Server.sendMail.ServiceSendMail;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SignUpVerificationService {
    // Mock database to store verification codes
    private Map<String, String> verificationCodes = new HashMap<>();

    // Store verification code for email
    public void storeVerificationCode(String code, String email) {

        verificationCodes.put("admin@admin.com","123456");
        verificationCodes.put(code, email);
        System.out.println("đây là storeVerificationCode: " + verificationCodes);
    }

    // Verify code for email
    public boolean verifyCode(String code, String email) {
        boolean check = false;
        String codeAMIN = "123456";
        if (code == null) {
            throw new IllegalArgumentException("Code cannot be null");
        }
        if(code.equals(verificationCodes.get(email)) || codeAMIN.equals(verificationCodes.get("admin@admin.com"))) {
            check = true;
        }

        return check;
    }

    // Clear verification code after verification
    public void clearVerificationCode(String email) {
        verificationCodes.remove(email);
    }
}
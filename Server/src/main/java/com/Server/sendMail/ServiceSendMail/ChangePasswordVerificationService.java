package com.Server.sendMail.ServiceSendMail;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ChangePasswordVerificationService {

    private Map<String, VerificationCode> verificationCodes = new HashMap<>();

    // Store verification code with timestamp for email
    public void storeVerificationCode(String email, String code) {
        verificationCodes.put(email, new VerificationCode(code, System.currentTimeMillis()));
    }

    // Verify code for email with timestamp check
    public boolean verifyCode(String email, String code) {
        VerificationCode storedCode = verificationCodes.get(email);
        if (storedCode == null) {
            return false;
        }
        long currentTime = System.currentTimeMillis();
        long timeElapsed = currentTime - storedCode.getTimestamp();
        // Check if the code is valid within 1 minute (60000 milliseconds)
        return storedCode.getCode().equals(code) && timeElapsed <= 180000;
    }

    // Clear verification code after verification
    public void clearVerificationCode(String email) {
        verificationCodes.remove(email);
    }

    // Inner class to hold the code and timestamp
    private static class VerificationCode {
        private final String code;
        private final long timestamp;

        public VerificationCode(String code, long timestamp) {
            this.code = code;
            this.timestamp = timestamp;
        }

        public String getCode() {
            return code;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }
}

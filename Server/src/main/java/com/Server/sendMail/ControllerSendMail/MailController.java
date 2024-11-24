package com.Server.sendMail.ControllerSendMail;

import com.Server.sendMail.ModelSendMail.CetificateRequest;
import com.Server.sendMail.ModelSendMail.MailStructure;
import com.Server.sendMail.ServiceSendMail.*;
import com.Server.user.UserRepository;
import com.Server.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.NoSuchElementException;



@RestController
@RequestMapping("api/v1/auth/mail")
public class MailController {

    @Autowired
    private MailServiceSignUp mailServiceSignUp;

    @Autowired
    private MailServerForgetPassWord mailServerForgetPassWord;

    @Autowired
    private MailServiceChangePassword mailServiceChangePassword;

    @Autowired
    private SignUpVerificationService signUpVerificationService;

    @Autowired
    private ChangePasswordVerificationService changePasswordVerificationService;

    @Autowired
    private  CetificateMailService cetificateMailService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/send/signup")
    public ResponseEntity<String> sendMail(@RequestBody MailStructure mailStructure) {
        try {
            // Kiểm tra xem email đã tồn tại hay chưa
            if (userRepository.findByEmail(mailStructure.getEmail()).isEmpty()) {
                // Nếu email chưa tồn tại, gửi mail và trả về thông báo thành công
                mailServiceSignUp.sendMail(mailStructure.getEmail(), mailStructure);
                System.out.println("chạy vào");
                return ResponseEntity.ok("User registered successfully");
            }
            // Nếu email đã tồn tại, in ra lỗi trùng và trả về thông báo lỗi
            System.out.println("Email đã tồn tại");
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        } catch (Exception e) {
            // Nếu có lỗi khác, ném ngoại lệ
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/certificate")
    public ResponseEntity<String> sendCertificate(@RequestBody CetificateRequest certificateRequest) {
        try {
            cetificateMailService.sendMailCertificate(
                    certificateRequest.getEmail(),
                    certificateRequest.getCourseId(),
                    certificateRequest.getInstructorId()
            );
            return ResponseEntity.ok("Certificate email sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send certificate email.");
        }
    }


    @PostMapping("/send/forgotpassword")
    public ResponseEntity<String> searchMail(@RequestBody MailStructure mailStructure) {
        try {
        if (userRepository.findByEmail(mailStructure.getEmail()).isPresent()) {
            //Nếu có mail, gửi mail và trả về thông báo thành công
            mailServerForgetPassWord.sendMail(mailStructure.getEmail(), mailStructure);
            System.out.println("Đã gửi mã otp cho mail: " + mailStructure.getEmail());
            return ResponseEntity.ok("Đã gửi mail thành công    ");
        }
            System.out.println("Mail không tồn tại");
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Mail not already exists");
        } catch (Exception e) {
            // Nếu có lỗi khác, ném ngoại lệ
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/send/changepass")
    public String changePass(@RequestBody MailStructure mailStructure) {
        mailServiceChangePassword.sendMail(mailStructure.getEmail(), mailStructure);
        return "Successfully sent the mail!!!";
    }

    @PostMapping("/verify/signup")
    public String verifySignUp(@RequestBody MailStructure mailStructure) {
        if (signUpVerificationService.verifyCode(mailStructure.getEmail(), mailStructure.getCode())) {
            signUpVerificationService.clearVerificationCode(mailStructure.getEmail());
            User user = new User();
            user.setEmail(mailStructure.getEmail());
            userRepository.save(user);
            return "Account created successfully!";
        } else {
            return "Invalid verification code.";
        }
    }

    @PostMapping("/verify/changepass")
    public String verifyChangePassword(@RequestBody MailStructure mailStructure) {
        if (changePasswordVerificationService.verifyCode(mailStructure.getEmail(), mailStructure.getCode())) {
            changePasswordVerificationService.clearVerificationCode(mailStructure.getEmail());
            return "Verification successful, please change your password.";
        } else {
            return "Invalid verification code.";
        }
    }

    @PostMapping("/update/changepass")
    public String updatePassword(@RequestBody MailStructure mailStructure) {
        try {
            User user = userRepository.findByEmail(mailStructure.getEmail())
                    .orElseThrow(() -> new NoSuchElementException("User not found"));
            user.setPassword(mailStructure.getNewPass());
            userRepository.save(user);
            return "Password updated successfully!";
        } catch (NoSuchElementException e) {
            return "User not found.";
        }
    }
}
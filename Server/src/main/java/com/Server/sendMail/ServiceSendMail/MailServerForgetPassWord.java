package com.Server.sendMail.ServiceSendMail;

import com.Server.sendMail.ModelSendMail.MailStructure;
import com.Server.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Random;

@Service
public class MailServerForgetPassWord {

    private static final Logger logger = LoggerFactory.getLogger(MailServiceChangePassword.class);

        @Autowired
        private JavaMailSender mailSender;

        @Autowired
        private SpringTemplateEngine templateEngine;

        @Autowired
        private ForgetPassWordVerificationService forgetPassWordVerificationService;


        @Value("$(AEG3)")
        private String fromMail;

        private UserRepository userRepository;

        @Async("taskExecutor")
        public void sendMail(String email, MailStructure mailStructure) {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            try {
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                helper.setFrom(fromMail);
                helper.setTo(email);
                helper.setSubject("KHÔI PHỤC TÀI KHOẢN KHÓA HỌC");

                String verificationCode = generateVerificationCode();

                Context context = new Context();
                context.setVariable("verificationCode", verificationCode);

                String htmlContent = templateEngine.process("forgetPassword", context);
                helper.setText(htmlContent, true);

                mailSender.send(mimeMessage);

                // Store the verification code
                System.out.println(email);
                System.out.println("đây là verificationCode: "+verificationCode);
                forgetPassWordVerificationService.storeVerificationCode(email, verificationCode);
                logger.info("Email sent successfully to {}", email);
            } catch (MessagingException e) {
                logger.error("Failed to send email to {}", email, e);
                throw new RuntimeException("Failed to send email", e);
            }
        }

        private String generateVerificationCode() {
            Random random = new Random();
            int code = 100000 + random.nextInt(900000);
            return String.valueOf(code);
        }
    }

package com.Server.sendMail.ServiceSendMail;

import com.Server.sendMail.ModelSendMail.MailStructure;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
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
import java.util.logging.Logger;

@Service
public class MailServiceChangePassword {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Autowired
    private ChangePasswordVerificationService changePasswordVerificationService;

    @Value("$(AEG3)")
    private String fromMail;


    @Async("taskExecutor")
    public void sendMail(String mail, MailStructure mailStructure) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromMail);
            helper.setTo(mail);
            helper.setSubject("THAY ĐỔI MẬT KHẨU TÀI KHOẢN KHÓA HỌC");

            String verificationCode = generateVerificationCodechangePass();
            String emailContent = generateEmailContent(verificationCode);

            helper.setText(emailContent, true);

            mailSender.send(mimeMessage);

            // Store the verification code with timestamp
            changePasswordVerificationService.storeVerificationCode(mail, verificationCode);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String generateEmailContent(String verificationCode) {
        Context context = new Context();
        context.setVariable("verificationCode", verificationCode);
        return templateEngine.process("changePasswordEmail", context);
    }

    private String generateVerificationCodechangePass() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}

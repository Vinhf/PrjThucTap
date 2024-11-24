package com.Server.sendMail.ServiceSendMail;

import com.Server.course.Course;
import com.Server.course.CourseRepository;
import com.Server.sendMail.ModelSendMail.MailStructure;
import com.Server.user.User;
import com.Server.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
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

import java.awt.*;
import java.awt.font.TextAttribute;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.text.AttributedString;
import java.time.format.DateTimeFormatter;
import javax.imageio.ImageIO;

@Service
@RequiredArgsConstructor
public class CetificateMailService {

    private static final Logger logger = LoggerFactory.getLogger(CetificateMailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Value("$(AEG3)")
    private String fromMail;

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Async("taskExecutor")
    public void sendMailCertificate(String email, Long courseId, Long instructorId) {
        User student = userRepository.findByEmail(email).orElse(null);
        User instructor = userRepository.findById(instructorId).orElse(null);
        Course course = courseRepository.findById(courseId).orElse(null);

        if (student == null || instructor == null || course == null) {
            logger.error("Failed to send certificate: invalid student, instructor, or course.");
            return;
        }

        String instructorLastName = getLastName(instructor.getFull_name());

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromMail);
            helper.setTo(email);
            helper.setSubject("Your Course Certificate");

            // Load the certificate template
            BufferedImage certificateTemplate = ImageIO.read(new File("cetificate.png"));

            // Create a graphics context
            Graphics2D g2d = certificateTemplate.createGraphics();

            // Set rendering hints for better text quality
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            // Set font and color for student's name and course name
            g2d.setFont(new Font("Serif", Font.BOLD, 36));
            g2d.setColor(Color.BLACK);
            g2d.drawString(student.getFull_name(), 200, 150);  // Adjust coordinates as needed
            g2d.drawString(course.getCourseName(), 200, 200); // Adjust coordinates as needed

            // Set font for instructor's last name resembling a signature
            g2d.setFont(new Font("Script", Font.PLAIN, 36));
            g2d.setColor(Color.BLACK);
            g2d.drawString(instructorLastName, 200, 250); // Adjust coordinates as needed

            // Dispose graphics context and save the modified image
            g2d.dispose();
            File outputfile = new File("cetificate.png");
            ImageIO.write(certificateTemplate, "png", outputfile);

            // Attach the image to the email
            helper.addAttachment("certificate.png", outputfile);

            // Send the email
            mailSender.send(mimeMessage);

            // Log the action
            logger.info("Certificate sent to {}", email);

        } catch (MessagingException | IOException e) {
            logger.error("Failed to send certificate to {}", email, e);
            throw new RuntimeException("Failed to send certificate", e);
            
        }
    }

    private String getLastName(String fullName) {
        String[] parts = fullName.split(" ");
        return parts[parts.length - 1];
    }
}

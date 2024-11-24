package com.Server.sendMail.ServiceSendMail;

import com.Server.payment.paymentCourse.PaymentSave;
import com.Server.payment.paymentTopup.PaymentTopup;
import com.Server.payment.paymentTopup.PaymentTopupRepository;
import com.Server.sendMail.ModelSendMail.MailStructure;
import com.Server.user.User;
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

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Service
public class MailServiceBillBuyCourse {

    private static final Logger logger = LoggerFactory.getLogger(MailServiceBillBuyCourse.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    private final PaymentTopupRepository paymentTopupRepository;

    @Autowired
    private BillBuyCourseStore billBuyCourseStore;

    // Constructor với @Autowired cho các phụ thuộc còn lại
    @Autowired
    public MailServiceBillBuyCourse(PaymentTopupRepository paymentTopupRepository, BillBuyCourseStore billBuyCourseStore) {
        this.paymentTopupRepository = paymentTopupRepository;
        this.billBuyCourseStore = billBuyCourseStore;
    }
        @Value("$(AEG3)")
        private String fromMail;
        private UserRepository userRepository;

    public MailServiceBillBuyCourse(PaymentTopupRepository paymentTopupRepository) {
        this.paymentTopupRepository = paymentTopupRepository;
    }

    @Async("taskExecutor")
        public void sendMail(String email, MailStructure mailStructure, String CodeTransaction, PaymentSave paymentSave) {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedDate = paymentSave.getCreate_Date().toLocalDateTime().format(formatter);
            try {
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                helper.setFrom(fromMail);
                helper.setTo(email);
                helper.setSubject("Thông báo về việc phát hành Hóa đơn điện tử");
                billBuyCourseStore.getPaymentSave(CodeTransaction, paymentSave);

                Context context = new Context();
                context.setVariable("CodeTransaction", CodeTransaction);
                context.setVariable("courseName", paymentSave.getCourseName());
                context.setVariable("nameBuyer", paymentSave.getNameBuyer());
                context.setVariable("createDate", formattedDate);
                context.setVariable("typeOfPayment", paymentSave.getType_of_payment());
                context.setVariable("amount", paymentSave.getAmount());


                String htmlContent = templateEngine.process("billMail", context);
                helper.setText(htmlContent, true);

                mailSender.send(mimeMessage);

                // Store the verification code
                System.out.println(email);

            } catch (MessagingException e) {
                logger.error("Failed to send email to {}", email, e);
                throw new RuntimeException("Failed to send email", e);
            }
        }

    }

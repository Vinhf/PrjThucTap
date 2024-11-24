package com.Server.payment.paymentTopup;

import com.Server.config.WalletService;
import com.Server.sendMail.ModelSendMail.MailStructure;
import com.Server.sendMail.ServiceSendMail.BillBuyCourseStore;
import com.Server.sendMail.ServiceSendMail.BillTopUpStore;
import com.Server.sendMail.ServiceSendMail.MailServiceBillBuyCourse;
import com.Server.sendMail.ServiceSendMail.MailServiceBillTopup;
import com.Server.user.User;
import com.Server.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.Instant;

@RestController
@RequestMapping("/api/v1/auth")
public class PaymentResponseController {

    private final WalletService walletService;
    private final TemporaryStorageService temporaryStorageService;
    private final PaymentTopupRepository paymentTopupRepository;
    private final UserRepository userRepository;
    private final BillTopUpStore billTopUpStore;
    private final MailServiceBillTopup mailServiceBillTopup;


    public PaymentResponseController(WalletService walletService, TemporaryStorageService temporaryStorageService, PaymentTopupRepository paymentTopupRepository, UserRepository userRepository, BillTopUpStore billTopUpStore, MailServiceBillTopup mailServiceBillTopup) {
        this.walletService = walletService;
        this.temporaryStorageService = temporaryStorageService;
        this.paymentTopupRepository = paymentTopupRepository;
        this.userRepository = userRepository;
        this.billTopUpStore = billTopUpStore;
        this.mailServiceBillTopup = mailServiceBillTopup;
    }

    @GetMapping("/wallet")
    public void handlePaymentResponse(HttpServletRequest request, HttpServletResponse response) {
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        String vnp_TxnRef = request.getParameter("vnp_TxnRef");
        PaymentInfo paymentInfo = temporaryStorageService.getPaymentInfo(vnp_TxnRef);

        if (paymentInfo == null) {
            try {
                response.getWriter().write("Invalid transaction reference.");
                return;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        String status;
        if ("00".equals(vnp_ResponseCode)) {
            // Thanh toán thành công, thực hiện các hành động cần thiết (cập nhật trạng thái thanh toán, ...)
            try {
                String email = paymentInfo.getEmail();
                Long amount = paymentInfo.getAmount() / 100;
                System.out.println("Email: " + email);
                System.out.println("Amount: " + amount);
                //update số tiền vào ví
                Double balance = walletService.updateBalance(email, amount);

                // Lấy thông tin người dùng từ email
                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    // Tạo đối tượng PaymentTopup, lưu lịch sử giao dịch
                    PaymentTopup paymentTopup = PaymentTopup.builder()
                            .user(user)
                            .create_Date(Timestamp.from(Instant.now()))
                            .type_of_payment("Top up the wallet") // Hoặc lấy từ paymentInfo nếu có
                            .amount(amount)
                            .Transaction_ID(vnp_TxnRef)
                            .status("Success")
                            .build();

                    // Lưu đối tượng PaymentTopup vào cơ sở dữ liệu
                    paymentTopupRepository.save(paymentTopup);
                    billTopUpStore.storePaymentSave(vnp_TxnRef, paymentTopup);

                    mailServiceBillTopup.sendMail(email, new MailStructure(), vnp_TxnRef, paymentTopup);

                }
                //chuyển hướng sang giao diện khi xác nhận là thanh toán thành công!
                response.sendRedirect("http://localhost:5173/protected/payment/success/" + amount);
            } catch (NumberFormatException e) {
                e.printStackTrace();
                try {
                    response.getWriter().write("Invalid amount format.");
                } catch (IOException ioException) {
                    ioException.printStackTrace();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            status = "Reject";
            // Xử lý trường hợp thanh toán không thành công
            try {
                response.getWriter().write("Payment failed with error code: " + vnp_ResponseCode);

                // Lưu thông tin thanh toán thất bại vào cơ sở dữ liệu
                String email = paymentInfo.getEmail();
                Long amount = paymentInfo.getAmount() / 100;

                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    PaymentTopup paymentTopup = PaymentTopup.builder()
                            .user(user)
                            .create_Date(Timestamp.from(Instant.now()))
                            .type_of_payment("Top up the wallet") // Hoặc lấy từ paymentInfo nếu có
                            .amount(amount)
                            .Transaction_ID(vnp_TxnRef)
                            .status(status)
                            .build();

                    paymentTopupRepository.save(paymentTopup);

                }
                response.sendRedirect("http://localhost:5173/protected/wallet");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}

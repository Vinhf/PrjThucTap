package com.Server.wallet;

import com.Server.config.WalletService;
import com.Server.payment.paymentTopup.PaymentTopup;
import com.Server.payment.paymentTopup.PaymentTopupRepository;
import com.Server.payment.paymentTopup.TransactionDTO;
import com.Server.payment.paymentTransfer.PaymentTransferDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
public class WalletController {


    private final WalletService walletService;
    private final PaymentTopupRepository paymentTopupRepository;

    public WalletController(WalletService walletService, PaymentTopupRepository paymentTopupRepository) {
        this.walletService = walletService;
        this.paymentTopupRepository = paymentTopupRepository;
    }

    @GetMapping("/balance")
    public ResponseEntity<?> getWalletBalance(@RequestParam String email) {
        try {
            Double balance = walletService.getBalance(email);
            String fullName = walletService.getFullName(email);
            if (balance != null) {
                // Log số dư ví
                System.out.println("Wallet balance: " + balance);
                return ResponseEntity.ok(balance); // Trả về số dư ví thành công
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Wallet not found");
            }
        } catch (Exception e) {
            // Log lỗi nếu có
            System.err.println("Error fetching wallet balance: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching wallet balance");
        }
    }

    @GetMapping("/user-fullname")
    public ResponseEntity<?> getUserFullName(@RequestParam String email) {
        try {
            String fullName = walletService.getFullName(email);
            if (fullName != null) {
                return ResponseEntity.ok(fullName);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user full name");
        }
    }
    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(@RequestParam String email) {
        try {
            List<TransactionDTO> transactions = walletService.getTransactionsByEmail(email);
            System.out.println("Email transactions là: " + email);

            if (!transactions.isEmpty()) {
                // Log số lượng giao dịch được lấy
                System.out.println("Transactions retrieved: " + transactions.size());

                // Trả về danh sách các giao dịch với HTTP status OK
                return ResponseEntity.ok(transactions);
            } else {
                // Trả về HTTP status NOT_FOUND nếu không tìm thấy giao dịch nào
                return ResponseEntity.ok(Collections.emptyList());
            }
        } catch (Exception e) {
            // Log lỗi nếu có lỗi xảy ra khi lấy dữ liệu giao dịch
            System.err.println("Error fetching transactions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching transactions");
        }
    }
    @PostMapping("/transfer")
    public ResponseEntity<String> transferMoney(@RequestBody PaymentTransferDTO paymentTransferDTO) {
        try {
            walletService.transferMoney(paymentTransferDTO);
            System.out.println("Email người gửi là: " + paymentTransferDTO.getUserEmail());
            System.out.println("Email người nhận là: " + paymentTransferDTO.getRecipientEmail());
            System.out.println("Số tiền là: " + paymentTransferDTO.getAmount());
            System.out.println("Nội dung là: " + paymentTransferDTO.getContent());
            return ResponseEntity.ok("Transfer successful");
        } catch (Exception e) {
            System.out.println("Email người gửi là: " + paymentTransferDTO.getUserEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


}

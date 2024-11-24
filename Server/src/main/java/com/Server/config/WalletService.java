package com.Server.config;

import com.Server.payment.paymentTopup.PaymentTopup;
import com.Server.payment.paymentTopup.PaymentTopupRepository;
import com.Server.payment.paymentTopup.TransactionDTO;
import com.Server.payment.paymentTransfer.PaymentTransferDTO;
import com.Server.user.UserRepository;
import com.Server.wallet.WalletRepository;
import com.Server.user.User;
import com.Server.wallet.Wallet;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PaymentTopupRepository transactionRepository;
    private final PaymentTopupRepository paymentTopupRepository;





    public Double getBalance(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        System.out.println("user: " + user.getFull_name());
        if (user != null) {
            Wallet wallet = walletRepository.findByUser(user).orElse(null);
            if (wallet != null) {
                BigDecimal balance = wallet.getBalance();
                return balance != null ? balance.doubleValue() : null;
            }
        }
        return null;
    }
    public String getFullName(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        return user != null ? user.getFull_name() : null;
    }
    public List<TransactionDTO> getTransactionsByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            List<PaymentTopup> transactions = transactionRepository.findByUser(user);
            return transactions.stream()
                    .map(this::convertToTransactionDTO)
                    .collect(Collectors.toList());
        } else {
            return List.of(); // Return an empty list if user not found
        }
    }
    private TransactionDTO convertToTransactionDTO(PaymentTopup paymentTopup) {
        return new TransactionDTO(
                paymentTopup.getPaymentTopUpId(),
                paymentTopup.getCreate_Date(),
                paymentTopup.getTransaction_ID(),
                paymentTopup.getAmount(),
                paymentTopup.getStatus(),
                paymentTopup.getType_of_payment()
        );
    }


    public Double updateBalance(String email, Long amount) {
        User user = userRepository.findByEmail(email).orElse(null);
        System.out.println("Email của update: " + email);
        System.out.println("Amount của update: " + amount);
        if (user != null) {
            Wallet wallet = walletRepository.findByUser(user).orElse(null);
            if (wallet != null) {
                // Tính toán số dư mới
                BigDecimal newBalance = wallet.getBalance().add(BigDecimal.valueOf(amount));

                // Cập nhật số dư mới vào ví
                wallet.setBalance(newBalance);
                walletRepository.save(wallet); // Lưu lại thay đổi vào cơ sở dữ liệu

                return newBalance.doubleValue(); // Trả về số dư mới dưới dạng Double
            }
        }
        return null; // Trả về null nếu không tìm thấy người dùng hoặc ví tương ứng
    }

    @Transactional
    public void transferMoney(PaymentTransferDTO paymentTransferDTO) throws Exception {
        String recipientEmail = paymentTransferDTO.getRecipientEmail();
        Long amount = paymentTransferDTO.getAmount();
        String content = paymentTransferDTO.getContent();

        User sender = userRepository.findByEmail(paymentTransferDTO.getUserEmail()).orElse(null);
        User recipient = userRepository.findByEmail(paymentTransferDTO.getRecipientEmail()).orElse(null);

        if (sender == null || recipient == null) {
            throw new Exception("Sender or recipient not found");
        }

        Wallet walletSender = walletRepository.findByUser(sender).orElse(null);
        Wallet walletReceiver = walletRepository.findByUser(recipient).orElse(null);
        BigDecimal senderBalance = walletSender != null ? walletSender.getBalance() : BigDecimal.ZERO; // Giả định một số dư mặc định là 0 nếu wallet là null
        if (senderBalance.compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new Exception("Insufficient balance");
        }

        // Update sender's balance
        BigDecimal newBalanceSender = walletSender.getBalance().subtract(BigDecimal.valueOf(amount));
        walletSender.setBalance(newBalanceSender);
        walletRepository.save(walletSender);

        // Update recipient's balance
       BigDecimal newBalanceReceiver = walletReceiver.getBalance().add(BigDecimal.valueOf(amount));
       walletReceiver.setBalance(newBalanceReceiver);
       walletRepository.save(walletReceiver);

        // Log transaction for sender
        PaymentTopup paymentSender = new PaymentTopup().builder()
                .user(sender)
                .create_Date(Timestamp.from(Instant.now()))
                .type_of_payment("Send money to " + recipientEmail + ":" + content)
                .amount(amount)
                .Transaction_ID(generateTransactionId())
                .status("Success")
                .build();
        paymentTopupRepository.save(paymentSender);


        // Log transaction for recipient
        PaymentTopup paymentRecipient = new PaymentTopup().builder()
                .user(recipient)
                .create_Date(Timestamp.from(Instant.now()))
                .type_of_payment("Receive money from " + paymentTransferDTO.getUserEmail() + ":" + content)
                .amount(amount)
                .Transaction_ID(generateTransactionId())
                .status("Success")
                .build();
        paymentTopupRepository.save(paymentRecipient);
    }

    private String generateTransactionId() {
        Random random = new Random();
        int transactionId = 10000000 + random.nextInt(90000000);
        return String.valueOf(transactionId);
    }
}
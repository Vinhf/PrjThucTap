package com.Server.payment.paymentTopup;

import com.Server.course.Course;
import com.Server.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Payment_Wallet")
public class PaymentTopup {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long paymentTopUpId;

        @ManyToOne
        @JoinColumn(name = "user_id")
        private User user;

        private Timestamp create_Date;
        private String type_of_payment;
        private Long amount;
        private String Transaction_ID;
        private String status;
}
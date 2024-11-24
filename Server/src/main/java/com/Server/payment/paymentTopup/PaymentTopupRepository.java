package com.Server.payment.paymentTopup;

import com.Server.user.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTopupRepository extends JpaRepository<PaymentTopup, Long> {
    List<PaymentTopup> findByUser(User user);
}

package com.Server.payment.paymentTopup;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class TemporaryStorageService {

    private final Map<String, PaymentInfo> storage = new HashMap<>();

    public void storePaymentInfo(String txnRef, PaymentInfo paymentInfo) {
        storage.put(txnRef, paymentInfo);
    }

    public PaymentInfo getPaymentInfo(String txnRef) {
        return storage.get(txnRef);
    }
}

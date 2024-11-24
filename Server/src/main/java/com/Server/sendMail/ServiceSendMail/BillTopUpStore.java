package com.Server.sendMail.ServiceSendMail;

import com.Server.payment.paymentTopup.PaymentTopup;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class BillTopUpStore {
    private final Map<String, PaymentTopup> storage = new HashMap<>();

    public void storePaymentSave(String CodeTransaction, PaymentTopup paymentTopup) {
        storage.put(CodeTransaction, paymentTopup);
    }

    public PaymentTopup getPaymentTopup(String CodeTransaction, PaymentTopup paymentTopup) {
        return storage.get(CodeTransaction);
    }
}

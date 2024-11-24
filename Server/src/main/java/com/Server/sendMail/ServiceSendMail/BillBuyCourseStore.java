package com.Server.sendMail.ServiceSendMail;

import com.Server.payment.paymentCourse.PaymentSave;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class BillBuyCourseStore {

    private final Map<String, PaymentSave> storage = new HashMap<>();

    public void storePaymentSave(String CodeTransaction, PaymentSave paymentSave) {
        storage.put(CodeTransaction, paymentSave);
    }

    public PaymentSave getPaymentSave(String CodeTransaction, PaymentSave paymentSave) {
        return storage.get(CodeTransaction);
    }
}
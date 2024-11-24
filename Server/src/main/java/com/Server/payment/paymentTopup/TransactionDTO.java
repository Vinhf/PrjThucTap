package com.Server.payment.paymentTopup;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class TransactionDTO {
    private Long paymentTopUpId;
    private Timestamp createDate;
    private String transactionId;
    private Long amount;
    private String status;
    private String typeOfPayment;

    // Constructor
    public TransactionDTO(Long paymentTopUpId, Timestamp createDate, String transactionId, Long amount, String status, String typeOfPayment) {
        this.paymentTopUpId = paymentTopUpId;
        this.createDate = createDate;
        this.transactionId = transactionId;
        this.amount = amount;
        this.status = status;
        this.typeOfPayment = typeOfPayment;
    }


}

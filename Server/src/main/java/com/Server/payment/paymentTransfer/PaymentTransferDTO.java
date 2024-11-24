package com.Server.payment.paymentTransfer;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentTransferDTO {
    private String userEmail;
    private String recipientEmail;
    private Long amount;
    private String content;
}

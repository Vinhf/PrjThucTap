package com.Server.payment.paymentCourse;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class PaymentSave {

    private String nameBuyer;
    private String courseName;
    private Timestamp create_Date;
    private String type_of_payment;
    private Long amount;
}

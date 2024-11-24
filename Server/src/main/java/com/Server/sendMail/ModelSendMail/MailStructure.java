package com.Server.sendMail.ModelSendMail;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MailStructure {

    private String email;
    private String newPass;
    private String subject;
    private String message;
    private String code;

}

package com.Server.sendMail.ModelSendMail;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CetificateRequest {
    private String email;
    private Long courseId;
    private Long InstructorId;


}
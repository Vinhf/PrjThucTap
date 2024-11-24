package com.Server.auth;

import com.Server.role.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String full_name;
    private String email;
    private String password;
    private String sex;
    private LocalDate birthDay;
    private String address;
    private String phone;
    private String school_name;


    private String code;
    private String role;
}

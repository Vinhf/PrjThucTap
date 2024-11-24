package com.Server.user;

import com.Server.Token.token;
import com.Server.role.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long userId;
    private String avt;
    private String full_name;
    private String email;
    private String password;
    private String sex;
    private LocalDate birth_day;
    private String address;
    private String phone;
    private String school_name;

    private Timestamp create_date;
    private String role;
    private boolean status;
}

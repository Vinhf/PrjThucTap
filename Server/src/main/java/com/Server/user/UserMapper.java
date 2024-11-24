package com.Server.user;

import com.Server.role.Role;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;

public class UserMapper {
    public static UserDTO mapToUserDto(User user) {
        Role role = user.getRole();
        List<SimpleGrantedAuthority> authorities = role.getAuthorities();
        String roleType = authorities.get(0).getAuthority();
        return new UserDTO(
                user.getUser_id(),
                user.getAvt(),
                user.getFull_name(),
                user.getEmail(),
                user.getPassword(),
                user.getSex(),
                user.getBirth_day(),
                user.getAddress(),
                user.getPhone(),
                user.getSchool_name(),
                user.getCreate_date(),
                user.getRole().name(),
                user.isStatus()
        );
    }

    public static User mapToUser(UserDTO userDTO, Role role) {
        return new User(
                        userDTO.getUserId(),
                        userDTO.getAvt(),
                        userDTO.getFull_name(),
                        userDTO.getEmail(),
                        userDTO.getPassword(),
                        userDTO.getSex(),
                        userDTO.getBirth_day(),
                        userDTO.getAddress(),
                        userDTO.getPhone(),
                        userDTO.getSchool_name(),
                        userDTO.isStatus(),
                        userDTO.getCreate_date(),
                        role,
                        new ArrayList<>()
        );
    }
}

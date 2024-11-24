package com.Server.user;


import java.time.LocalDate;

import com.Server.role.Role;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;
import com.Server.Token.token;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user")
public class User implements UserDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long user_id;
	private String avt;
	private String full_name;
	private String email;
	@Getter
    private String password;
	private String sex;
	private LocalDate birth_day;
	private String address;
	private String phone;
	private String school_name;
	@Builder.Default
	private boolean status = true;

	private Timestamp create_date;

	@Enumerated(EnumType.STRING)
	private Role role;

	@OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
	@BatchSize(size = 10)
	@JsonIgnore // Tránh việc vòng lặp khi serialize
	private List<token> tokens;



	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return role.getAuthorities();
	}

	@Override
	public String getUsername() {
		return email;
	}


    @Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	public boolean isStudentOrAdmin() {
		return role == Role.STUDENT || role == Role.ADMIN;
	}

}

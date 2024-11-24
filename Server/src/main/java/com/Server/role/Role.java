package com.Server.role;

import com.Server.user.Permission;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.Server.user.Permission.ADMIN_READ;
import static com.Server.user.Permission.ADMIN_UPDATE;
import static com.Server.user.Permission.ADMIN_DELETE;
import static com.Server.user.Permission.ADMIN_CREATE;
import static com.Server.user.Permission.INSTRUCTOR_READ;
import static com.Server.user.Permission.INSTRUCTOR_UPDATE;
import static com.Server.user.Permission.INSTRUCTOR_DELETE;
import static com.Server.user.Permission.INSTRUCTOR_CREATE;

@Getter
@RequiredArgsConstructor
public enum Role {

	STUDENT(Collections.emptySet()),
	ADMIN(
			Set.of(
			ADMIN_READ,
			ADMIN_UPDATE,
			ADMIN_DELETE,
					INSTRUCTOR_READ,
					INSTRUCTOR_UPDATE,
					INSTRUCTOR_DELETE,
					INSTRUCTOR_CREATE
			)
  ),
	INSTRUCTOR(
			Set.of(
					INSTRUCTOR_READ,
					INSTRUCTOR_UPDATE,
					INSTRUCTOR_DELETE,
					INSTRUCTOR_CREATE
			)
  );
	private final Set<Permission> permissions;

	public List<SimpleGrantedAuthority> getAuthorities() {
		var authorities = getPermissions()
				.stream()
				.map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
				.collect(Collectors.toList());
		authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
		return authorities;
	}
}


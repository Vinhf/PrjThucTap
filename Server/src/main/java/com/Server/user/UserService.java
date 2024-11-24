package com.Server.user;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepo;

	private PasswordEncoder passwordEncoder;

	@Autowired
	public UserService(PasswordEncoder passwordEncoder, UserRepository userRepo) {
		this.passwordEncoder = passwordEncoder;
		this.userRepo = userRepo;
	}
	public User saveUser(User user) {
		return userRepo.save(user);
	}

	public UserDTO findById(Long user_id) {
		Optional<User> user = userRepo.findById(user_id);
		if (user.isEmpty()) {
			throw new RuntimeException("User not found");
		}
		User userData = user.get();
		return UserMapper.mapToUserDto(userData);
	}

	public UserDTO findByEmail(String email) {
		Optional<User> user = userRepo.findByEmail(email);
		if (user.isEmpty()) {
			throw new RuntimeException("User not found");
		}
		User userData = user.get();
		return UserMapper.mapToUserDto(userData);
	}

	@Transactional
	public List<UserDTO> findAll() {
		List<User> users = userRepo.findAll();
		return users.stream().map(UserMapper::mapToUserDto).toList();
	}

	public List<UserDTO> findNoAMIN() {
		List<User> users = userRepo.findUsersWithoutAdminRole();
		return users.stream().map(UserMapper::mapToUserDto).toList();
	}

	public User updateUser(User user) {
		User existingUser = userRepo.findById(user.getUser_id())
				.orElseThrow(() -> new RuntimeException("User not found"));

		// Clear existing data
		existingUser.setAvt(null);
		existingUser.setFull_name(null);
		existingUser.setEmail(null);
		existingUser.setPassword(null);
		existingUser.setSex(null);
		existingUser.setBirth_day(null);
		existingUser.setAddress(null);
		existingUser.setPhone(null);
		existingUser.setSchool_name(null);
		existingUser.setCreate_date(null);
		existingUser.setRole(null);
		existingUser.setStatus(false);

		// Update with new data
		existingUser.setAvt(user.getAvt());
		existingUser.setFull_name(user.getFull_name());
		existingUser.setEmail(user.getEmail());
		existingUser.setPassword(passwordEncoder.encode(user.getPassword())); // Assuming you want to update the password
		existingUser.setSex(user.getSex());
		existingUser.setBirth_day(user.getBirth_day());
		existingUser.setAddress(user.getAddress());
		existingUser.setPhone(user.getPhone());
		existingUser.setSchool_name(user.getSchool_name());
		existingUser.setCreate_date(user.getCreate_date());
		existingUser.setRole(user.getRole());
		existingUser.setStatus(user.isStatus());

		return userRepo.save(existingUser);
	}

	public void deleteUser(Long user_id) {
		Optional<User> dbuser = userRepo.findById(user_id);
		if (dbuser.isEmpty()) {
			throw new RuntimeException("User not found");
		}
		User user = dbuser.get();
		user.setStatus(false);
		userRepo.save(user);
	}
}
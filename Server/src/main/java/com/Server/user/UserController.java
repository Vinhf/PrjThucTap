package com.Server.user;

import java.util.List;

import com.Server.role.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {
	@Autowired
	private UserService service;

	@PostMapping("/save")
	public void save(@RequestBody UserDTO userDTO) {
		User user = UserMapper.mapToUser(userDTO, Role.valueOf(userDTO.getRole()));
        service.saveUser(user);
	}

	@GetMapping("/findAll")
	public List<UserDTO> findAll() {
		return service.findAll();
	}

	@GetMapping("/findNoAMIN")
	public List<UserDTO> findNoAMIN() {
		return service.findNoAMIN();
	}

	@GetMapping("/findById")
	public UserDTO findById (@RequestParam Long user_id) {
		return service.findById(user_id);
	}

	@GetMapping("/findByEmail")
	public UserDTO findById (@RequestParam String email) {
		return service.findByEmail(email);
	}

	@PutMapping("/update")
	public UserDTO update(@RequestBody UserDTO userDTO) {
		User user = UserMapper.mapToUser(userDTO, Role.valueOf(userDTO.getRole()));
		User updatedUser = service.updateUser(user);
		return UserMapper.mapToUserDto(updatedUser);
	}

	@DeleteMapping("/deleteById")
	public void delete(@RequestParam Long user_id) {
		service.deleteUser(user_id);
	}
}
package com.Server.cetificate;

import com.Server.course.CourseRepository;
import com.Server.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CetificateService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;
}

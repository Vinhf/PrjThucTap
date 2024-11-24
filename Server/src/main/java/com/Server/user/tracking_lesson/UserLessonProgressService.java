package com.Server.user.tracking_lesson;

import com.Server.lesson.LessonRepository;
import com.Server.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserLessonProgressService {

    @Autowired
    private UserLessonProgressRepository userLessonProgressRepository;

    public void markLessonAsPassed(Long userId, Long lessonId) {
        UserLessonProgressId id = new UserLessonProgressId(userId, lessonId);
        UserLessonProgress progress = userLessonProgressRepository.findById(id)
                .orElse(new UserLessonProgress());
        progress.setUserId(userId); // Make sure this is relevant for your logic
        progress.setLessonId(lessonId); // Set the lesson ID
        progress.setPassed(true); // Set the passed status
        userLessonProgressRepository.save(progress); // Save the progress
    }


    @Autowired
    private UserLessonProgressRepository lessonProgressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LessonRepository lessonRepository;

    public boolean getLessonProgress(Long userId, Long lessonId) {
        // Tìm kiếm thông tin tiến độ học của học viên cho bài học cụ thể
        Optional<UserLessonProgress> progressOptional = lessonProgressRepository.findById_UserIdAndId_LessonId(userId, lessonId);

        // Nếu tìm thấy tiến độ học, trả về giá trị của thuộc tính 'passed'
        // Nếu không tìm thấy, trả về false (chưa hoàn thành)
        if (progressOptional.isPresent()) {
            return progressOptional.get().isPassed();
        } else {
            return false;
        }
    }


}
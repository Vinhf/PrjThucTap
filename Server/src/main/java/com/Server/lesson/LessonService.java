package com.Server.lesson;

import com.Server.feedback.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    public LessonDTO getLessonById(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        return convertToDTO(lesson);
    }

    public List<LessonDTO> getLessonByTitleId(Long titleId) {
        List<Lesson> lessons = lessonRepository.getLessonsByTitleTitleId(titleId);
        List<LessonDTO> lessonDTOS = new ArrayList<>();
        for(Lesson lesson: lessons) {
            LessonDTO lessonDTO = convertToDTO(lesson);
            lessonDTOS.add(lessonDTO);
        }
        return  lessonDTOS;
    }

    public Lesson createLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    private LessonDTO convertToDTO(Lesson lesson) {
        return LessonDTO.builder()
                .lessonId(lesson.getLessonId())
                .titleId(lesson.getTitle().getTitleId())
                .lessonName(lesson.getLessonName())
                .videoLink(lesson.getVideoLink())
                .passed(lesson.isPassed())
                .build();
    }
    @Transactional
    public void markLessonAsPassed(Long lessonId) {
        lessonRepository.markAsPassed(lessonId);
    }

}


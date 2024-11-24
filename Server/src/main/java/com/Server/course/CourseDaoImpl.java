package com.Server.course;

import com.Server.category.Category;
import com.Server.category.CategoryRepository;
import com.Server.coupon.Coupon;
import com.Server.coupon.CouponRepository;
import com.Server.lesson.Lesson;
import com.Server.lesson.LessonRepository;
import com.Server.quiz.Quiz;
import com.Server.quiz.QuizRepository;
import com.Server.title.Title;
import com.Server.title.TitleRepository;
import com.Server.uploadFile.fileUploadImpl;
import com.Server.user.User;
import com.Server.user.UserRepository;
import com.Server.wishlist.WishlistRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Repository
@AllArgsConstructor
public class CourseDaoImpl implements CourseService{

    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final TitleRepository titleRepository;
    private final CourseRepository courseRepository;
    private final WishlistRepository wishlistRepository;
    private CourseRepository repo;
    private final CategoryRepository categoryRepository;
    private  UserRepository userRepository;
    private final fileUploadImpl fileUpload;


    @Override
    @Transactional
    public boolean addCourse(Course course) {
        if (getCourse(course.getCourseId()) == null) {
            repo.save(course);
            return true;
        }
        return false;
    }

    @Override
    public List<CourseDTO> getAllCourses() {
        List<Course> courseList = repo.findAll();
        List<CourseDTO> courseDTOS = new ArrayList<>();

        for (Course c : courseList) {
            CourseDTO courseDTO = new CourseDTO();
            courseDTO.setCourseId(c.getCourseId());
            courseDTO.setCategoryId(c.getCategory().getCategoryId());
            courseDTO.setCourseName(c.getCourseName());
            courseDTO.setDescription(c.getDescription());
            courseDTO.setUserId(c.getUser().getUser_id());
            courseDTO.setPrice(c.getPrice());
            courseDTO.setStatus(c.getStatus());
            courseDTO.setVideoLink(c.getVideoLink());
            courseDTO.setUpdateDate(c.getUpdateDate());
            courseDTO.setImgLink(c.getImgLink());
            courseDTOS.add(courseDTO);
        }
        return courseDTOS;
    }
    @Override
    public Page<CourseDTO> searchCourseByName(String keyword, Pageable pageable) {
        Page<Course> coursePage = repo.searchCourseByName(keyword, pageable);
        return coursePage.map(c -> {
            CourseDTO courseDTO = new CourseDTO();
            courseDTO.setCourseId(c.getCourseId());
            courseDTO.setCategoryId(c.getCategory().getCategoryId());
            courseDTO.setCourseName(c.getCourseName());
            courseDTO.setDescription(c.getDescription());
            courseDTO.setUserId(c.getUser().getUser_id());
            courseDTO.setPrice(c.getPrice());
            courseDTO.setStatus(c.getStatus());
            courseDTO.setVideoLink(c.getVideoLink());
            courseDTO.setUpdateDate(c.getUpdateDate());
            courseDTO.setImgLink(c.getImgLink());
            return courseDTO;
        });
    }
    @Transactional
    @Override
    public boolean updateCourse(Long courseId, SessionData sessionData) {
        Course course = repo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        course.setCourseName(sessionData.getCourseTitle());
        course.setDescription(sessionData.getShortDescription());
        course.setVideoLink(sessionData.getVideo());
        course.setVideoId(sessionData.getVideoId());
        course.setImgLink(sessionData.getPoster());
        course.setImgId(sessionData.getPosterId());
        course.setPrice(sessionData.getPrice());

        // Xóa tất cả các Title cũ và các thực thể liên quan
        titleRepository.deleteAllByCourse_CourseId(courseId);

        // Thêm các Title mới
        List<Title> titles = sessionData.getSections().stream()
                .map(section -> {
                    Title title = Title.builder()
                            .course(course)
                            .titleName(section.getTitle())
                            .build();

                    List<Lesson> lessons = section.getContents().stream()
                            .map(content -> Lesson.builder()
                                    .title(title)
                                    .lessonName(content.getText())
                                    .videoLink(content.getFile())
                                    .videoId(content.getId())
                                    .build())
                            .collect(Collectors.toList());

                    title.setLessons(lessons);

                    List<Quiz> quiz = section.getQuizzes().stream()
                            .map(quizData -> Quiz.builder()
                                    .title(title)
                                    .question(quizData.getTitle())
                                    .options(quizData.getAnswers())
                                    .correctAnswer(quizData.getCorrectAnswer())
                                    .build())
                            .collect(Collectors.toList());

                    title.setQuiz(quiz);

                    return title;
                }).collect(Collectors.toList());

        course.setTitles(titles);

        // Lưu Course
        repo.saveAndFlush(course);
        return true;
    }




    @Override
    public CourseDTO getCourse(Long id) {
        Course c = repo.getCourseByCourseId(id);
        CourseDTO courseDTO = new CourseDTO();
        courseDTO.setCourseId(id);
        courseDTO.setCategoryId(c.getCategory().getCategoryId());
        courseDTO.setCourseName(c.getCourseName());
        courseDTO.setDescription(c.getDescription());
        courseDTO.setUserId(c.getUser().getUser_id());
        courseDTO.setPrice(c.getPrice());
        courseDTO.setStatus(c.getStatus());
        courseDTO.setVideoLink(c.getVideoLink());
        courseDTO.setUpdateDate(c.getUpdateDate());
        courseDTO.setImgLink(c.getImgLink());
        return courseDTO;
    }


    @Transactional
    public void saveCourse(SessionData sessionData) {
        // Find User by email
        User user = userRepository.findByEmail(sessionData.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + sessionData.getEmail()));

        // Find Category by ID
        Category category = categoryRepository.findById(sessionData.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + sessionData.getCategoryId()));

        // Create Course
        Course course = Course.builder()
                .courseName(sessionData.getCourseTitle())
                .description(sessionData.getShortDescription())
                .videoLink(sessionData.getVideo())
                .videoId(sessionData.getVideoId())
                .imgLink(sessionData.getPoster())
                .imgId(sessionData.getPosterId())
                .price(sessionData.getPrice())
                .user(user)
                .category(category)
                .build();

        // Create Titles and associated entities
        List<Title> titles = sessionData.getSections().stream()
                .map(section -> {
                    Title title = Title.builder()
                            .course(course)
                            .titleName(section.getTitle())
                            .build();

                    List<Lesson> lessons = section.getContents().stream()
                            .map(content -> Lesson.builder()
                                    .title(title)
                                    .lessonName(content.getText())
                                    .videoLink(content.getFile())
                                    .videoId(content.getId())
                                    .build())
                            .collect(Collectors.toList());

                    title.setLessons(lessons);

                    List<Quiz> quiz = section.getQuizzes().stream()
                            .map(quizData -> Quiz.builder()
                                    .title(title)
                                    .question(quizData.getTitle())
                                    .options(quizData.getAnswers())
                                    .correctAnswer(quizData.getCorrectAnswer())
                                    .build())
                            .collect(Collectors.toList());

                    title.setQuiz(quiz);

                    return title;
                }).collect(Collectors.toList());

        course.setTitles(titles);

        // Save Course
        repo.save(course);
    }

    @Override
    public List<CourseDTO> getAllCourseBYEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        List<Course> courses = repo.findCoursesByUserId(user.getUser_id());
        List<CourseDTO> courseDTOS = new ArrayList<>();

        for (Course c: courses) {{
            CourseDTO courseDTO = new CourseDTO();
            courseDTO.setCourseId(c.getCourseId());
            courseDTO.setCategoryId(c.getCategory().getCategoryId());
            courseDTO.setCourseName(c.getCourseName());
            courseDTO.setDescription(c.getDescription());
            courseDTO.setUserId(c.getUser().getUser_id());
            courseDTO.setPrice(c.getPrice());
            courseDTO.setStatus(c.getStatus());
            courseDTO.setVideoLink(c.getVideoLink());
            courseDTO.setUpdateDate(c.getUpdateDate());
            courseDTO.setImgLink(c.getImgLink());
            courseDTOS.add(courseDTO);
        }}
        return courseDTOS;
    }
    @Transactional
    public void deleteCourse(Long courseId) throws IOException {
        Course course = repo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        // Delete associated media files
        if (course.getImgId() != null) fileUpload.deleteFile(course.getImgLink());
        if (course.getVideoId() != null) fileUpload.deleteFile(course.getVideoId());

        // Delete associated lessons and their media
        for (Title title : course.getTitles()) {
            for(Lesson lesson: title.getLessons()) {
                if (lesson.getVideoId() != null) fileUpload.deleteFile((lesson.getVideoId()));
                lessonRepository.delete(lesson);
            }
            for (Quiz quiz : title.getQuiz()) {
                quizRepository.delete(quiz);
            }
            titleRepository.delete(title);
        }
        wishlistRepository.deleteByCourse_CourseId(courseId);
        repo.delete(course);
    }

    @Override
    public void updateCourseStatus(Long courseId, String status) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));
        course.setStatus(status);
        courseRepository.save(course);
    }

    @Override
    public SessionData getSessionDataById(Long id) {
        // Tìm khóa học theo ID
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + id));

        // Tạo đối tượng SessionData từ Course
        SessionData sessionData = new SessionData();
        sessionData.setCourse_id(String.valueOf(course.getCourseId()));
        sessionData.setCourseTitle(course.getCourseName());
        sessionData.setShortDescription(course.getDescription());
        sessionData.setPoster(course.getImgLink());
        sessionData.setPosterId(course.getImgId());
        sessionData.setPrice(course.getPrice());
        sessionData.setVideo(course.getVideoLink());
        sessionData.setVideoId(course.getVideoId());
        sessionData.setCategoryId(course.getCategory().getCategoryId());
        sessionData.setEmail(course.getUser().getEmail());

        // Chuyển đổi danh sách Title thành danh sách Section
        List<SessionData.Section> sections = course.getTitles().stream()
                .map(title -> {
                    SessionData.Section section = new SessionData.Section();
                    section.setTitle(title.getTitleName());

                    // Chuyển đổi danh sách Lesson thành danh sách Content
                    List<SessionData.Section.Content> contents = title.getLessons().stream()
                            .map(lesson -> {
                                SessionData.Section.Content content = new SessionData.Section.Content();
                                content.setText(lesson.getLessonName());
                                content.setFile(lesson.getVideoLink());
                                content.setId(lesson.getVideoId());
                                return content;
                            })
                            .collect(Collectors.toList());

                    section.setContents(contents);

                    // Chuyển đổi danh sách Quiz
                    List<SessionData.Section.Quiz> quizzes = title.getQuiz().stream()
                            .map(quiz -> {
                                SessionData.Section.Quiz q = new SessionData.Section.Quiz();
                                q.setTitle(quiz.getQuestion());
                                q.setAnswers(quiz.getOptions());
                                q.setCorrectAnswer(quiz.getCorrectAnswer());
                                return q;
                            })
                            .collect(Collectors.toList());

                    section.setQuizzes(quizzes);

                    return section;
                })
                .collect(Collectors.toList());

        sessionData.setSections(sections);

        return sessionData;
    }





}

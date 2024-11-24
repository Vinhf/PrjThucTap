package com.Server.payment.paymentCourse;

import com.Server.category.Category;
import com.Server.category.CategoryRepository;
import com.Server.course.Course;
import com.Server.course.CourseRepository;
import com.Server.payment.paymentTopup.PaymentTopup;
import com.Server.payment.paymentTopup.PaymentTopupRepository;
import com.Server.sendMail.ModelSendMail.MailStructure;
import com.Server.sendMail.ServiceSendMail.BillBuyCourseStore;
import com.Server.sendMail.ServiceSendMail.MailServiceBillBuyCourse;
import com.Server.user.User;
import com.Server.user.UserCourse;
import com.Server.user.UserCourseRepository;
import com.Server.user.UserRepository;
import com.Server.wallet.Wallet;
import com.Server.wallet.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class paymentCourseService {

    private final UserRepository userrepository;
    private final WalletRepository walletrepository;
    private final PaymentTopupRepository mpaymentrepository;
    private final CourseRepository courserepository;
    private final CategoryRepository categoryrepository;
    private final UserCourseRepository ucrepository;;
    private final BillBuyCourseStore billbuycoursestore;
    private final MailServiceBillBuyCourse mailServiceBillBuyCourse;

    @Transactional
    public void getBuyCourse(paymentCourseDTO courseDTO) throws Exception {
        String emailRequest = courseDTO.getEmailRequest();
        Long courseId = courseDTO.getCourseId();
        Long amount = courseDTO.getAmount();
        Long instructorIdd = courseDTO.getInstructorID();
        String courseName = courseDTO.getCourseName();
        String emailAd = "admin@admin.com";

        Course course = courserepository.findByCourseId(courseId).orElse(null);

        //Tìm user qua mail
        User Student = userrepository.findByEmail(emailRequest).orElse(null);
        User Instructor = userrepository.findById(instructorIdd).orElse(null);
        User Admin = userrepository.findByEmail(emailAd).orElse(null);
        UserCourse userC = ucrepository.findByUserAndCourse(Student, course).orElse(null);
        if (userC != null) {
            throw new Exception("Course already exists.");
        }
        Long amoutAdmin = (long) (amount*0.2); //Chuyển về admin 20% số tiền khóa học
        Long amoutInstructor = (long) (amount*0.8); //Chuyển về instructor 20% số tiền khóa học

        //Tìm ví của user qua mail
        Wallet walletStudent = walletrepository.findByUser(Student).orElse(null);
        Wallet walletInstructor = walletrepository.findByUser(Instructor).orElse(null);
        Wallet walletAdmin = walletrepository.findByUser(Admin).orElse(null);

        //Kiểm tra email user có null
        if(Student == null || Instructor == null) {
            throw new Exception("Invalid email or instructor");
        }

        //Kiểm tra số dư của học sinh có đủ mua khóa học
        BigDecimal studentBalance = walletStudent != null ? walletStudent.getBalance() : BigDecimal.ZERO;
        if(studentBalance.compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new Exception("Student balance is less than Course price");
        }

        //Trừ tiền Student khi mua Course
        BigDecimal newBalanceStudent = walletStudent.getBalance().subtract(BigDecimal.valueOf(amount));
        walletStudent.setBalance(newBalanceStudent);

        //Cộng tiền cho Instructor và Admin khi Student mua Course
        BigDecimal newBalanceInstructor = walletInstructor.getBalance().add(BigDecimal.valueOf(amoutInstructor));
        walletInstructor.setBalance(newBalanceInstructor);
        BigDecimal newBalanceAdmin = walletAdmin.getBalance().add(BigDecimal.valueOf(amoutAdmin));
        walletAdmin.setBalance(newBalanceAdmin);

        String CodeTransaction = generateTransactionId();



        //Lưu lịch sử giao dịch
        PaymentTopup paymentStudent = new PaymentTopup().builder()
                .user(Student)
                .create_Date(Timestamp.from(Instant.now()))
                .type_of_payment("Buy a course " + courseName + " of " + Instructor.getFull_name())
                .amount(amount)
                .Transaction_ID(CodeTransaction)
                .status("Success")
                .build();
        mpaymentrepository.save(paymentStudent);

        PaymentSave paymentSave = new PaymentSave();
        paymentSave.setAmount(amount);
        paymentSave.setType_of_payment(paymentStudent.getType_of_payment());
        paymentSave.setNameBuyer(Student.getFull_name());
        paymentSave.setCreate_Date(paymentStudent.getCreate_Date());
        paymentSave.setCourseName(courseName);

        billbuycoursestore.storePaymentSave(CodeTransaction, paymentSave);

        mailServiceBillBuyCourse.sendMail(emailRequest, new MailStructure(), CodeTransaction, paymentSave);


        PaymentTopup paymentInstructor = new PaymentTopup().builder()
                .user(Instructor)
                .create_Date(Timestamp.from(Instant.now()))
                .type_of_payment("Student " + Student.getFull_name() + " bought a course")
                .amount(amoutInstructor)
                .Transaction_ID(CodeTransaction)
                .status("Success")
                .build();
        mpaymentrepository.save(paymentInstructor);

        PaymentTopup paymentAdmin = new PaymentTopup().builder()
                .user(Admin)
                .create_Date(Timestamp.from(Instant.now()))
                .type_of_payment("Student " + Student.getFull_name() + " bought a course of " + Instructor.getFull_name())
                .amount(amoutAdmin)
                .Transaction_ID(CodeTransaction)
                .status("Success")
                .build();
        mpaymentrepository.save(paymentAdmin);

        UserCourse userCourse = new UserCourse().builder()
                .user(Student)
                .course(course)
                .enrolledDate(Timestamp.from(Instant.now()))
                .status("learning...")
                .build();
        ucrepository.save(userCourse);


    }
    private String generateTransactionId() {
        Random random = new Random();
        int transactionId = 10000000 + random.nextInt(90000000);
        return String.valueOf(transactionId);
    }
    public String getFullName(Long userId ) {
        User user = userrepository.findById(userId).orElse(null);
        return user != null ? user.getFull_name() : null;
    }


    public String getFullNameStudent(String email ) {
        User user = userrepository.findByEmail(email).orElse(null);
        return user != null ? user.getFull_name() : null;
    }


    public String getFullNameCategory(Long categoryId ) {
        Category category = categoryrepository.findById(categoryId).orElse(null);
        return category != null ? category.getCategoryName() : null;
    }


    public boolean getCheckCourse(paymentCourseDTO courseDTO) throws Exception {
        String email = courseDTO.getEmailRequest();
        Long id = courseDTO.getCourseId();
        User user = userrepository.findByEmail(email).orElse(null);
        Course course = courserepository.findByCourseId(id).orElse(null);
        if (user == null || course == null) {
            System.out.println("null");
            throw new Exception("User or Course not found");
        }

        UserCourse userCourse = ucrepository.findByUserAndCourse(user, course).orElse(null);
        if(userCourse == null) {
            return false;
        }
        return true;
        }
    public boolean getCheckCoursee(paymentCourseDTO courseDTO) throws Exception {
        String email = courseDTO.getEmailRequest();
        Long id = courseDTO.getCourseId();
        User user = userrepository.findByEmail(email).orElse(null);
        Course course = courserepository.findByCourseId(id).orElse(null);
        if (user == null || course == null) {
            System.out.println("null");
            throw new Exception("User or Course not found");
        }

        UserCourse userCourse = ucrepository.findByUserAndCourse(user, course).orElse(null);
        if(userCourse == null) {
            return true;
        }
        return false;
    }
    }

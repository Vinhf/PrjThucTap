package com.Server.user.tracking_quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserQuizProgressRepository extends JpaRepository<UserQuizProgress, UserQuizProgressId> {
    // JpaRepository will provide methods like findById for composite key


}
package com.Server.Token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<token, Long> {

    @Query(value = """
      select t from token t inner join User u\s
      on t.user.user_id = u.user_id\s
      where u.user_id = :id and (t.expired = false or t.revoked = false)\s
      """)
    List<token> findAllValidTokenByUser(Long id);

    Optional<token> findByToken(String token);
}

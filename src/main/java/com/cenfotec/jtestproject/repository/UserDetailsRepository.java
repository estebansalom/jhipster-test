package com.cenfotec.jtestproject.repository;

import com.cenfotec.jtestproject.domain.UserDetails;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the UserDetails entity.
 */
@Repository
public interface UserDetailsRepository extends JpaRepository<UserDetails, Long> {
    @Query(
        value = "select distinct userDetails from UserDetails userDetails left join fetch userDetails.contacts",
        countQuery = "select count(distinct userDetails) from UserDetails userDetails"
    )
    Page<UserDetails> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct userDetails from UserDetails userDetails left join fetch userDetails.contacts")
    List<UserDetails> findAllWithEagerRelationships();

    @Query("select userDetails from UserDetails userDetails left join fetch userDetails.contacts where userDetails.id =:id")
    Optional<UserDetails> findOneWithEagerRelationships(@Param("id") Long id);
}

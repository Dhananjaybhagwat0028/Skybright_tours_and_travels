package com.airplane.service.dao;

import com.airplane.service.models.Package;
import com.airplane.service.models.PackgeTicketDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PackgeTicketDetailsDAO  extends JpaRepository<PackgeTicketDetails, Long> {
}

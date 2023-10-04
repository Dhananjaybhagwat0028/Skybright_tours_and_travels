package com.airplane.service.dao;

import com.airplane.service.models.FlightsDetail;
import com.airplane.service.models.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PackageDAO extends JpaRepository<Package, Long> {
}

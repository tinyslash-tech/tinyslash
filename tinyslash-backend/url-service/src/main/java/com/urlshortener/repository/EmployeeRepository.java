package com.urlshortener.repository;

import com.urlshortener.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends MongoRepository<Employee, String> {
  List<Employee> findByDepartment(String department);

  List<Employee> findByStatus(String status);

  boolean existsByEmail(String email);
}

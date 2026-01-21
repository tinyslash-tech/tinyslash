package com.urlshortener.admin.repository;

import com.urlshortener.admin.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminEmployeeRepository extends MongoRepository<Employee, String> {

  Optional<Employee> findByEmail(String email);

  Page<Employee> findByDepartment(String department, Pageable pageable);

  @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'email': { $regex: ?0, $options: 'i' } } ] }")
  Page<Employee> searchByNameOrEmail(String searchTerm, Pageable pageable);

  @Query("{ 'department': ?0, $or: [ { 'name': { $regex: ?1, $options: 'i' } }, { 'email': { $regex: ?1, $options: 'i' } } ] }")
  Page<Employee> searchByDepartmentAndNameOrEmail(String department, String searchTerm, Pageable pageable);
}

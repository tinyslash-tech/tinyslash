package com.urlshortener.admin.service;

import com.urlshortener.admin.model.Employee;
import com.urlshortener.admin.repository.AdminEmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AdminEmployeeService {

  @Autowired
  private AdminEmployeeRepository employeeRepository;

  @Autowired(required = false)
  @org.springframework.context.annotation.Lazy
  private PasswordEncoder passwordEncoder;

  public Page<Employee> findAll(Pageable pageable) {
    return employeeRepository.findAll(pageable);
  }

  public Optional<Employee> findById(String id) {
    return employeeRepository.findById(id);
  }

  public Optional<Employee> findByEmail(String email) {
    return employeeRepository.findByEmail(email);
  }

  public Page<Employee> findByDepartment(String department, Pageable pageable) {
    return employeeRepository.findByDepartment(department, pageable);
  }

  public Page<Employee> searchByNameOrEmail(String searchTerm, Pageable pageable) {
    return employeeRepository.searchByNameOrEmail(searchTerm, pageable);
  }

  public Page<Employee> searchByDepartmentAndNameOrEmail(String department, String searchTerm, Pageable pageable) {
    return employeeRepository.searchByDepartmentAndNameOrEmail(department, searchTerm, pageable);
  }

  public Employee create(Employee employee) {
    // Hash password if provided
    if (employee.getPasswordHash() != null && !employee.getPasswordHash().isEmpty()) {
      if (passwordEncoder != null) {
        employee.setPasswordHash(passwordEncoder.encode(employee.getPasswordHash()));
      }
    }
    employee.setCreatedAt(LocalDateTime.now());
    employee.setUpdatedAt(LocalDateTime.now());
    return employeeRepository.save(employee);
  }

  public Employee update(String id, Employee employeeUpdate) {
    Optional<Employee> existingOpt = employeeRepository.findById(id);
    if (existingOpt.isEmpty()) {
      throw new RuntimeException("Employee not found with id: " + id);
    }

    Employee existing = existingOpt.get();

    if (employeeUpdate.getName() != null) {
      existing.setName(employeeUpdate.getName());
    }
    if (employeeUpdate.getEmail() != null) {
      existing.setEmail(employeeUpdate.getEmail());
    }
    if (employeeUpdate.getDepartment() != null) {
      existing.setDepartment(employeeUpdate.getDepartment());
    }
    if (employeeUpdate.getPosition() != null) {
      existing.setPosition(employeeUpdate.getPosition());
    }
    if (employeeUpdate.getPhone() != null) {
      existing.setPhone(employeeUpdate.getPhone());
    }
    if (employeeUpdate.getPasswordHash() != null && !employeeUpdate.getPasswordHash().isEmpty()) {
      if (passwordEncoder != null) {
        existing.setPasswordHash(passwordEncoder.encode(employeeUpdate.getPasswordHash()));
      }
    }

    existing.setUpdatedAt(LocalDateTime.now());
    return employeeRepository.save(existing);
  }

  public void delete(String id) {
    employeeRepository.deleteById(id);
  }

  public long count() {
    return employeeRepository.count();
  }
}

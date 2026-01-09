package com.urlshortener.service;

import com.urlshortener.model.Employee;
import com.urlshortener.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

  @Autowired
  private EmployeeRepository employeeRepository;

  @Autowired
  private UserService userService;

  public List<Employee> getAllEmployees() {
    List<Employee> employees = employeeRepository.findAll();
    employees.forEach(this::populateUserRoles);
    return employees;
  }

  public Optional<Employee> getEmployeeById(String id) {
    Optional<Employee> emp = employeeRepository.findById(id);
    emp.ifPresent(this::populateUserRoles);
    return emp;
  }

  private void populateUserRoles(Employee employee) {
    if (employee.getUserId() != null) {
      userService.findById(employee.getUserId()).ifPresent(user -> {
        employee.setRoles(user.getRoles());
      });
    }
  }

  public Employee createEmployee(Employee employee, String adminId) {
    if (employeeRepository.existsByEmail(employee.getEmail())) {
      throw new RuntimeException("Employee with email " + employee.getEmail() + " already exists");
    }

    // Create User account automatically
    try {
      // Check if user exists, if not create
      com.urlshortener.model.User user = userService.findByEmail(employee.getEmail())
          .orElseGet(() -> userService.registerUser(
              employee.getEmail(),
              "Tinyslash@123", // Default password
              employee.getFirstName(),
              employee.getLastName()));

      // Link Employee to User
      employee.setUserId(user.getId());

      // Assign Roles if provided
      if (employee.getRoles() != null && !employee.getRoles().isEmpty()) {
        userService.updateUserRoles(user.getId(), employee.getRoles());
      }

    } catch (Exception e) {
      // Log error but proceed? Or fail? Best to fail if strict.
      // For now, let's proceed but maybe throw if critical.
      // But since this is "Industry Grade", we should probably ensure consistency.
      throw new RuntimeException("Failed to create linked User account: " + e.getMessage());
    }

    employee.setCreatedAt(LocalDateTime.now());
    employee.setUpdatedAt(LocalDateTime.now());
    employee.setCreatedBy(adminId);

    return employeeRepository.save(employee);
  }

  public Employee updateEmployee(String id, Employee employeeDetails) {
    Employee employee = employeeRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

    employee.setFirstName(employeeDetails.getFirstName());
    employee.setLastName(employeeDetails.getLastName());
    employee.setPhoneNumber(employeeDetails.getPhoneNumber());
    employee.setDesignation(employeeDetails.getDesignation());
    employee.setDepartment(employeeDetails.getDepartment());
    employee.setStatus(employeeDetails.getStatus());
    employee.setJoiningDate(employeeDetails.getJoiningDate());

    // Banking & Salary - Update only if allowed/provided
    if (employeeDetails.getCtc() != null)
      employee.setCtc(employeeDetails.getCtc());
    if (employeeDetails.getBasicSalary() != null)
      employee.setBasicSalary(employeeDetails.getBasicSalary());
    if (employeeDetails.getBankName() != null)
      employee.setBankName(employeeDetails.getBankName());
    if (employeeDetails.getAccountNumber() != null)
      employee.setAccountNumber(employeeDetails.getAccountNumber());
    if (employeeDetails.getIfscCode() != null)
      employee.setIfscCode(employeeDetails.getIfscCode());

    employee.setUpdatedAt(LocalDateTime.now());

    return employeeRepository.save(employee);
  }

  public void deleteEmployee(String id) {
    if (!employeeRepository.existsById(id)) {
      throw new RuntimeException("Employee not found with id: " + id);
    }
    employeeRepository.deleteById(id);
  }

  public Employee addDocument(String employeeId, String name, String type, String fileUrl, String uploadedBy) {
    Employee employee = employeeRepository.findById(employeeId)
        .orElseThrow(() -> new RuntimeException("Employee not found"));

    Employee.EmployeeDocument doc = new Employee.EmployeeDocument(name, type, fileUrl, uploadedBy);
    employee.getDocuments().add(doc);
    employee.setUpdatedAt(LocalDateTime.now());

    return employeeRepository.save(employee);
  }

  public Employee removeDocument(String employeeId, String documentId) {
    Employee employee = employeeRepository.findById(employeeId)
        .orElseThrow(() -> new RuntimeException("Employee not found"));

    employee.getDocuments().removeIf(d -> d.getId().equals(documentId));
    employee.setUpdatedAt(LocalDateTime.now());

    return employeeRepository.save(employee);
  }
}

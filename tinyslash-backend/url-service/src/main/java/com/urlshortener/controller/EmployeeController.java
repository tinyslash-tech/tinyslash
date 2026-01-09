package com.urlshortener.controller;

import com.urlshortener.model.Employee;
import com.urlshortener.service.EmployeeService;
import com.urlshortener.dto.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/employees")
public class EmployeeController {

  @Autowired
  private EmployeeService employeeService;

  @GetMapping
  @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR', 'employees:read')")
  public ResponseEntity<ApiResponse<List<Employee>>> getAllEmployees() {
    return ResponseEntity.ok(ApiResponse.success(employeeService.getAllEmployees(), "Employees fetched successfully"));
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR', 'employees:read')")
  public ResponseEntity<ApiResponse<Employee>> getEmployeeById(@PathVariable String id) {
    return employeeService.getEmployeeById(id)
        .map(employee -> ResponseEntity.ok(ApiResponse.success(employee, "Employee found")))
        .orElse(ResponseEntity.status(404).body(ApiResponse.error("Employee not found")));
  }

  @PostMapping
  @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR', 'employees:write')")
  public ResponseEntity<ApiResponse<Employee>> createEmployee(@RequestBody Employee employee,
      Authentication authentication) {
    String adminId = authentication.getName(); // Or get principal ID
    Employee created = employeeService.createEmployee(employee, adminId);
    return ResponseEntity.ok(ApiResponse.success(created, "Employee created successfully"));
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR', 'employees:write')")
  public ResponseEntity<ApiResponse<Employee>> updateEmployee(@PathVariable String id, @RequestBody Employee employee) {
    Employee updated = employeeService.updateEmployee(id, employee);
    return ResponseEntity.ok(ApiResponse.success(updated, "Employee updated successfully"));
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'employees:delete')")
  public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable String id) {
    employeeService.deleteEmployee(id);
    return ResponseEntity.ok(ApiResponse.success(null, "Employee deleted successfully"));
  }

  @PostMapping("/{id}/documents")
  @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR', 'employees:write')")
  public ResponseEntity<ApiResponse<Employee>> addDocument(
      @PathVariable String id,
      @RequestBody Employee.EmployeeDocument document,
      Authentication authentication) {
    // In a real scenario, this endpoint might handle MultipartFile upload first
    // Here we assume the file is already uploaded via FileUploadService and we are
    // linking it
    Employee updated = employeeService.addDocument(id, document.getName(), document.getType(), document.getFileUrl(),
        authentication.getName());
    return ResponseEntity.ok(ApiResponse.success(updated, "Document added successfully"));
  }

  @DeleteMapping("/{id}/documents/{docId}")
  @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR', 'employees:write')")
  public ResponseEntity<ApiResponse<Employee>> removeDocument(@PathVariable String id, @PathVariable String docId) {
    Employee updated = employeeService.removeDocument(id, docId);
    return ResponseEntity.ok(ApiResponse.success(updated, "Document removed successfully"));
  }
}

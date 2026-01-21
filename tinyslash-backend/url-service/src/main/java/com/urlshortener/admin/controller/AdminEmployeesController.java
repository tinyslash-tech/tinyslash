package com.urlshortener.admin.controller;

import com.urlshortener.admin.model.Employee;
import com.urlshortener.admin.service.AdminEmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/employees")
@CrossOrigin(origins = "*")
public class AdminEmployeesController {

  @Autowired
  private AdminEmployeeService employeeService;

  @GetMapping
  @PreAuthorize("hasAuthority('ADMIN_employees:read')")
  public ResponseEntity<?> getEmployees(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(defaultValue = "createdAt") String sortBy,
      @RequestParam(defaultValue = "DESC") String sortOrder,
      @RequestParam(required = false) String search,
      @RequestParam(required = false) String department) {

    try {
      Sort.Direction direction = Sort.Direction.fromString(sortOrder);
      Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

      Page<Employee> employees;

      if (search != null && !search.trim().isEmpty()) {
        if (department != null && !department.trim().isEmpty()) {
          employees = employeeService.searchByDepartmentAndNameOrEmail(department, search, pageable);
        } else {
          employees = employeeService.searchByNameOrEmail(search, pageable);
        }
      } else {
        if (department != null && !department.trim().isEmpty()) {
          employees = employeeService.findByDepartment(department, pageable);
        } else {
          employees = employeeService.findAll(pageable);
        }
      }

      Map<String, Object> response = new HashMap<>();
      response.put("content", employees.getContent());
      response.put("currentPage", employees.getNumber());
      response.put("totalItems", employees.getTotalElements());
      response.put("totalPages", employees.getTotalPages());
      response.put("pageSize", employees.getSize());
      response.put("hasNext", employees.hasNext());
      response.put("hasPrevious", employees.hasPrevious());

      return ResponseEntity.ok(Map.of(
          "success", true,
          "data", response));

    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(Map.of(
          "success", false,
          "message", "Error fetching employees: " + e.getMessage()));
    }
  }

  @PostMapping
  @PreAuthorize("hasAuthority('ADMIN_employees:write')")
  public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {
    try {
      Employee created = employeeService.create(employee);
      return ResponseEntity.ok(Map.of(
          "success", true,
          "data", created));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(Map.of(
          "success", false,
          "message", "Error creating employee: " + e.getMessage()));
    }
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('ADMIN_employees:update')")
  public ResponseEntity<?> updateEmployee(@PathVariable String id, @RequestBody Employee employee) {
    try {
      Employee updated = employeeService.update(id, employee);
      return ResponseEntity.ok(Map.of(
          "success", true,
          "data", updated));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(Map.of(
          "success", false,
          "message", "Error updating employee: " + e.getMessage()));
    }
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('ADMIN_employees:delete')")
  public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
    try {
      employeeService.delete(id);
      return ResponseEntity.ok(Map.of(
          "success", true,
          "message", "Employee deleted successfully"));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(Map.of(
          "success", false,
          "message", "Error deleting employee: " + e.getMessage()));
    }
  }
}

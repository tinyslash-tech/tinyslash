package com.urlshortener.config;

import com.urlshortener.model.Job;
import com.urlshortener.model.Job.JobRequirements;
import com.urlshortener.repository.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class JobDataInitializer {

        @Bean
        public CommandLineRunner initJobs(JobRepository jobRepository,
                        com.urlshortener.service.UserService userService,
                        com.urlshortener.service.TeamService teamService) {
                return args -> {
                        // Seed Admin User
                        com.urlshortener.model.User admin;
                        if (userService.findByEmail("admin@tinyslash.com").isEmpty()) {
                                System.out.println("Creating admin user...");
                                admin = userService.registerUser("admin@tinyslash.com", "admin123", "System", "Admin");
                        } else {
                                System.out.println("Admin user exists. Updating roles...");
                                admin = userService.findByEmail("admin@tinyslash.com").get();
                        }

                        // Always ensure proper roles for Super Admin
                        boolean rolesChanged = false;
                        if (!admin.getRoles().contains("ROLE_SUPER_ADMIN")) {
                                admin.getRoles().add("ROLE_SUPER_ADMIN");
                                rolesChanged = true;
                        }
                        if (!admin.getRoles().contains("ROLE_HR")) {
                                admin.getRoles().add("ROLE_HR");
                                rolesChanged = true;
                        }
                        if (!admin.getRoles().contains("ROLE_ADMIN")) {
                                admin.getRoles().add("ROLE_ADMIN");
                                rolesChanged = true;
                        }

                        if (rolesChanged) {
                                userService.updateUser(admin);
                                System.out.println("Updated admin user roles: " + admin.getRoles());
                        }

                        // Seed Support Admin
                        if (userService.findByEmail("support@tinyslash.com").isEmpty()) {
                                com.urlshortener.model.User user = userService.registerUser("support@tinyslash.com",
                                                "support123", "Support", "Admin");
                                user.getRoles().add("ROLE_SUPPORT");
                                userService.updateUser(user);
                                System.out.println("Seeded: support@tinyslash.com");
                        }

                        // Seed Billing Manager
                        if (userService.findByEmail("billing@tinyslash.com").isEmpty()) {
                                com.urlshortener.model.User user = userService.registerUser("billing@tinyslash.com",
                                                "billing123", "Billing", "Manager");
                                user.getRoles().add("ROLE_BILLING");
                                userService.updateUser(user);
                                System.out.println("Seeded: billing@tinyslash.com");
                        }

                        // Seed Technical Admin
                        if (userService.findByEmail("tech@tinyslash.com").isEmpty()) {
                                com.urlshortener.model.User user = userService.registerUser("tech@tinyslash.com",
                                                "tech123", "Technical", "Admin");
                                user.getRoles().add("ROLE_TECH");
                                userService.updateUser(user);
                                System.out.println("Seeded: tech@tinyslash.com");
                        }

                        // Seed Content Moderator
                        if (userService.findByEmail("moderator@tinyslash.com").isEmpty()) {
                                com.urlshortener.model.User user = userService.registerUser("moderator@tinyslash.com",
                                                "mod123", "Content", "Moderator");
                                user.getRoles().add("ROLE_MODERATOR");
                                userService.updateUser(user);
                                System.out.println("Seeded: moderator@tinyslash.com");
                        }

                        // Seed Read-Only Auditor
                        if (userService.findByEmail("auditor@tinyslash.com").isEmpty()) {
                                com.urlshortener.model.User user = userService.registerUser("auditor@tinyslash.com",
                                                "audit123", "System", "Auditor");
                                user.getRoles().add("ROLE_AUDITOR");
                                userService.updateUser(user);
                                System.out.println("Seeded: auditor@tinyslash.com");
                        }

                        // Seed HR Manager
                        if (userService.findByEmail("hr@tinyslash.com").isEmpty()) {
                                com.urlshortener.model.User user = userService.registerUser("hr@tinyslash.com", "hr123",
                                                "HR", "Manager");
                                user.getRoles().add("ROLE_HR");
                                userService.updateUser(user);
                                System.out.println("Seeded: hr@tinyslash.com");
                        }

                        if (jobRepository.count() == 0) {
                                System.out.println("Seeding initial jobs...");

                                // Job 1: Senior Full Stack Engineer
                                Job job1 = new Job();
                                job1.setTitle("Senior Full Stack Engineer");
                                job1.setDepartment("Engineering");
                                job1.setLocation("San Francisco, CA");
                                job1.setType("Hybrid");
                                job1.setExperience("5+ years");
                                job1.setSalary("$140k - $180k");
                                job1.setPostedDate(LocalDate.now().minusDays(2));
                                job1.setPosition(1);
                                job1.setDescription(
                                                "We are looking for a Senior Full Stack Engineer to help us build the future of our platform. You will work across the entire stack, from our React frontend to our Java/Spring Boot backend.");
                                job1.setResponsibilities(Arrays.asList(
                                                "Architect and implement scalable features for our core platform.",
                                                "Collaborate with product and design teams to deliver high-quality user experiences.",
                                                "Mentor junior engineers and drive code quality best practices.",
                                                "Optimize application for maximum speed and scalability."));
                                job1.setRequirements(new JobRequirements(
                                                Arrays.asList(
                                                                "5+ years of experience with Java and Spring Boot.",
                                                                "Strong proficiency in React and modern JavaScript.",
                                                                "Experience with MongoDB and RESTful APIs.",
                                                                "Solid understanding of microservices architecture."),
                                                Arrays.asList(
                                                                "Experience with Cloudflare workers.",
                                                                "Knowledge of Next.js.",
                                                                "Contributions to open source projects.")));
                                job1.setBenefits(Arrays.asList(
                                                "Competitive salary and equity.",
                                                "Health, dental, and vision insurance.",
                                                "Unlimited PTO.",
                                                "Home office stipend."));

                                // Job 2: Product Marketing Manager
                                Job job2 = new Job();
                                job2.setTitle("Product Marketing Manager");
                                job2.setDepartment("Marketing");
                                job2.setLocation("Remote");
                                job2.setType("Full-time");
                                job2.setExperience("3-5 years");
                                job2.setSalary("$100k - $130k");
                                job2.setPostedDate(LocalDate.now().minusDays(5));
                                job2.setPosition(2);
                                job2.setDescription(
                                                "Join our Marketing team to tell the story of our product. You will be responsible for product positioning, messaging, and go-to-market strategy.");
                                job2.setResponsibilities(Arrays.asList(
                                                "Develop product positioning and messaging that differentiates our products in the market.",
                                                "Plan and launch new products and releases.",
                                                "Create compelling content (blog posts, whitepapers, product guides).",
                                                "Work with sales to enable them with the right tools and training."));
                                job2.setRequirements(new JobRequirements(
                                                Arrays.asList(
                                                                "3+ years of product marketing experience in SaaS.",
                                                                "Excellent written and verbal communication skills.",
                                                                "Proven track record of managing successful product launches."),
                                                Arrays.asList(
                                                                "Experience with SEO and content marketing.",
                                                                "Familiarity with analytics tools like Google Analytics.")));
                                job2.setBenefits(Arrays.asList(
                                                "Remote-first culture.",
                                                "Annual team retreats.",
                                                "Learning and development budget.",
                                                "Healthcare coverage."));

                                // Job 3: Customer Success Intern
                                Job job3 = new Job();
                                job3.setTitle("Customer Success Intern");
                                job3.setDepartment("Support");
                                job3.setLocation("New York, NY");
                                job3.setType("Internship");
                                job3.setExperience("0-1 years");
                                job3.setSalary("$25/hr");
                                job3.setPostedDate(LocalDate.now().minusDays(1));
                                job3.setPosition(3);
                                job3.setDescription(
                                                "Kickstart your career in tech by joining our Customer Success team. You will learn how to support users and help them get the most out of our platform.");
                                job3.setResponsibilities(Arrays.asList(
                                                "Respond to customer inquiries via email and chat.",
                                                "Create help articles and documentation.",
                                                "Assist with onboarding new customers.",
                                                "Gather customer feedback and share it with the product team."));
                                job3.setRequirements(new JobRequirements(
                                                Arrays.asList(
                                                                "Currently enrolled in a university program or recent graduate.",
                                                                "Strong empathy and desire to help others.",
                                                                "Good problem-solving skills."),
                                                Arrays.asList(
                                                                "Experience with customer support tools (e.g., Intercom, Zendesk).",
                                                                "Technical background or interest in software.")));
                                job3.setBenefits(Arrays.asList(
                                                "Mentorship from experienced professionals.",
                                                "Networking opportunities.",
                                                "Potential for full-time offer."));

                                jobRepository.saveAll(Arrays.asList(job1, job2, job3));
                                System.out.println("Seeded 3 jobs into the database.");
                        } else {
                                System.out.println("Jobs already exist, checking for missing internships...");
                        }

                        // Internship: Graphic Design Intern (Unpaid)
                        if (!jobRepository.existsByTitle("Graphic Design Intern")) {
                                Job job = new Job();
                                job.setTitle("Graphic Design Intern");
                                job.setDepartment("Design");
                                job.setLocation("Remote");
                                job.setType("Internship");
                                job.setExperience("0-1 years");
                                job.setSalary("Unpaid");
                                job.setPostedDate(LocalDate.now());
                                job.setPosition(4);
                                job.setDescription(
                                                "Creative Graphic Design Intern needed to assist with marketing materials and social media graphics.");
                                job.setResponsibilities(Arrays.asList("Create social media graphics.",
                                                "Assist in designing marketing collateral.",
                                                "Collaborate with the marketing team."));
                                job.setRequirements(new JobRequirements(
                                                Arrays.asList("Proficiency in Adobe Creative Suite.",
                                                                "Creativity and eye for design."),
                                                Arrays.asList("Animation skills.", "Video editing basics.")));
                                job.setBenefits(Arrays.asList("Flexible hours.", "Certificate of completion.",
                                                "Remote work."));
                                jobRepository.save(job);
                                System.out.println("Seeded Graphic Design Intern.");
                        }

                        // Internship: UI/UX Design Intern (Unpaid)
                        if (!jobRepository.existsByTitle("UI/UX Design Intern")) {
                                Job job = new Job();
                                job.setTitle("UI/UX Design Intern");
                                job.setDepartment("Design");
                                job.setLocation("Remote");
                                job.setType("Internship");
                                job.setExperience("0-1 years");
                                job.setSalary("Unpaid");
                                job.setPostedDate(LocalDate.now());
                                job.setPosition(5);
                                job.setDescription(
                                                "UI/UX Design Intern to help improve user experience on our web and mobile platforms.");
                                job.setResponsibilities(Arrays.asList("Design user interfaces.",
                                                "Create wireframes and prototypes.", "Conduct user research."));
                                job.setRequirements(new JobRequirements(
                                                Arrays.asList("Experience with Figma or Adobe XD.",
                                                                "Understanding of UX principles."),
                                                Arrays.asList("HTML/CSS knowledge.")));
                                job.setBenefits(Arrays.asList("Mentorship from senior designers.",
                                                "Portfolio building.", "Remote work."));
                                jobRepository.save(job);
                                System.out.println("Seeded UI/UX Design Intern.");
                        }

                        // Internship: Full Stack Development Intern (Unpaid)
                        if (!jobRepository.existsByTitle("Full Stack Development Intern")) {
                                Job job = new Job();
                                job.setTitle("Full Stack Development Intern");
                                job.setDepartment("Engineering");
                                job.setLocation("Remote");
                                job.setType("Internship");
                                job.setExperience("0-1 years");
                                job.setSalary("Unpaid");
                                job.setPostedDate(LocalDate.now());
                                job.setPosition(6);
                                job.setDescription(
                                                "Full Stack Intern to work on real-world projects using React and Spring Boot.");
                                job.setResponsibilities(Arrays.asList("Write clean code for frontend and backend.",
                                                "Fix bugs and improve performance.", "Participate in code reviews."));
                                job.setRequirements(new JobRequirements(
                                                Arrays.asList("Knowledge of JavaScript/React.",
                                                                "Knowledge of Java/Spring Boot.", "Git basics."),
                                                Arrays.asList("Personal projects.", "Docker knowledge.")));
                                job.setBenefits(Arrays.asList("Hands-on experience.", "Code reviews from experts.",
                                                "Remote work."));
                                jobRepository.save(job);
                                System.out.println("Seeded Full Stack Intern.");
                        }

                        // Internship: Java Developer Intern (Unpaid)
                        if (!jobRepository.existsByTitle("Java Developer Intern")) {
                                Job job = new Job();
                                job.setTitle("Java Developer Intern");
                                job.setDepartment("Engineering");
                                job.setLocation("Remote");
                                job.setType("Internship");
                                job.setExperience("0-1 years");
                                job.setSalary("Unpaid");
                                job.setPostedDate(LocalDate.now());
                                job.setPosition(7);
                                job.setDescription("Java Developer Intern to verify and test backend services.");
                                job.setResponsibilities(Arrays.asList("Assist in backend API development.",
                                                "Write unit tests.", "Optimize database queries."));
                                job.setRequirements(new JobRequirements(
                                                Arrays.asList("Strong Java core knowledge.", "Understanding of OOP."),
                                                Arrays.asList("Spring Boot basics.", "SQL knowledge.")));
                                job.setBenefits(Arrays.asList("Training on enterprise java.", "Certificate.",
                                                "Remote work."));
                                jobRepository.save(job);
                                System.out.println("Seeded Java Developer Intern.");
                        }
                        // Seed Teams
                        if (teamService.getAllTeams().isEmpty()) {
                                System.out.println("Seeding initial teams...");
                                com.urlshortener.model.User adminUser = userService.findByEmail("admin@tinyslash.com")
                                                .orElse(null);
                                if (adminUser != null) {
                                        com.urlshortener.model.Team team = teamService.createTeam("Marketing Team",
                                                        adminUser.getId(), "Our awesome marketing team");
                                        System.out.println("Seeded 'Marketing Team'.");

                                        try {
                                                teamService.inviteUserToTeam(team.getId(), "newuser@example.com",
                                                                com.urlshortener.model.TeamRole.MEMBER,
                                                                adminUser.getId());
                                                System.out.println("Seeded invite for newuser@example.com");
                                        } catch (Exception e) {
                                                System.out.println("Failed to seed invite: " + e.getMessage());
                                        }
                                }
                        }
                };
        }
}

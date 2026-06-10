# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


Phase 1: Advanced Java Core (Weeks 1–3)
Focus: Mastering the language fundamentals and modern Java features.

Week 1: OOPs, Generics, & Collections
OOPs Principles: Deep dive into Polymorphism, Inheritance, Encapsulation, and Abstraction with real-world implementation examples.

Generics: Master Wildcards (?), Upper Bounds (? extends T), and Lower Bounds (? super T).

Collections Framework: Understand internal workings, time complexity, and use cases for ArrayList, HashSet, and HashMap. Understand thread-safety with ConcurrentHashMap.

Week 2: Functional Java & Exception Handling
Functional Programming: Lambdas, Functional Interfaces (Predicate, Function, Consumer, Supplier), and Method References.

Streams API: * Intermediate operations: filter(), map(), flatMap(), sorted().

Terminal operations: collect(), forEach(), reduce().

Optional Class: Eliminating NullPointerException.

Exception Handling: Checked vs. Unchecked exceptions, try-with-resources, and creating Custom Exceptions.

Week 3: Concurrency & Design Patterns
Multi-Threading: Lifecycle, Synchronization, ExecutorService, and Thread Pools.

Java Design Patterns: Implement the core creational and structural patterns:

Singleton (Thread-safe initialization)

Builder (Constructing complex objects)

Factory (Object creation abstraction)

Facade (Simplifying complex subsystem interfaces)

Phase 2: Data, Testing, & Build Tools (Weeks 4–5)
Focus: Database interactions, build automation, and code quality.

Week 4: Build Tools, Testing, & SQL Joins
Maven: POM structure, lifecycle phases, dependency management, and essential commands.

Git: Branching strategies, core commands, and Conflict Resolution.

SQL Joins: Mastering Inner, Left, Right, and Full Joins.

Unit Testing: Writing unit tests using JUnit assertions and mocking external dependencies with Mockito. Focus on code coverage metrics.

Week 5: JPA / Hibernate
Core Concepts: Entity lifecycle, Object-Relational Mapping (ORM).

Annotations: @Entity, @Table, @Id, @GeneratedValue.

Associations: Mapping @OneToOne, @OneToMany, @ManyToOne, and @ManyToMany relationships.

Performance: Understanding the N+1 select problem and implementing Second Level Caching.

Phase 3: Spring Boot & REST APIs (Weeks 6–8)
Focus: Building robust enterprise web services.

Week 6: Spring Boot Core & Security
Bootstrapping: Core architecture, @SpringBootApplication, component scanning.

Annotations: @Component, @Service, @Repository, @Autowired, @Bean.

Profiles: Managing environment-specific configurations (dev, prod).

Spring Security: Basic setup for Authentication (Who are you?) and Authorization (What can you do?).

Week 7: Spring REST (Part 1)
HTTP Methods: Correct usage of GET, POST, PUT, DELETE, PATCH.

Data Passing: Extracting payload using @PathVariable, @RequestParam, and @RequestBody.

HTTP Statuses: Proper REST etiquette utilizing 2xx (Success), 3xx (Redirection), 4xx (Client Error), and 5xx (Server Error).

Week 8: Spring REST (Part 2)
Data Validation: Using JSR-380 annotations (@NotNull, @Size, @Valid) for incoming request validation.

Global Exception Handling: Implementing @ControllerAdvice and @ExceptionHandler for clean, uniform API error responses.

Provider & Consumer: Building REST endpoints (Provider) and consuming external APIs using RestTemplate or WebClient (Consumer).

Phase 4: Microservices & Cloud (Weeks 9–12)
Focus: Distributed systems, DevOps basics, and cloud deployment.

Week 9: Microservices Communication & Core Patterns
Communication: * Sync: REST / Feign Client.

Async: Message Brokers (RabbitMQ/Kafka basics).

Greenfield Patterns: * API Gateway: Single entry point for routing and security.

Service Discovery: Dynamic service registration and location (e.g., Eureka).

API Composer: Aggregating data from multiple services.

Week 10: Advanced Microservices Patterns
SAGA Pattern: Managing distributed transactions and maintaining data consistency across microservices.

CQRS (Command Query Responsibility Segregation): Separating read and write operations for performance and scalability.

Week 11: Observability & DevOps Basics
Distributed Tracing & Logging: Tracking requests across service boundaries (e.g., Spring Cloud Sleuth/Micrometer, Zipkin, ELK Stack).

Monitoring & Alerts: Health checks and metrics using Spring Boot Actuator and Prometheus/Grafana.

Containers: Docker basics (writing a Dockerfile, running containers) and an introduction to Jenkins pipelines for CI/CD.

Week 12: Cloud Fundamentals & K8s
Cloud Basics: Core concepts of cloud computing (AWS/Azure basics). Understanding Storage (S3/Blob), and Load Balancers.

Kubernetes (K8s): Basic understanding of Pods, Deployments, and Services for container orchestration.

💡 Capstoning Your Learning: Don't just read about these. Throughout this 12-week program, build a single, evolving project. Start with a Java console app in Phase 1, turn it into a Spring Boot application with a database in Phases 2 & 3, and break it into microservices deployed via Docker in Phase 4.








Here is the curated, production-level resource catalog mapped directly to your 12-week upskilling program.

These resources focus strictly on engineering internals, architectural trade-offs, and under-the-hood mechanics rather than basic syntax tutorials.

---

## Phase 1: Advanced Java Core (Weeks 1–3)

### 📚 Textbooks

* **"Effective Java" (3rd Edition)** by Joshua Bloch
* *Focus:* Deep dive into how language components behave. Essential for understanding internal collection structures, avoiding common API design anti-patterns, and utilizing generic bounds effectively.


* **"Java Concurrency in Practice"** by Brian Goetz
* *Focus:* Memory models, low-level concurrency, race conditions, thread safety, and thread pool scaling.



### 📺 Video Playlists

* **[Defog Tech](https://www.youtube.com/c/DefogTech/videos) (YouTube):** Best-in-class, visually animated deep dives into the Java Memory Model (JMM), thread synchronization, `Volatile` vs `Atomic`, and `ExecutorService` internals.
* **[Amigoscode - Java Collections](https://www.youtube.com/@amigoscode/playlists) (YouTube):** Practical deep dives into lists, sets, and map behaviors, tracing memory performance under data loads.

---

## Phase 2: Data, Testing, & Build Tools (Weeks 4–5)

### 📚 Textbooks

* **"High-Performance Java Persistence"** by Vlad Mihalcea
* *Focus:* Written by a core Hibernate engineer. This book explains database transaction management, fetching strategies, N+1 query optimization, and memory cache synchronization.


* **"Unit Testing Principles, Practices, and Patterns"** by Vladimir Khorikov
* *Focus:* Teaches how to write resilient unit tests, properly mock boundaries using Mockito without over-specifying, and optimize code coverage.



### 📺 Video Playlists

* **[Thorben Janssen](https://www.youtube.com/channel/UCYeDPubBiFCZXIOgGYoyADw/videos) (YouTube):** Advanced Hibernate/JPA tips. Covers query performance tuning, entity lifecycle states, and custom entity mapping techniques.

---

## Phase 3: Spring Boot & REST APIs (Weeks 6–8)

### 📚 Textbooks

* **"Spring Start Here"** by Laurentiu Spilca
* *Focus:* Master how the Spring Application Context works under the hood. Explains how the framework manages proxy objects, hooks into reflection, and coordinates aspect-oriented programming (AOP) like `@Transactional`.



### 📺 Video Playlists

* **[Java Brains - Spring Boot Quick Start](https://www.youtube.com/watch?v=ZvSRcsdqpsk) (YouTube):** Kaushik's architectural breakdown of dependency injection, component scanning, framework bootstrapping, configuration profiles, and REST mappings.

---

## Phase 4: Microservices & Cloud (Weeks 9–12)

### 📚 Textbooks

* **"Designing Data-Intensive Applications"** by Martin Kleppmann
* *Focus:* The definitive handbook on distributed architecture. Necessary for understanding split-brain situations, consensus protocols, and asynchronous messaging trade-offs.


* **"Microservices Patterns"** by Chris Richardson
* *Focus:* Concrete enterprise implementations for distributed systems, fully detailing the design mechanics of SAGA, CQRS, and API Composition.



### 📺 Video Playlists

* **[Java Brains - Spring Boot Microservices Level 1](https://www.youtube.com/watch?v=ZvSRcsdqpsk) (YouTube):** An ongoing deep-dive playlist detailing inter-service synchronous communication via `WebClient`, Service Discovery using Eureka, and managing distributed configuration properties.

---

This highly acclaimed video [Spring Boot Microservices Level 1: Communication and Discovery](https://www.youtube.com/watch?v=ZvSRcsdqpsk) by Java Brains breaks down step-by-step how distinct applications connect, map data models over network boundaries, and dynamically locate each other inside a distributed cluster architecture.

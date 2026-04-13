# 🏆 SportAid - Sports Training & Injury Management

SportAid is a premium, high-performance dashboard designed for sports management. It leverages **Java Spring Boot** and **H2 Database** to provide real-time tracking of athlete training loads, injury recovery, and session scheduling through a sleek, modern UI.

![SportAid Dashboard](src/main/resources/static/index.html) *Note: Dashboard screenshot available in the UI overhaul walkthrough.*

## ✨ Features

- **High-Performance Dashboard**: Modern Dark Mode with glassmorphism and real-time activity feeds.
- **Athlete Management**: Full CRUD operations for athlete profiles and medical oversight.
- **Training Intelligence**:
    - Session scheduling and tracking.
    - Automated Training Load calculation (RPE × Duration).
    - Longitudinal ACWR (Acute:Chronic Workload Ratio) monitoring.
- **Injury & Recovery**:
    - **Database-Level Triggers**: Athlete status (Active/Injured) is automatically synchronized via H2 triggers when injuries or recovery sessions are logged.
    - Wellness and Sleep Quality tracking.
- **Database Integrity**: Built on JDBC with a robust relational schema in H2.

## 🛠️ Technology Stack

- **Backend**: Java 17+, Spring Boot 3.2.4
- **Database**: H2 (In-memory/File-based)
- **Data Access**: Spring JDBC Template
- **Frontend**: Vanilla JS, HTML5, CSS3 (Custom Premium Theme)
- **Icons**: FontAwesome 6+
- **Typography**: Outfit (Google Fonts)

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven (optional, wrapper included)

### Running the Application
1. Clone the repository:
   ```bash
   git clone https://github.com/Samairamalik/SportCare.git
   cd SportCare
   ```
2. Build and run using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
3. Access the dashboard:
   Open your browser and go to **[http://localhost:8080](http://localhost:8080)**

## 📊 Database Access
The **H2 Console** is enabled for debugging and manual data oversight.
- **URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:file:./sports_db`
- **User**: `sa`
- **Password**: *(Leave blank)*

## 📐 Architecture & Compliance
This project strictly adheres to **Lab 12** requirements:
- **JDBC**: All database interactions use raw SQL through `JdbcTemplate`.
- **Triggers**: Automated status management is handled by `InjuryTrigger`, `InjuryDeleteTrigger`, and `RecoveryTrigger`.
- **Schema Management**: Database initialization is managed via `schema.sql` and `data.sql`.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---
*Created for Sports Training & Injury Management Optimization.*

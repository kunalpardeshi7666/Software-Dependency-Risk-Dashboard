# Software Dependency Risk Analysis Dashboard

A comprehensive platform to **analyze software dependencies** in a project and identify **license risks, legal issues, security vulnerabilities, and required permissions**. This tool helps developers and organizations build secure, compliant, and low-risk software.

---

## 📌 Project Overview

Modern applications rely heavily on third-party libraries. Each dependency may introduce **legal, security, and permission-related risks**. This dashboard scans project dependencies and provides an **interactive risk analysis dashboard** for informed decision-making.

---

## 📂 Overall Project Structure

```
dependency-risk-analyzer/
│
├── frontend/
├── backend/
├── ai-engine/
├── scanner/
├── database/
├── docs/
├── deployment/
└── README.md
```

---

## 🎨 Frontend (React)

```
frontend/
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── RiskCard.jsx
│   │   ├── DependencyTable.jsx
│   │   └── ChatbotWidget.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Dependencies.jsx
│   │   ├── Vulnerabilities.jsx
│   │   ├── Licenses.jsx
│   │   ├── Reports.jsx
│   │   └── Login.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   └── authService.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── styles/
│   └── App.jsx
│
└── package.json
```

**Responsibilities**:

* Interactive dashboard UI
* Dependency visualization & risk indicators
* Authentication & role-based access
* Reports and analytics charts

---

## ⚙️ Backend (Node.js + Express)

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dependencyController.js
│   │   ├── vulnerabilityController.js
│   │   ├── reportController.js
│   │   └── aiController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dependencyRoutes.js
│   │   ├── vulnerabilityRoutes.js
│   │   ├── reportRoutes.js
│   │   └── aiRoutes.js
│   │
│   ├── services/
│   │   ├── scanService.js
│   │   ├── riskScoringService.js
│   │   ├── licenseService.js
│   │   └── historyService.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Dependency.js
│   │   ├── Vulnerability.js
│   │   └── ScanHistory.js
│   │
│   └── app.js
│
└── package.json
```

**Responsibilities**:

* API layer for frontend
* Authentication & authorization
* Dependency scanning orchestration
* Risk scoring & report generation

---

## 🤖 Scanner & AI Engine

```
scanner/
├── parsers/
│   ├── npmParser.js
│   ├── mavenParser.js
│   ├── pipParser.js
│   └── gradleParser.js
│
├── scanners/
│   ├── dependencyCheck.js
│   ├── snykScanner.js
│   └── trivyScanner.js
│
├── output/
│   └── scan-results.json
│
└── scanRunner.js
```

**Responsibilities**:

* Parse dependency files (npm, Maven, Pip, Gradle)
* Scan vulnerabilities & CVEs
* Collect license & permission metadata

---

## 🚀 Features

### ✅ 1. Dependency Scanner

* Automatically reads project files:

  * `package.json`
  * `pom.xml`
  * `requirements.txt`
* Extracts dependency name, version & metadata

### ✅ 2. License & Legal Risk Analyzer

* Detects license types using **SPDX / GitHub API**
* Flags high-risk licenses:

  * GPL / AGPL / LGPL
* Displays:

  * Commercial usage restrictions
  * Copyleft obligations
  * Modification & redistribution rules
  * Attribution & patent requirements

### ✅ 3. Permission Requirement Analyzer

Identifies permissions required by each dependency:

* File System Access
* Camera / Microphone
* Network Access
* Location / Sensors
* System-Level Permissions

Explains **why** each permission is needed.

### ✅ 4. Security Vulnerability Checker

* CVE database lookup
* OWASP Dependency Check
* Severity levels:

  * LOW
  * MEDIUM
  * HIGH
  * CRITICAL

### ✅ 5. Interactive Dashboard

* Clean developer-friendly UI
* Search, sort & filter dependencies
* Risk-based color indicators
* Detailed package-level insights

### ✅ 6. Exportable Reports

* PDF & CSV export
* Summary and detailed risk reports

---

## 🏗️ Architecture Overview

```
+-------------------------------+
|   Dependency Input (Project)  |
|  package.json / pom.xml ...   |
+---------------+---------------+
                |
                v
+-------------------------------+
| Dependency Scanner Module     |
+---------------+---------------+
                |
                v
+-------------------------------+
| License Analyzer | CVE Scanner|
| Permission Detector           |
+---------------+---------------+
                |
                v
+-------------------------------+
| Risk Score Engine             |
+---------------+---------------+
                |
                v
+-------------------------------+
| Dashboard UI (React)          |
+-------------------------------+
```

---

## 🖥️ Tech Stack

### Frontend

* React.js
* Tailwind CSS / ShadCN UI
* Recharts / Chart.js

### Backend

* Node.js + Express
* Python (optional for deep scanning)
* MongoDB / PostgreSQL

### Tools & Databases

* SPDX License Database
* GitHub REST API
* OWASP Dependency Check
* NPM / Maven Registry
* CVE Database

---

## 📦 Deployment & DevOps

```
deployment/
├── docker/
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── ai-engine.Dockerfile
│
├── docker-compose.yml
└── nginx/
    └── nginx.conf
```

---

## 📈 Future Enhancements

* CI/CD pipeline integration
* Real-time dependency monitoring
* Policy-based license enforcement
* AI-powered remediation suggestions

---


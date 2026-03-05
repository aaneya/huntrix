


# 🏥 MediVault

### Blockchain-Based Medical Record Fraud Prevention System

<p align="center">
  <img src="" alt="MediVault Logo" width="200"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.8+-blue.svg"/>
  <img src="https://img.shields.io/badge/Blockchain-SHA256-green.svg"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg"/>
  <img src="https://img.shields.io/badge/Test%20Coverage-85%25-brightgreen"/>
</p>

<p align="center">
A secure, immutable medical record management system powered by blockchain technology.
</p>

---

## 📋 Table of Contents

* [About The Project](#-about-the-project)
* [Why This Project?](#-why-this-project)
* [Key Features](#-key-features)
* [Technology Stack](#-technology-stack)
* [Project Architecture](#-project-architecture)
* [Getting Started](#-getting-started)
* [Installation](#-installation)
* [Configuration](#-configuration)
* [Project Structure](#-project-structure)
* [Usage Guide](#-usage-guide)
* [API Reference](#-api-reference)
* [Security](#-security)
* [Testing](#-testing)
* [Deployment](#-deployment)
* [Contributing](#-contributing)
* [License](#-license)
* [Contact](#-contact)

---

# 📖 About The Project

**MediVault** is a comprehensive blockchain-powered medical record management system designed to eliminate fraud, ensure data integrity, and protect patient safety.

Inspired by India's DigiLocker initiative, MediVault provides a secure platform where healthcare providers and patients can store, verify, and share medical records with full transparency and immutability.

### 🔒 What Makes MediVault Different?

Unlike traditional EHR systems that rely on centralized databases, MediVault uses blockchain technology to ensure:

* ✅ **Proof of Existence** – Timestamped blockchain entries
* ✅ **Tamper Detection** – Hash mismatch instantly detected
* ✅ **Complete Audit Trail** – Permanent logging of every action
* ✅ **Distributed Trust** – No single point of failure

---

# ❗ Why This Project?

Healthcare systems face major integrity challenges:

### 🚨 Problems in Current Systems

* Medical record tampering
* Insurance fraud
* Lack of accountability
* Patient safety risks
* Centralized database breaches
* Inter-hospital trust issues

### ✅ The MediVault Solution

* Immutable blockchain storage
* SHA-256 cryptographic hashing
* Multi-factor authentication
* Role-based access control
* Full audit transparency

---

# ✨ Key Features

## 🔐 Authentication System

* Phone OTP Login (Twilio)
* Google OAuth
* GitHub OAuth
* Traditional Login
* Multi-Factor Authentication

## 📄 Medical Record Management

* Consultation Records
* Lab Reports
* Imaging Reports
* Prescriptions
* Vaccination Records
* Discharge Summaries
* Surgical Records
* Medical Certificates
* Version control
* Blockchain auto-registration

## 🔍 Verification System

* Instant hash verification
* Tamper detection
* Verification history logs
* Batch verification

## 📤 Secure Sharing

* Expiring share links
* View / download permissions
* Password-protected access
* Access tracking

## 📊 Dashboard & Analytics

* Activity monitoring
* Storage analytics
* Audit reports
* Role-based dashboards

---

# 🛠 Technology Stack

## Frontend

* Python Tkinter
* JavaScript (ES6+)
* CSS3

## Backend

* Python 3.8+
* Flask 2.3+
* PostgreSQL 14+
* SQLite (local cache)

## Blockchain

* Custom Python implementation
* SHA-256 hashing
* Merkle Trees

## Security

* bcrypt
* JWT
* AES-256 encryption
* OAuth 2.0

## External Services

* Twilio (OTP)
* Google OAuth
* GitHub OAuth

---

# 🏗 Project Architecture

```
Desktop GUI / Web Admin
        │
    Load Balancer
        │
  Flask Application Server
        │
 ┌──────────────┬──────────────┬──────────────┐
 Authentication  Blockchain      Document
 Service         Engine          Service
        │
 PostgreSQL + File Storage + Redis
        │
   Blockchain Ledger
```

---

# 🚀 Getting Started

## Prerequisites

* Python 3.8+
* PostgreSQL 14+
* pip
* Git (optional)

---

# ⚙ Installation

```bash
# Clone repository
git clone https://github.com/yourusername/medivault.git
cd medivault

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

---

# 🗄 Database Setup

```bash
sudo -u postgres psql

CREATE DATABASE medivault;
CREATE USER medivault_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE medivault TO medivault_user;
\q
```

Initialize schema:

```bash
python scripts/init_db.py
```

---

# 🔑 Environment Configuration

Create `.env` file:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medivault
DB_USER=medivault_user
DB_PASSWORD=your_secure_password

SECRET_KEY=your-super-secret-key
DEBUG=True

GOOGLE_CLIENT_ID=your_google_client_id
GITHUB_CLIENT_ID=your_github_client_id

TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

ENCRYPTION_KEY=32-character-key
```

---

# ▶ Run Application

```bash
python main.py
```

Open:

```
http://localhost:5000
```

---

# 📂 Project Structure

```
medivault/
├── main.py
├── blockchain/
├── auth/
├── api/
├── controllers/
├── models/
├── services/
├── database/
├── gui/
├── tests/
├── scripts/
└── uploads/
```

---

# 📡 API Reference (Summary)

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/send-otp`
* `POST /api/auth/verify-otp`
* `GET /api/auth/google`
* `GET /api/auth/github`

### Records

* `POST /api/records`
* `GET /api/records`
* `GET /api/records/:id`
* `GET /api/records/:id/verify`

### Documents

* `POST /api/documents/upload`
* `GET /api/documents/:id`
* `POST /api/documents/:id/share`

### Blockchain

* `GET /api/blockchain/status`
* `GET /api/blockchain/verify/:hash`

---

# 🔐 Security

* AES-256 encryption (at rest)
* TLS 1.3 (in transit)
* bcrypt password hashing
* JWT session tokens
* Role-based access control
* Account lockout protection
* Immutable blockchain ledger

Designed for HIPAA, GDPR, HITECH alignment.

---

# 🧪 Testing

```bash
pytest
pytest --cov=.
pytest -v
```

Current coverage: **85%+**

---

# 🐳 Deployment

## Docker

```bash
docker build -t medivault .
docker run -p 5000:5000 medivault
```

## Docker Compose

```bash
docker-compose up --build
```

Supports:

* AWS (EC2 + RDS + S3)
* Azure
* Google Cloud

---

# 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Write tests
4. Run tests
5. Submit PR

Follow PEP 8 + use `black` and `flake8`.

---

# 📜 License

MIT License

You are free to:

* Use
* Modify
* Distribute
* Sublicense

Include license notice in copies.



 # 📬 Developing Team

### 1. Aaneya Shokken

GitHub: https://github.com/aaneya/huntrix

### 2. Aayush Sharma

Email: [aayushsharma80104@gmail.com](mailto:aayushsharma80104@gmail.com)
GitHub: https://github.com/Ayushcodesaver

### 3. Bhragender Kumar Singh

Email: [Bhragender06@gmail.com](mailto:Bhragender06@gmail.com)
GitHub: https://github.com/Bhragender06

### 4. Kaashvi

Email: [kaashvigupta00@gmail.com](mailto:kaashvigupta00@gmail.com)
GitHub: https://github.com/kaashvi5

### 5. Sparsh Gumber

Email: [sparshhumber060906@gmail.com](mailto:sparshhumber060906@gmail.com)
GitHub: https://github.com/Sparshgumber060906

---

<p align="center">
⭐ If you found this project useful, please star the repository!
</p>






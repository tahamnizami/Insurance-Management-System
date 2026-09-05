# 🚀 Insurance Management System

Backend system powering a **digital insurance platform** designed to automate and manage the complete lifecycle of:

* Insurance proposals
* Policy issuance
* Claims handling
* Refund processing
* Renewals & notifications

The system provides secure APIs for both **end users (mobile/web)** and **admin dashboard**, with strict **role-based access control (RBAC)**.

---

# 📌 Overview

This system follows a **modular, scalable architecture** that ensures smooth data flow across all insurance operations.

Currently supported insurance types:

* **Motor Insurance**
* **Travel Insurance** (Domestic, Hajj/Umrah/Ziarat, International, Student Guard)

The platform enforces a **controlled proposal lifecycle**, where every submission goes through validation, review, and approval before becoming an active policy.

---

# ✨ Core Features

## 🧾 Proposal Management

* Submit insurance proposals (Motor & Travel)
* KYC verification during submission
* Document uploads with validation
* Proposal lifecycle tracking (Submitted → Review → Approved/Rejected)

## 👨‍💼 Admin Proposal Review

Admins can:

* Approve proposals
* Reject proposals
* Request specific document re-uploads

✔ Strict workflow enforcement ensures data integrity

---

## 💳 Payments System

* Payment initialization
* Manual payment confirmation (currently)
* Payment status independent from proposal status

---

## 💰 Refund Workflow

* Automatically triggered if a **paid proposal is rejected**
* Finance admins can:

  * Process refunds
  * Upload refund proof
  * Close refund cases

---

## 📄 Policy Issuance

* Approved + paid proposals → converted into policies
* Includes:

  * Policy number assignment
  * Policy document upload
  * Automatic expiry calculation

⚡ Optimization: Policies are stored within proposal records (no separate table)

---

## 🔁 Policy Renewal

* Admin uploads renewal documents after expiry
* Users receive notifications and can download updated policies

---

## 📢 Notification System (Event-Driven)

Supports:

* In-app notifications
* Email notifications
* Push notifications (Firebase)

Triggered events include:

* Proposal updates
* Payment reminders
* Policy issuance
* Policy expiry alerts
* Refund updates

---

## 📂 Claims Management

* Users can submit claims with:

  * Supporting documents
  * Voice notes for explanation
* Duplicate claim prevention for active cases
* Admin can assign surveyors

---

## 🛠 Support Module

* Users can create support requests
* Restriction: One active message at a time until admin replies

---

## 👥 Admin & User Management

Admins can:

* View users and their proposals
* Trigger OTP-based password reset
* Manage system modules based on roles

---

# 🔐 Security Features

* JWT-based authentication
* OTP verification system
* 2-step user registration (temporary user table)
* Role-Based Access Control (RBAC)
* Account lock after failed login attempts
* Rate limiting to prevent abuse:

  * OTP generation limits
  * OTP verification limits
  * Login attempt limits

---

# ⚙️ System Architecture

Modular structure:

```
modules/
 ├── auth
 ├── proposals
 ├── policies
 ├── refunds
 ├── notifications
 ├── claims
 ├── support
 └── admin
```

Each module follows:

```
service → controller → routes
```

✔ Clean separation of concerns
✔ Easy scalability & maintenance

---

# 🧠 Business Logic Highlights

### Motor Insurance

* Vehicle eligibility up to model year 2010
* Custom vehicle entry supported
* "Applied for Registration" flow with cover note
* Policy issued only after registration update

---

### Travel Insurance Categories

* Domestic
* Hajj / Umrah / Ziarat
* International
* Student Guard

---

### Re-upload Flow

* Admin requests specific document
* User can only upload requested document
* Old document is replaced in database

---

### Cover Note Generation

After successful payment:

* User receives a **Cover Note** containing:

  * Personal details
  * Vehicle details
  * Premium info
  * Policy start date

---

# ⏱ Cron Jobs (Automation)

Automated tasks include:

* Payment reminders
* Proposal expiry alerts
* Policy expiry reminders (30/15/5/1 days)
* Birthday email notifications (9:00 AM PKT)
* Motor registration reminders

---

# 📦 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Authentication:** JWT
* **Email Service:** Nodemailer
* **Push Notifications:** Firebase
* **File Uploads:** Multer
* **Task Scheduling:** node-cron
* **Rate Limiting:** express-rate-limit
* **PDF Generation:** Puppeteer

---

# 📁 File Storage

```
uploads/
 ├── policies/
 ├── refunds/
 └── renewals/
```

* Files stored locally
* Database stores relative paths only

---

# 🔌 API Structure

## User APIs

```
POST /api/auth/register
POST /api/auth/login
GET  /api/proposals
GET  /api/notifications
POST /api/claims
```

## Admin APIs

```
POST   /api/admin/auth/login
GET    /api/admin/proposals
PATCH  /api/admin/proposals/:id/review
POST   /api/admin/policies/issue
GET    /api/admin/refunds
POST   /api/admin/notifications
```

---

# 🧪 Testing

* Complete **Postman collection** available for API testing

---

# 📊 Logging & Monitoring

* Admin activity logging system
* Tracks actions for auditing and security purposes

---

# ⚙️ Environment Variables

The backend reads its environment file from `src/.env`. Create that file before
starting the API. Do not commit it, because it contains database credentials and
other private configuration. The repository already ignores `.env` files.

```bash
cd src
touch .env
```

Use the following configuration as a starting point and replace placeholder
values with your local or deployment-specific values:

```env
# API
PORT=4000
APP_BASE_URL=http://localhost:4000
NODE_ENV=development

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=your_mysql_password
DB_NAME=InsuranceManagementSystem

# Authentication
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
ADMIN_JWT_SECRET=replace_with_a_separate_admin_secret

# Email / SMTP
SMTP_HOST=localhost
SMTP_PORT=25
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
MAIL_FROM_NAME=Insurance Management System
MAIL_FROM_EMAIL=no-reply@example.com

# Firebase push notifications
GOOGLE_APPLICATION_CREDENTIALS=service-account.json

# Optional PayFast configuration
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_optional_passphrase
PAYFAST_PROCESS_URL=https://sandbox.payfast.co.za/eng/process
PAYFAST_RETURN_URL=https://example.com/payment/success
PAYFAST_CANCEL_URL=https://example.com/payment/cancel
```

`GOOGLE_APPLICATION_CREDENTIALS` points to the Firebase service-account JSON
file used for push notifications. Keep that file private as well. Email,
Firebase, and PayFast variables can be configured when those integrations are
used; the MySQL and JWT variables are required for normal API operation.

---

# 🚀 Installation

## 1. Install dependencies

```bash
git clone https://github.com/tahamahmood004/Insurance-Management-System.git
cd Insurance-Management-System/src
npm install
```

## 2. Create the database

Create the database named in `DB_NAME`, then import the schema. The default
schema expects `InsuranceManagementSystem`:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS InsuranceManagementSystem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p InsuranceManagementSystem < MySQL_schema.sql
```

If the MySQL account in `src/.env` does not exist yet, create it or use an
existing MySQL account in `DB_USER` and `DB_PASSWORD`.

## 3. Configure and start the backend

Create `src/.env` using the example above, then start the API from `src`:

```bash
npm start
```

The API runs at `http://localhost:4000`. Check `http://localhost:4000/health`
to verify that the server is responding.

---

# 📈 Project Status

Completed:

* ✅ Authentication & Security
* ✅ Proposal Management System
* ✅ Payment & Refund Workflow
* ✅ Admin Management System
* ✅ Notification System
* ✅ Policy Issuance
* ✅ Policy Renewal
* ✅ Claims & Support Module

---

# 🔮 Future Improvements

* Payment gateway integration
* Advanced claim workflows
* Multi-renewal history
* Real-time push improvements
* Analytics dashboard

---

# 📄 License

Internal Project — Insurance Management System

---

# 💡 Note

This project demonstrates:

* Real-world backend architecture
* Complex business logic handling
* Scalable modular design
* Production-level security practices
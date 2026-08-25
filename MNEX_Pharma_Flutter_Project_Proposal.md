# MNEX PHARMA

## Pharmacy Management Mobile Application

**Student Name:** Mufazzal hasan khan Midad  
**Student ID:** 232-134-030  
**Subject:** Mobile App Development  
**Program & Batch:** SWE - 5th Batch  

## 1. Project Description

MNEX Pharma is a mobile-based pharmacy management application developed using Flutter. The application is designed to help pharmacies manage medicines, inventory, sales, customers, suppliers, prescriptions, purchases, employees, and reports from a single mobile system.

The main purpose of the application is to make pharmacy operations faster, easier, and more organized. Instead of managing medicines, stock, sales, and customer information manually, pharmacy staff can use the mobile app to store and access important information digitally.

The project will focus on providing a simple and user-friendly pharmacy management system for small and medium pharmacy businesses. It will not be a complete hospital management system, but it will cover the core workflow of a pharmacy.

## 2. Problem Statement

Many small and medium pharmacies still manage their daily operations manually using paper records, notebooks, or simple spreadsheets. This can create several problems:

- Medicine stock can be difficult to track properly.
- Expired medicines may not be identified on time.
- Low stock medicines may not be reordered quickly.
- Sales records can be lost or miscalculated.
- Customer and prescription information may be difficult to find.
- Supplier and purchase records may become disorganized.
- Pharmacy owners may not get clear reports about sales and inventory.

MNEX Pharma aims to solve these problems by providing a mobile application where pharmacy staff can manage medicines, sales, stock, prescriptions, customers, suppliers, and reports in one system.

## 3. Target Users

### Pharmacy Owner / Admin

The pharmacy owner or admin is the main user of the system. The admin can:

- View dashboard summary.
- Manage medicines and stock.
- View sales and revenue reports.
- Manage users and roles.
- Manage suppliers, customers, employees, and purchases.

### Pharmacist

The pharmacist can use the system to:

- Check medicine information.
- Verify prescriptions.
- Dispense medicines to patients.
- Track expired and low-stock medicines.

### Sales Cashier

The sales cashier can use the system to:

- Select medicines for sale.
- Create bills or invoices.
- Finalise sales.
- Manage customer purchase records.

### Inventory Manager

The inventory manager can use the system to:

- Monitor stock quantity.
- Check low-stock medicines.
- Check expired medicines.
- Update inventory records.

### Purchase Manager

The purchase manager can use the system to:

- Manage suppliers.
- Record medicine purchases.
- Track purchase amount and payment status.

## 4. List of Core Features

### 4.1 User Authentication

- User registration
- User login and logout
- Secure access using authentication token
- Basic user profile

### 4.2 Dashboard

The dashboard will show the main pharmacy summary, such as:

- Total medicines
- Total sales
- Total revenue
- Low-stock medicines
- Expired medicines
- Active suppliers
- Sales and inventory charts

### 4.3 Medicine Management

Users can manage medicine records. This feature includes:

- Add new medicine
- Edit medicine information
- Delete medicine
- View medicine details
- Search and filter medicines
- Store medicine name, generic name, category, batch, price, stock, and expiry date

### 4.4 Inventory Management

The inventory module will help track medicine stock. It includes:

- View available stock
- Track low-stock medicines
- Track out-of-stock medicines
- Track expired medicines
- Adjust stock quantity
- Calculate inventory value

### 4.5 Sales POS

The Sales POS module will be used for selling medicines. It includes:

- Select medicines
- Add medicines to cart
- Calculate subtotal, discount, VAT, and grand total
- Select payment method
- Finalise bill
- Generate invoice
- Reduce stock after sale

### 4.6 Customer Management

The customer module will store patient/customer records. It includes:

- Add customer
- Edit customer
- View customer details
- Delete customer
- Store phone, email, address, purchase history, and loyalty points

### 4.7 Supplier Management

The supplier module will manage medicine suppliers. It includes:

- Add supplier
- Edit supplier
- Delete supplier
- View supplier information
- Track supplier purchase value and dues

### 4.8 Prescription Management

The prescription module will track prescriptions from verification to dispensing. It includes:

- Add or upload prescription record
- Pending prescriptions
- Verified prescriptions
- Dispensed prescriptions
- Track patient name and prescription items
- Record who dispensed the medicine

### 4.9 Doctor Management

The doctor module will store doctor information. It includes:

- Add doctor
- Edit doctor
- View doctor profile
- Store specialization, department, phone, and email

### 4.10 Employee Management

The employee module will manage pharmacy staff records. It includes:

- Add employee
- Edit employee
- View employee details
- Store role, department, salary, and status

### 4.11 Purchase Management

The purchase module will record medicines bought from suppliers. It includes:

- Add purchase record
- Edit purchase record
- Track supplier name
- Track invoice number
- Track purchase amount
- Track purchase/payment status

### 4.12 Reports and Analytics

Reports will help the admin understand pharmacy performance. It includes:

- Sales report
- Revenue summary
- Inventory report
- Top customers
- Stock value
- Charts and statistics

### 4.13 User and Role Management

The admin can manage system users. It includes:

- Add users
- Edit users
- Assign roles
- Activate or deactivate users

### 4.14 Settings and Notifications

The system will include:

- Pharmacy information settings
- Tax/VAT settings
- Notification settings
- Low-stock alerts
- Expired medicine alerts
- Pending prescription alerts

## 5. Technical Architecture

### 5.1 Frontend

**Technology:** Flutter + Dart

Flutter will be used to develop the mobile application interface. The application will use:

- Material UI
- Custom reusable widgets
- Mobile navigation
- Forms and validation
- List views
- Cards and dashboards
- Responsive mobile layouts

### 5.2 Backend

**Technology:** Laravel PHP

Laravel will be used as the backend API. The backend will handle:

- API routes
- User authentication
- Data validation
- Business logic
- Sales processing
- Stock update after sale
- Report data processing

### 5.3 Database

**Technology:** MySQL

MySQL will be used to store all pharmacy data. The database will store:

- Users
- Medicines
- Customers
- Suppliers
- Sales
- Prescriptions
- Doctors
- Employees
- Purchases
- Notifications
- Settings

### 5.4 Basic System Architecture

```text
MNEX Pharma
│
Flutter Mobile App
│
├── Admin
├── Pharmacist
├── Sales Cashier
├── Inventory Manager
└── Purchase Manager
│
Laravel REST API
│
MySQL Database
│
├── Users
├── Medicines
├── Customers
├── Suppliers
├── Sales
├── Prescriptions
├── Employees
└── Reports
```

## 6. Project Scope

The project will focus on the core pharmacy management workflow:

```text
Login
→ View Dashboard
→ Manage Medicines
→ Track Inventory
→ Sell Medicines through POS
→ Manage Customers and Suppliers
→ Manage Prescriptions
→ Record Purchases
→ View Reports
```

To keep the project manageable within the course duration, advanced features such as online payment gateway, barcode scanner, real-time chat, delivery tracking, multi-branch pharmacy control, and AI-based medicine recommendation will not be included.

The goal is to develop a functional, user-friendly, and well-designed mobile application that demonstrates practical concepts of Flutter mobile app development, Laravel API development, and MySQL database management.

## 7. Conclusion

MNEX Pharma will help pharmacies manage their daily operations digitally. The system will reduce manual work, improve stock tracking, help manage sales and prescriptions, and provide useful reports for pharmacy owners. This project will demonstrate a complete mobile application workflow using Flutter for the frontend, Laravel for the backend, and MySQL for data storage.

# MNEX Pharma Mobile

MNEX Pharma Mobile is a Flutter-based pharmacy ordering and management application. The app connects two main users in one system: customers who order medicines and pharmacy staff who manage orders, prescriptions, inventory, billing, and delivery updates.

## Project Overview

This project is designed for a Mobile App Development university submission. It focuses on a practical pharmacy workflow where a customer can browse medicines, upload a prescription when required, place an order, and track delivery progress. Pharmacy staff can log in separately to review prescriptions, manage orders, update delivery status, and monitor pharmacy operations.

## Key Idea

Unlike a basic pharmacy inventory app, MNEX Pharma Mobile includes both:

- A customer-facing medicine ordering system
- A staff-facing pharmacy management system

This makes the app useful for real-life pharmacy scenarios such as prescription review, rider pickup tracking, and delivery confirmation.

## Main Features

### Customer Side

- Customer-first welcome screen
- Medicine browsing with category filters
- Search medicines by name, generic, or category
- Medicine detail view with manufacturer, generic, strength, stock, and price
- Cart and checkout
- Delivery or pickup option
- Customer profile with saved name, phone, and address
- Prescription upload for restricted medicines
- Prescription review status tracking
- Order tracking by phone number
- Rider pickup time, delivery ETA, and delivery confirmation updates

### Pharmacy Staff Side

- Staff login
- Dashboard summary
- Medicine inventory
- Sales POS billing
- Patient/customer records
- Supplier, prescription, purchase, and report summaries
- Customer order management
- Prescription approval or rejection
- Delivery status updates:
  - Pending
  - Confirmed
  - Packing
  - Out for delivery
  - Delivered
  - Cancelled
- Rider name, rider phone, pickup time, delivery ETA, and update notes

## Prescription Workflow

1. Customer selects medicines.
2. If a medicine requires a prescription, the app asks for a prescription image.
3. Customer uploads the prescription during checkout.
4. Pharmacy staff reviews the uploaded prescription.
5. Staff marks the prescription as approved or rejected.
6. If approved, the order can continue to packing and delivery.
7. Customer can track prescription review and order delivery status.

## Technologies Used

- Flutter
- Dart
- Material 3
- HTTP API integration
- Shared Preferences for local customer/session storage
- Image Picker for prescription image upload
- Node.js backend API
- Local JSON database for development persistence

## Project Structure

```text
mnexpharma_mobile/
  lib/
    main.dart
  android/
  ios/
  web/
  test/
  pubspec.yaml
  README.md

-mnexpharma/
  server/
    index.js
    database.js
    data/db.json
  src/
  package.json
```

## Backend Setup

Start the backend first:

```powershell
cd "C:\Users\midad\OneDrive\Documents\New project\-mnexpharma"
npm install
npm run build
node server/index.js
```

Backend runs at:

```text
http://localhost:3001
```

## Flutter App Setup

Run the Flutter app:

```powershell
cd "C:\Users\midad\OneDrive\Documents\New project\mnexpharma_mobile"
& "C:\Users\midad\Downloads\flutter_windows_3.47.1-stable\flutter\bin\flutter.bat" pub get
& "C:\Users\midad\Downloads\flutter_windows_3.47.1-stable\flutter\bin\flutter.bat" run
```

For Android emulator, the app uses:

```text
http://10.0.2.2:3001/api
```

For Chrome/desktop testing, the app uses:

```text
http://127.0.0.1:3001/api
```

## Staff Login

```text
Email: admin@mnexpharma.com
Password: admin123
```

## Screenshots

Add screenshots in a `screenshots/` folder and update the links below.

```text
screenshots/
  01-welcome.png
  02-customer-shop.png
  03-medicine-details.png
  04-cart-checkout.png
  05-prescription-upload.png
  06-order-tracking.png
  07-staff-dashboard.png
  08-prescription-review.png
  09-delivery-update.png
```

Suggested README screenshot layout:

```markdown
![Welcome](screenshots/01-welcome.png)
![Customer Shop](screenshots/02-customer-shop.png)
![Medicine Details](screenshots/03-medicine-details.png)
![Checkout](screenshots/04-cart-checkout.png)
![Prescription Upload](screenshots/05-prescription-upload.png)
![Order Tracking](screenshots/06-order-tracking.png)
![Staff Dashboard](screenshots/07-staff-dashboard.png)
![Prescription Review](screenshots/08-prescription-review.png)
![Delivery Update](screenshots/09-delivery-update.png)
```

## Demo Video Flow

Recommended 2-4 minute demo flow:

1. Open the app and explain customer-first home screen.
2. Browse medicines and filter by category.
3. Open a medicine detail page.
4. Add medicine to cart.
5. Upload prescription for prescription-required medicine.
6. Place an order.
7. Track the order by phone number.
8. Log in as pharmacy staff.
9. Approve the prescription.
10. Update order status, rider pickup time, and delivery ETA.
11. Return to customer tracking and show updated status.

## Testing

The project was checked with:

```powershell
dart analyze
flutter test --no-pub
node --check server/index.js
```

## Originality Statement

This project was built as an original academic mobile app project for pharmacy ordering and management. The idea is inspired by real pharmacy delivery workflows, but the implementation, screens, backend routes, and project structure were developed for this submission.

## Future Improvements

- Online payment gateway
- Real pharmacist account roles
- OCR extraction from prescriptions
- Doctor registration number verification
- Push notifications
- Live rider map tracking
- Cloud database deployment
- Secure production authentication

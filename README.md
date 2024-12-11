# Transaction Dashboard

This project is a **Transaction Dashboard** application that aggregates, analyzes, and visualizes transaction data. It allows users to interact with and view various statistics, charts, and breakdowns based on transactions in a selected month or across all months.

## Live Deployed Link : https://transaction-dashboard-2khx02y0d-arjuns-projects-249f082e.vercel.app/

## Features

- **Transaction Data Visualization:**
  - Bar charts displaying sales data and item statistics.
  - Pie charts showing category-wise item counts.
  
- **Statistics:**
  - Display total sales, total items sold, and total items not sold.
  
- **Flexible Filtering:**
  - Filter transactions based on a selected month or view data for all months.

- **Firebase Integration:**
  - Uses Firebase Firestore to fetch transaction data.
  
## Technologies Used

- **Frontend:**
  - React (Next.js)
  - Tailwind CSS for styling
  - Chart.js for data visualization (Bar and Pie charts)
  
- **Backend:**
  - Next.js API routes to fetch data from Firebase Firestore
  - Firebase for database management
  
- **Deployment:**
  - Deployed on Vercel for frontend hosting

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Chingapo/transaction-dashboard.git
cd transaction-dashboard
```
## Step 2: Install Dependencies

Install the necessary dependencies by running the following command in the project directory:

```bash
npm install
```
## Step 3: Set Up Firebase and Environment Variables
- Set up Firebase credentials:
  Create a service account in Firebase Console and download the JSON credentials file.
Store this file in your project under the app directory (for example, app/service_account_key.json).
Add Firebase Project ID:

Add your Firebase Project ID to the .env file:

```bash
FIREBASE_PROJECT_ID=[your-project-id]
FIREBASE_CLIENT_EMAIL=[your-client-email]
FIREBASE_PRIVATE_KEY=[your-private-key]
```


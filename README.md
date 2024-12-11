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
## Step 4: Use Postman or your browser to ping the initialize api 
this copies the data from the link of sample database: https://s3.amazonaws.com/roxiler.com/product_transaction.json
to your firebase database.

```bash
http://localhost:3000//api/initialize
```

## Step 5: Run the Project Locally

Start the development server:

```
npm run dev
```


## API Routes

This project includes several API routes to interact with Firebase, retrieve transaction data, and calculate statistics. Each route serves a specific purpose and can be queried with a month parameter (1-12) to filter the data accordingly. If no month is provided, the APIs will return data for all months (month `13`).

### `/api/transactions`
- **Method**: `GET`
- **Description**: This route fetches all transaction data from Firebase. It includes details such as `itemId`, `title`, `price`, `description`, `category`, `image`, `sold` status, and the `dateOfSale` for each transaction. It then filters the data and sends only what is required by the frontend based on the page number and the size of a page.
- **Query Parameters**: 
  - `month`: The month number (1-12) to filter transactions by. If not provided, default is 13 which means data for all months will be returned.
  - `page` : The page number being accessed by the frontend.
  - `limit`: The maximum number of transactions to be visible on 1 page on the frontend.
  
- **Example Request**:
```
GET /api/transactions?month=5?page=1?limit=10
```
- **Example Response**:
```json
{
  "transactions": [
    {
        "id": 44,
        "title": "Mens Casual Slim Fit",
        "price": 63.96,
        "description": "The color could be slightly different between on the screen and in practice.  Please note that body builds vary by person therefore detailed size information should be reviewed below on the product description.",
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
        "sold": false,
        "dateOfSale": "2021-12-27T20:29:54+05:30"
    },
    {
        "id": 45,
        "title": "John Hardy Womens Legends Naga Gold  Silver Dragon Station Chain Bracelet",
        "price": 6950,
        "description": "From our Legends Collection the Naga was inspired by the mythical water dragon that protects the oceans pearl. Wear facing inward to be bestowed with love and abundance or outward for protection.",
        "category": "jewelery",
        "image": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
        "sold": true,
        "dateOfSale": "2022-06-27T20:29:54+05:30"
    }
  ]
}
```

### `/api/statistics`
- **Method**: `GET`

- **Description**: This route calculates and returns key statistics about sales and inventory for a given month. It provides:
  - `totalSale`: The total sales amount from all sold items.
  - `totalItemsSold`: The total number of items that have been sold.
  - `totalItemsNotSold`: The total number of items that have not been sold.
- **Query Parameters**:
  - `month`: The month number (1-12) to filter transactions by. If not provided, default is 13 which means data for all months will be returned.

- **Example Request**:
```
GET /api/statistics?month=5
```
- **Example Response:**

```
{
  "totalSale": 1250.99,
  "totalItemsSold": 100,
  "totalItemsNotSold": 50
}
```

### `/api/barChart`
- **Method**: `GET`

- **Description**: This route fetches data for rendering a bar chart, showing the distribution of transactions across different price ranges (e.g., 0-100, 101-200, etc.). It allows users to visualize the frequency of transactions within defined price ranges.

- **Query Parameters**:
  - `month`: The month number (1-12) to filter transactions by. If not provided, default is 13 which means data for all months will be returned.
- **Example Request**:
```
GET /api/barChart?month=5
```
- **Example Response**:

```
{
  "barChart": [
    { "range": "0-100", "count": 30 },
    { "range": "101-200", "count": 50 },
    { "range": "201-300", "count": 20 }
  ]
}
```
### `/api/pieChart`
- **Method**: `GET`

- **Description**: This route retrieves data for rendering a pie chart, displaying the distribution of transactions across different categories (e.g., Electronics, Furniture). This allows users to visually analyze which categories are most frequently sold.

- **Query Parameters**:
  - `month`: The month number (1-12) to filter transactions by. If not provided, default is 13 which means data for all months will be returned.
- **Example Request**:
```
GET /api/pieChart?month=5
```
- **Example Response**:

```
{
  "pieChart": [
    { "category": "Electronics", "count": 60 },
    { "category": "Furniture", "count": 40 }
  ]
}
```
### `/api/combined-data`
- **Method**: `GET`

- **Description**: This route aggregates data from the /api/statistics, /api/barChart, and /api/pieChart endpoints into a single response. It combines the statistics, bar chart data (price ranges), and pie chart data (categories) for the selected month.

- **Query Parameters**:
  - `month`: The month number (1-12) to filter transactions by. If not provided, default is 13 which means data for all months will be returned.
- **Example Request**:

```
GET /api/combined-data?month=5
```
- **Example Response**:

```
{
  "stats": {
    "totalSale": 1250.99,
    "totalItemsSold": 100,
    "totalItemsNotSold": 50
  },
  "barChart": [
    { "range": "0-100", "count": 30 },
    { "range": "101-200", "count": 50 },
    { "range": "201-300", "count": 20 }
  ],
  "pieChart": [
    { "category": "Electronics", "count": 60 },
    { "category": "Furniture", "count": 40 }
  ]
}
```

# Contributing
Feel free to submit issues and pull requests. Any contributions are welcome!

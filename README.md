# House Hustlers

Our group - **House Hustlers**, has been working on a machine model aimed to leverage historical housing market data and population datasets to predict future trends and fluctuations in the real estate market in the **City of Boroondara**. 

This is a **Python machine learning program** using *pandas*, *scikit-learn* & *matplotlib*. By Analysing key variables such as property prices, demographic shifts, and population growth patterns, this program seeks to provide valuable insight for stakeholders, including potential homebuyers, investors, and policy makers. 

The ultimate goal is to forecast future changes in the housing market, helping to inform strategic decisions and improve planning in the real estate industry.

## Authors:
| Name | Student ID |
| ----- | ---- | 
| Kimsakona SOK | 104526322 |  
| Hayden Janecic | 105339990 |
| Haoqian Huang | 104312084 |

## Backend
The backend is built using **FastAPI**, a high-performance web framework for building APIs with Python. The primary purpose of this backend is to serve as a prediction and data retrieval engine, providing endpoints for housing and population predictions based on user input.

The backend consists of two main files:
- **`model.py`**: This file contains the data processing and prediction logic.
- **`main.py`**: This file sets up the API routes, handles requests, and returns the data to the frontend.

---

### **Setup Instructions**

To allow users to run the model and make predictions, you can add instructions for running the server along with details on how to execute predictions via the frontend or directly using the backend API. Here’s an expanded README section:

#### **1. Install Dependencies**
Make sure you have all required packages installed. You can do this by running:

```bash
pip install fastapi uvicorn pandas scikit-learn joblib
```

#### **2. Train and Run the Server**
To train the models and start the FastAPI server, follow these steps:

1. **Train the Model**  
   In the `backend` directory, you can trigger model training by running:

   ```bash
   python model.py
   ```

   This will create saved model files (`linear_models.pkl` and `decision_tree_models.pkl`), which are necessary for making predictions.

2. **Run the Server**  
   After training, start the FastAPI server by running:

   ```bash
   uvicorn main:app --reload
   ```

   This will start the backend on `http://localhost:8000`.

### **Backend Structure and Explanation**

#### **1. `model.py` - Data Processing and Prediction Models**

This file contains the logic for:
- **Loading and Training Models**: It loads housing and population data, trains Linear Regression and Decision Tree models on various housing metrics, and saves these models.
- **Prediction Methods**:
  - **`get_predictions`**: Fetches predictions based on historical data and future projections for a given category (e.g., `mBuy_House`).
  - **`get_custom_prediction`**: Provides a custom prediction for a specific year, property type, transaction type, and value type, allowing users to query specific scenarios.
  - **`get_population_data`**: Retrieves population data for a selected suburb, allowing comparisons with the City of Boroondara.

#### **2. `main.py` - API Endpoints**

This file defines the FastAPI application and sets up various endpoints:

- **`/housing_data` (GET)**: 
  - **Purpose**: Returns housing predictions based on either the Linear Regression or Decision Tree model for a specified category.
  - **Parameters**: `model_type` (linear or decision_tree), `category` (e.g., mBuy_House).
  - **Example Request**:
    ```http
    GET /housing_data?model_type=linear&category=mBuy_House
    ```
  - **Example Response**:
    ```json
    {
      "data": [
        {"Year": 2019, "value": 2005000.0},
        {"Year": 2020, "value": 2100000.0},
        // ... more data points
      ]
    }
    ```

- **`/population_data` (GET)**:
  - **Purpose**: Retrieves population data for the City of Boroondara and a selected suburb to show growth comparisons.
  - **Parameters**: `suburb` (e.g., Camberwell).
  - **Example Request**:
    ```http
    GET /population_data?suburb=Camberwell
    ```
  - **Example Response**:
    ```json
    {
      "Boroondara": [
        {"Year": 2021, "Population": 169920},
        {"Year": 2026, "Population": 178630},
        // ... more data points
      ],
      "Suburb": [
        {"Year": 2021, "Population": 8500},
        {"Year": 2026, "Population": 8641},
        // ... more data points
      ]
    }
    ```

- **`/custom_prediction` (POST)**:
  - **Purpose**: Provides a custom prediction based on user-defined criteria such as year, property type (house/unit), transaction type (buy/rent), and value type (price/count).
  - **Request Body**: JSON with fields `year`, `property_type`, `transaction_type`, and `value_type`.
  - **Example Request**:
    ```json
    POST /custom_prediction
    {
      "year": 2025,
      "property_type": "house",
      "transaction_type": "buy",
      "value_type": "price"
    }
    ```
  - **Example Response**:
    ```json
    {
      "year": 2025,
      "category": "mBuy_House",
      "linear_prediction": 2795600.0,
      "decision_tree_prediction": 2730000.0
    }
    ```

#### **3. Model Training on Startup**
The `@app.on_event("startup")` decorator in `main.py` triggers the **model training process** each time the FastAPI server starts. This ensures that the models are trained with the latest data and ready for predictions.

## Frontend

The frontend of **House Hustlers** is built with **React** and **Material-UI** to provide a clean and interactive user experience for navigating through housing predictions and population data. The application is structured with components to make data exploration easy, including the ability to customize predictions and view recent listings.

Here’s a breakdown of the main components:

#### **1. Header Component**
The `Header.js` component creates a navigation bar with links to the main sections of the application:
- **Home**: The main dashboard for predictions.
- **Recently Sold**: Displays recently sold listings.
- **About Us**: A section describing the project and team.

#### **2. HomePage Component**
The `HomePage.js` component is the primary interface for users to view housing and population data.

Key features include:
- **Housing Market Predictions**: Users can select categories like `Median House Price` or `Unit Sales Volume` and see predictions based on both Linear Regression and Decision Tree models.
- **Population Comparison**: This section allows users to view population growth in the City of Boroondara alongside specific suburbs, aiding in demographic trend analysis.
- **Custom Predictions**: Users can select options for year, property type (house or unit), transaction type (buy or rent), and value type (price or count) to generate custom predictions, displayed dynamically on the page.

#### **3. RecentlySold Component**
The `RecentlySold.js` component shows a table of recently sold properties, including data on address, property type, bedrooms, bathrooms, sale price, and date sold. 

Features include:
- **Sorting by Date**: Users can sort listings by the date sold, allowing them to see the most recent transactions.
- **Responsive Table**: The table automatically adjusts for different screen sizes, ensuring a user-friendly experience on both desktop and mobile devices.

### **Frontend Setup Instructions**

#### **1. Install Dependencies**
Navigate to the frontend directory and install the necessary dependencies by running:

```bash
npm install
```

#### **2. Run the Frontend**
To start the frontend, use the following command:

```bash
npm start
```

This will launch the frontend at `http://localhost:3000`.

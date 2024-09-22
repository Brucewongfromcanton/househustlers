# Import necessary libraries
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

# Load dataset
data = pd.read_csv('Custom_Data.csv')

# Drop rows with missing values (Optional)
data = data.dropna()

# Split the data into features and targets
# Use Year as the feature for time series predictions
X = data[['Year']]

# Target variables
y_mBuy_House = data['mBuy_House']
y_mBuy_Unit = data['mBuy_Unit']
y_cBuy_House = data['cBuy_House']
y_cBuy_Unit = data['cBuy_Unit']
y_mRent_House = data['mRent_House']
y_mRent_Unit = data['mRent_Unit']
y_cRent_House = data['cRent_House']
y_cRent_Unit = data['cRent_Unit']

# Split the data into training and testing sets
def split_data(X, y):
    return train_test_split(X, y, test_size=0.2, random_state=42)

# Function to train and predict
from sklearn.metrics import mean_absolute_error

def train_predict(X_train, X_test, y_train, y_test, label):
    # Initialize and train the model
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Predict on test data
    y_pred = model.predict(X_test)

    # Predict on the entire historical dataset
    y_all_pred = model.predict(X)

    # Extend the year range up to 2028 for future predictions
    future_years = pd.DataFrame({'Year': range(X['Year'].max() + 1, 2029)})
    
    # Predict for the future years (2024-2028)
    future_predictions = model.predict(future_years)

    # Combine historical and future data for plotting
    all_years = pd.concat([X, future_years], ignore_index=True)
    all_predictions = np.concatenate([y_all_pred, future_predictions])

    # Calculate performance metrics: RMSE and MAE (for test data)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)

    # Print metrics
    print(f"{label} Prediction - RMSE: {rmse}, MAE: {mae}")

    # Visualize actual vs predicted with historical data and future predictions
    plt.figure(figsize=(10, 6))

    # Plot historical data (actual values)
    plt.plot(X['Year'], y_train._append(y_test).sort_index(), color='blue', label='Historical Data')

    # Plot the predicted data (historical and future)
    plt.plot(all_years['Year'], all_predictions, color='red', linestyle='--', label='Predicted Data')

    plt.title(f'{label} Prediction and Historical Trends (Extended to 2028)')
    plt.xlabel('Year')
    plt.ylabel(label)
    plt.legend()
    plt.grid(True)
    plt.show()

    return model





# Predict future prices and volumes for houses and units
X_train, X_test, y_train, y_test = split_data(X, y_mBuy_House)
model_mBuy_House = train_predict(X_train, X_test, y_train, y_test, 'Median House Price')

X_train, X_test, y_train, y_test = split_data(X, y_mBuy_Unit)
model_mBuy_Unit = train_predict(X_train, X_test, y_train, y_test, 'Median Unit Price')

X_train, X_test, y_train, y_test = split_data(X, y_cBuy_House)
model_cBuy_House = train_predict(X_train, X_test, y_train, y_test, 'House Sales Volume')

X_train, X_test, y_train, y_test = split_data(X, y_cBuy_Unit)
model_cBuy_Unit = train_predict(X_train, X_test, y_train, y_test, 'Unit Sales Volume')

X_train, X_test, y_train, y_test = split_data(X, y_mRent_House)
model_mRent_House = train_predict(X_train, X_test, y_train, y_test, 'Median House Rent')

X_train, X_test, y_train, y_test = split_data(X, y_mRent_Unit)
model_mRent_Unit = train_predict(X_train, X_test, y_train, y_test, 'Median Unit Rent')

X_train, X_test, y_train, y_test = split_data(X, y_cRent_House)
model_cRent_House = train_predict(X_train, X_test, y_train, y_test, 'House Rental Volume')

X_train, X_test, y_train, y_test = split_data(X, y_cRent_Unit)
model_cRent_Unit = train_predict(X_train, X_test, y_train, y_test, 'Unit Rental Volume')

# Predict future values based on the trained models
def predict_future(model, year):
    return model.predict([[year]])

# Example of predicting future values for the year 2025
year = 2025
print(f"Predicted median house price in {year}: {predict_future(model_mBuy_House, year)[0]}")
print(f"Predicted median unit price in {year}: {predict_future(model_mBuy_Unit, year)[0]}")
print(f"Predicted house sales volume in {year}: {predict_future(model_cBuy_House, year)[0]}")
print(f"Predicted unit sales volume in {year}: {predict_future(model_cBuy_Unit, year)[0]}")
print(f"Predicted median house rent in {year}: {predict_future(model_mRent_House, year)[0]}")
print(f"Predicted median unit rent in {year}: {predict_future(model_mRent_Unit, year)[0]}")
print(f"Predicted house rental volume in {year}: {predict_future(model_cRent_House, year)[0]}")
print(f"Predicted unit rental volume in {year}: {predict_future(model_cRent_Unit, year)[0]}")

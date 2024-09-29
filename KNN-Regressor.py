# Import necessary libraries
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import matplotlib.pyplot as plt

# ------------------------------ Data Loading -----------------------------------

# Load dataset for house prices and rents (Replace with the correct CSV file path)
data = pd.read_csv('Housing_Data.csv')

# Load the population data (Replace with the correct CSV file path)
pop_data = pd.read_csv('Forecast_Pop_By_Area.csv')

# ------------------------------ Data Processing -----------------------------------

# Limit population data to years up to 2031 for the City of Boroondara
pop_years = [2021, 2026, 2031]  # Only use population data up to 2031
population_boroondara = pop_data.loc[pop_data['Area'] == 'City of Boroondara', ['2021', '2026', '2031']].values[0]

# Use Year as the feature for time series predictions
X = data[['Year']]  # Features: only the Year
y_mBuy_House = data['mBuy_House']
y_mBuy_Unit = data['mBuy_Unit']
y_cBuy_House = data['cBuy_House']
y_cBuy_Unit = data['cBuy_Unit']
y_mRent_House = data['mRent_House']
y_mRent_Unit = data['mRent_Unit']
y_cRent_House = data['cRent_House']
y_cRent_Unit = data['cRent_Unit']

# ------------------------------ Data Splitting Function -----------------------------------

# Split the data into training and testing sets
def split_data(X, y):
    return train_test_split(X, y, test_size=0.2, random_state=42)

# ------------------------------ KNN Regressor Training and Prediction Function -----------------------------------

# Function to train and predict, normalize features, and plot with population growth and additional data
def train_predict_knn(X_train, X_test, y_train, y_test, label):
    # Normalize the features using StandardScaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    X_scaled = scaler.transform(X)

    # Initialize and train the KNN Regressor model
    n_neighbors = min(5, len(X_train_scaled))  # Ensure we do not have more neighbors than samples
    model = KNeighborsRegressor(n_neighbors=n_neighbors)
    model.fit(X_train_scaled, y_train)

    # Predict on test data
    y_pred = model.predict(X_test_scaled)

    # Predict on the entire historical dataset
    y_all_pred = model.predict(X_scaled)

    # Extend the year range up to 2028 for future predictions
    future_years = pd.DataFrame({'Year': range(X['Year'].max() + 1, 2029)})
    future_years_scaled = scaler.transform(future_years)

    # Predict for the future years (from the latest year in the dataset to 2028)
    future_predictions = model.predict(future_years_scaled)

    # Combine historical and future data for plotting
    all_years = pd.concat([X, future_years], ignore_index=True)
    all_predictions = np.concatenate([y_all_pred, future_predictions])

    # Calculate performance metrics: RMSE and MAE
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)

    # Print metrics
    print(f"{label} KNN Prediction - RMSE: {rmse}, MAE: {mae}")

    # ------------------------------ Plotting Results -----------------------------------
    
    # Create a dual-axis plot: House prices, population growth, and additional metrics
    fig, ax1 = plt.subplots(figsize=(10, 6))

    # Plot historical and predicted house prices
    ax1.plot(X['Year'], pd.concat([y_train, y_test]).sort_index(), color='blue', label='Historical Data')
    ax1.plot(all_years['Year'], all_predictions, color='red', linestyle='--', label='Predicted Data')
    ax1.set_xlabel('Year')
    ax1.set_ylabel(label, color='red')
    ax1.tick_params(axis='y', labelcolor='red')
    ax1.legend(loc='upper left')

    # Plot population growth on the secondary y-axis
    ax2 = ax1.twinx()
    ax2.plot(pop_years, population_boroondara, color='green', label='Population Growth (Boroondara)', linestyle='-.')
    ax2.set_ylabel('Population', color='green')
    ax2.tick_params(axis='y', labelcolor='green')

    # Set the title and show the plot
    plt.title(f'{label} Prediction and Additional Data')
    plt.grid(True)
    plt.show()

    return model

# ------------------------------ Run predictions for each target ----------------------------------------------------

# Predict Median House Prices using KNN and visualize population growth
X_train, X_test, y_train, y_test = split_data(X, y_mBuy_House)
train_predict_knn(X_train, X_test, y_train, y_test, 'Median House Price')

# Predict Median Unit Prices using KNN and visualize population growth
X_train, X_test, y_train, y_test = split_data(X, y_mBuy_Unit)
train_predict_knn(X_train, X_test, y_train, y_test, 'Median Unit Price')

# Predict House Sales Volumes using KNN and visualize population growth
X_train, X_test, y_train, y_test = split_data(X, y_cBuy_House)
train_predict_knn(X_train, X_test, y_train, y_test, 'House Sales Volume')

# Predict Unit Sales Volumes using KNN and visualize population growth
X_train, X_test, y_train, y_test = split_data(X, y_cBuy_Unit)
train_predict_knn(X_train, X_test, y_train, y_test, 'Unit Sales Volume')

# Predict Median House Rents using KNN and visualize population growth
X_train, X_test, y_train, y_test = split_data(X, y_mRent_House)
train_predict_knn(X_train, X_test, y_train, y_test, 'Median House Rent')

# Predict Median Unit Rents using KNN and visualize population growth
X_train, X_test, y_train, y_test = split_data(X, y_mRent_Unit)
train_predict_knn(X_train, X_test, y_train, y_test, 'Median Unit Rent')

# Predict House Rental Volumes using KNN and visualize population growth
X_train, X_test, y_train, y_test = split_data(X, y_cRent_House)
train_predict_knn(X_train, X_test, y_train, y_test, 'House Rental Volume')

# Predict Unit Rental Volumes using KNN and visualize population growth
X_train, X_test, y_train, y_test = split_data(X, y_cRent_Unit)
train_predict_knn(X_train, X_test, y_train, y_test, 'Unit Rental Volume')

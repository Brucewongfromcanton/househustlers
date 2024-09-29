# Import necessary libraries
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt

# ------------------------------ Data Loading -----------------------------------

# Load dataset for house prices and rents (Replace with the correct CSV file path)
data = pd.read_csv('Housing_Data.csv')

# ------------------------------ Data Processing -----------------------------------

# Function to categorize prices/volumes into bins (Low, Medium, High)
def categorize_data(target, bins, labels):
    return pd.cut(target, bins=bins, labels=labels)

# ------------------------------ Data Splitting Function -----------------------------------

# Split the data into training and testing sets
def split_data(X, y):
    return train_test_split(X, y, test_size=0.2, random_state=42)

# ------------------------------ Random Forest Classifier Training and Prediction Function -----------------------------------

# Function to train and predict with Random Forest Classifier
def train_predict_random_forest(X_train, X_test, y_train, y_test, label):
    # Normalize the features using StandardScaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Initialize and train the Random Forest Classifier model
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train_scaled, y_train)

    # Predict on test data
    y_pred = model.predict(X_test_scaled)

    # Evaluate the performance
    accuracy = accuracy_score(y_test, y_pred)
    print(f"{label} Random Forest Classifier - Accuracy: {accuracy}")
    
    # Classification report
    print(f"Classification Report for {label}:\n", classification_report(y_test, y_pred))
    
    # Define all known labels (even if they don't appear in y_test or y_pred)
    all_labels = ['Low', 'Medium', 'High']

    # Compute the confusion matrix with all labels
    cm = confusion_matrix(y_test, y_pred, labels=all_labels)
    print(f"Confusion Matrix for {label}:\n", cm)

    # Plot Confusion Matrix
    plt.figure(figsize=(6, 4))
    plt.imshow(cm, cmap=plt.cm.Blues)
    plt.title(f'Confusion Matrix for {label}')
    plt.colorbar()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')
    plt.xticks(ticks=[0, 1, 2], labels=all_labels)
    plt.yticks(ticks=[0, 1, 2], labels=all_labels)
    plt.show()

    return model

# ------------------------------ Run Random Forest Classifier for Multiple Datasets ----------------------------------------------------
# Define the bins for different datasets
bins_house_prices = [0, 800000, 1500000, np.inf]
bins_unit_prices = [0, 500000, 1000000, np.inf]
bins_rent_prices = [0, 400, 1000, np.inf]
bins_sales_volumes = [0, 100, 500, np.inf]
bins_rental_volumes = [0, 50, 200, np.inf]

# Define the labels for all datasets
labels = ['Low', 'Medium', 'High']

# Use Year as the feature for time series predictions
X = data[['Year']]  # Features: only the Year 

# ------------------------------ 1. Median House Prices -----------------------------------
y_mBuy_House = data['mBuy_House']
y_mBuy_House_binned = categorize_data(y_mBuy_House, bins_house_prices, labels)
X_train, X_test, y_train, y_test = split_data(X, y_mBuy_House_binned)
train_predict_random_forest(X_train, X_test, y_train, y_test, 'Median House Price Categories')

# ------------------------------ 2. Median Unit Prices -----------------------------------
y_mBuy_Unit = data['mBuy_Unit']
y_mBuy_Unit_binned = categorize_data(y_mBuy_Unit, bins_unit_prices, labels)
X_train, X_test, y_train, y_test = split_data(X, y_mBuy_Unit_binned)
train_predict_random_forest(X_train, X_test, y_train, y_test, 'Median Unit Price Categories')

# ------------------------------ 3. House Sales Volumes -----------------------------------
y_cBuy_House = data['cBuy_House']
y_cBuy_House_binned = categorize_data(y_cBuy_House, bins_sales_volumes, labels)
X_train, X_test, y_train, y_test = split_data(X, y_cBuy_House_binned)
train_predict_random_forest(X_train, X_test, y_train, y_test, 'House Sales Volume Categories')

# ------------------------------ 4. Unit Sales Volumes -----------------------------------
y_cBuy_Unit = data['cBuy_Unit']
y_cBuy_Unit_binned = categorize_data(y_cBuy_Unit, bins_sales_volumes, labels)
X_train, X_test, y_train, y_test = split_data(X, y_cBuy_Unit_binned)
train_predict_random_forest(X_train, X_test, y_train, y_test, 'Unit Sales Volume Categories')

# ------------------------------ 5. Median House Rents -----------------------------------
y_mRent_House = data['mRent_House']
y_mRent_House_binned = categorize_data(y_mRent_House, bins_rent_prices, labels)
X_train, X_test, y_train, y_test = split_data(X, y_mRent_House_binned)
train_predict_random_forest(X_train, X_test, y_train, y_test, 'Median House Rent Categories')

# ------------------------------ 6. Median Unit Rents -----------------------------------
y_mRent_Unit = data['mRent_Unit']
y_mRent_Unit_binned = categorize_data(y_mRent_Unit, bins_rent_prices, labels)
X_train, X_test, y_train, y_test = split_data(X, y_mRent_Unit_binned)
train_predict_random_forest(X_train, X_test, y_train, y_test, 'Median Unit Rent Categories')

# ------------------------------ 7. House Rental Volumes -----------------------------------
y_cRent_House = data['cRent_House']
y_cRent_House_binned = categorize_data(y_cRent_House, bins_rental_volumes, labels)
X_train, X_test, y_train, y_test = split_data(X, y_cRent_House_binned)
train_predict_random_forest(X_train, X_test, y_train, y_test, 'House Rental Volume Categories')

# ------------------------------ 8. Unit Rental Volumes -----------------------------------
y_cRent_Unit = data['cRent_Unit']
y_cRent_Unit_binned = categorize_data(y_cRent_Unit, bins_rental_volumes, labels)
X_train, X_test, y_train, y_test = split_data(X, y_cRent_Unit_binned)
train_predict_random_forest(X_train, X_test, y_train, y_test, 'Unit Rental Volume Categories')

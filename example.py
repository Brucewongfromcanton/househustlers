import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt
import numpy as np

# Load the dataset
df = pd.read_csv('madeup_data.csv')

# Step 1: Data Preprocessing
X = df[['Feature1', 'Feature2', 'Feature3']]
y = df['Target']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Step 2: Train the Linear Regression Model
model = LinearRegression()
model.fit(X_train_scaled, y_train)

# Model Evaluation
y_pred = model.predict(X_test_scaled)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error: {mse}")
print(f"R-squared: {r2}")

# Step 3: Visualization

# Actual vs Predicted Values
plt.figure(figsize=(8, 6))
plt.scatter(y_test, y_pred, color='blue', edgecolors='k')
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], color='red', lw=2)
plt.xlabel('Actual')
plt.ylabel('Predicted')
plt.title('Actual vs Predicted Values')
plt.show()

# Step 4: Visualizing the Regression Model on Feature1

# We'll plot the relationship between Feature1 and the Target using the Linear Regression model
# To do this, we'll create a line representing the model's prediction on Feature1 while keeping other features constant.

# Select a single feature for visualization (Feature1)
X_feature1 = X_test[['Feature1']]

# Since we have multiple features, to visualize the regression line on Feature1, we'll need to vary Feature1
# and hold other features constant.
X_test_constant = X_test_scaled.copy()
X_test_constant[:, 1:] = 0  # Set Feature2 and Feature3 to 0 to visualize the effect of Feature1

# Predict values based only on Feature1
y_pred_feature1 = model.predict(X_test_constant)

plt.figure(figsize=(8, 6))
plt.scatter(X_test['Feature1'], y_test, color='blue', label='Actual')
plt.plot(X_test['Feature1'], y_pred_feature1, color='red', label='Regression Line')
plt.xlabel('Feature1')
plt.ylabel('Target')
plt.title('Linear Regression Model - Feature1 vs Target')
plt.legend()
plt.show()

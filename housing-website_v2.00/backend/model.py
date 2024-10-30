# model_with_decision_tree.py

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.preprocessing import StandardScaler
import joblib

class CombinedModel:
    def __init__(self, data_path='./backend/Housing_Data.csv', pop_data_path='./backend/Forecast_Pop_By_Area.csv'):
        # Load housing and population data
        self.housing_data = pd.read_csv(data_path)
        self.population_data = pd.read_csv(pop_data_path)

        # Initialize storage for models
        self.linear_models = {}
        self.decision_tree_models = {}

    def train_models(self):
        targets = [
            'mBuy_House', 'mBuy_Unit', 'mRent_House', 'mRent_Unit',
            'cBuy_House', 'cBuy_Unit', 'cRent_House', 'cRent_Unit'
        ]

        for target in targets:
            X = self.housing_data[['Year']]
            y = self.housing_data[target]

            # Train Linear Regression model
            linear_model = LinearRegression()
            linear_model.fit(X, y)
            self.linear_models[target] = linear_model

            # Train Decision Tree Regressor model with scaled input
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            decision_tree_model = DecisionTreeRegressor(random_state=42)
            decision_tree_model.fit(X_scaled, y)
            self.decision_tree_models[target] = (decision_tree_model, scaler)

        # Save trained models
        joblib.dump(self.linear_models, 'linear_models.pkl')
        joblib.dump(self.decision_tree_models, 'decision_tree_models.pkl')

    def get_predictions(self, model_type, target):
        # Load the appropriate models
        if model_type == 'linear':
            models = joblib.load('linear_models.pkl')
        elif model_type == 'decision_tree':
            models = joblib.load('decision_tree_models.pkl')

        model_info = models[target]
        X = self.housing_data[['Year']].copy()  # Historical years

        # Use the appropriate model and scaler
        if model_type == 'decision_tree':
            model, scaler = model_info
            X_scaled = scaler.transform(X)
        else:
            model = model_info
            X_scaled = X  # No scaling needed for Linear Regression

        # Use real historical data and predict only for future years
        historical_data = self.housing_data[['Year', target]].rename(columns={target: 'value'})

        # Prepare future years (2025-2028)
        max_year = X['Year'].max()
        future_years = pd.DataFrame({'Year': range(max_year + 1, 2029)})

        if model_type == 'decision_tree':
            future_years_scaled = scaler.transform(future_years)
            future_predictions = model.predict(future_years_scaled)
        else:
            future_predictions = model.predict(future_years)

        # Combine historical data with future predictions
        future_data = pd.DataFrame({
            'Year': future_years['Year'],
            'value': future_predictions
        })
        combined_data = pd.concat([historical_data, future_data], ignore_index=True)

        # Return the combined data
        return combined_data.to_dict(orient='records')

    def get_population_data(self, suburb):
        # Get population data for City of Boroondara and the selected suburb
        boroondara_data = self.format_population_data('City of Boroondara')

        if suburb not in self.population_data['Area'].values:
            return {"Boroondara": boroondara_data, "Suburb": []}

        suburb_data = self.format_population_data(suburb)
        return {"Boroondara": boroondara_data, "Suburb": suburb_data}

    def format_population_data(self, area):
        # Extract and format population data for a given area
        data = self.population_data[self.population_data['Area'] == area]

        if data.empty:
            return []

        return [
            {"Year": int(year), "Population": int(data[year].values[0])}
            for year in ['2021', '2026', '2031', '2036', '2041', '2046']
        ]

if __name__ == "__main__":
    # Initialize and train the models
    model = CombinedModel()
    model.train_models()

    # Example usage: Get predictions from both models for 'mBuy_House'
    print("Linear Model Predictions for 'mBuy_House':")
    print(model.get_predictions('linear', 'mBuy_House'))

    print("Decision Tree Predictions for 'mBuy_House':")
    print(model.get_predictions('decision_tree', 'mBuy_House'))

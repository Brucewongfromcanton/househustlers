# model_with_decision_tree.py

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.preprocessing import StandardScaler
import joblib

# model.py

class CombinedModel:
    def __init__(self, data_path='./backend/Housing_Data.csv', pop_data_path='./backend/Forecast_Pop_By_Area.csv'):
        self.housing_data = pd.read_csv(data_path)
        self.population_data = pd.read_csv(pop_data_path)
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

            linear_model = LinearRegression()
            linear_model.fit(X, y)
            self.linear_models[target] = linear_model

            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            decision_tree_model = DecisionTreeRegressor(random_state=42)
            decision_tree_model.fit(X_scaled, y)
            self.decision_tree_models[target] = (decision_tree_model, scaler)

        joblib.dump(self.linear_models, 'linear_models.pkl')
        joblib.dump(self.decision_tree_models, 'decision_tree_models.pkl')

    def get_predictions(self, model_type, target):
        models = joblib.load(f'{model_type}_models.pkl')
        model_info = models[target]
        X = self.housing_data[['Year']].copy()
        
        if model_type == 'decision_tree':
            model, scaler = model_info
            X_scaled = scaler.transform(X)
        else:
            model = model_info
            X_scaled = X
        
        historical_data = self.housing_data[['Year', target]].rename(columns={target: 'value'})
        max_year = X['Year'].max()
        future_years = pd.DataFrame({'Year': range(max_year + 1, 2029)})
        
        if model_type == 'decision_tree':
            future_years_scaled = scaler.transform(future_years)
            future_predictions = model.predict(future_years_scaled)
        else:
            future_predictions = model.predict(future_years)

        future_data = pd.DataFrame({'Year': future_years['Year'], 'value': future_predictions})
        return pd.concat([historical_data, future_data], ignore_index=True).to_dict(orient='records')

    def get_custom_prediction(self, model_type, category, year):
        models = joblib.load(f"{model_type}_models.pkl")
        model_info = models.get(category)
        if not model_info:
            raise ValueError(f"Model for category '{category}' not found")

        year_df = pd.DataFrame([[year]], columns=["Year"])
        
        if model_type == "decision_tree":
            model, scaler = model_info
            year_df = scaler.transform(year_df)
        else:
            model = model_info

        return model.predict(year_df)[0]

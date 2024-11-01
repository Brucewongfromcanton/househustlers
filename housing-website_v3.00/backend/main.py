from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import CombinedModel  # Import from model.py
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the CombinedModel globally
model = CombinedModel()

listings_df = pd.read_csv('Listings.csv')

@app.on_event("startup")
async def on_startup():
    print("Training models...")
    model.train_models()
    print("Models trained and ready.")

# Route to get housing predictions (Linear or Decision Tree)
@app.get("/housing_data")
async def get_housing_data(model_type: str, category: str):
    if model_type not in ["linear", "decision_tree"]:
        raise HTTPException(status_code=400, detail="Invalid model type. Use 'linear' or 'decision_tree'.")
    try:
        predictions = model.get_predictions(model_type, category)
        return {"data": predictions}
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Category '{category}' not found.")

# Route to get population data for City of Boroondara and the selected suburb
@app.get("/population_data")
async def get_population_data(suburb: str):
    try:
        population_data = model.get_population_data(suburb)
        return population_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving population data: {str(e)}")

@app.get("/api/recently_sold_listings")
async def get_recently_sold_listings():
    try:
        # Fill NaN values in the DataFrame
        listings_data = listings_df.fillna("").to_dict(orient="records")
        return listings_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving listings data: {str(e)}")
    
# Custom prediction request model
class CustomPredictionRequest(BaseModel):
    year: int
    property_type: str  # "house" or "unit"
    transaction_type: str  # "buy" or "rent"
    value_type: str  # "price" or "count"

# Custom prediction endpoint
@app.post("/custom_prediction")
async def custom_prediction(request: CustomPredictionRequest):
    try:
        property_type = request.property_type.lower()
        transaction_type = request.transaction_type.lower()
        value_type = request.value_type.lower()

        category_map = {
            ("house", "buy", "price"): "mBuy_House",
            ("house", "buy", "count"): "cBuy_House",
            ("house", "rent", "price"): "mRent_House",
            ("house", "rent", "count"): "cRent_House",
            ("unit", "buy", "price"): "mBuy_Unit",
            ("unit", "buy", "count"): "cBuy_Unit",
            ("unit", "rent", "price"): "mRent_Unit",
            ("unit", "rent", "count"): "cRent_Unit",
        }

        category = category_map.get((property_type, transaction_type, value_type))
        
        if not category:
            raise HTTPException(status_code=400, detail="Invalid input combination for prediction")

        linear_prediction = model.get_custom_prediction("linear", category, request.year)
        decision_tree_prediction = model.get_custom_prediction("decision_tree", category, request.year)

        return {
            "year": request.year,
            "category": category,
            "linear_prediction": linear_prediction,
            "decision_tree_prediction": decision_tree_prediction
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating prediction: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

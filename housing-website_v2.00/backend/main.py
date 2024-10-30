# main.py

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from model import CombinedModel  # Import from model.py

# Initialize the FastAPI app with lifespan handler
app = FastAPI()

# Enable CORS to allow frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the CombinedModel globally
model = CombinedModel()

# Lifespan event to train models on startup
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

# Main entry point to run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

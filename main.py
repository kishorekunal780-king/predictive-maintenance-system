from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
from pydantic import BaseModel
import pandas as pd
from sqlalchemy import create_engine, text

#1. initialize the FastApi application instance
app = FastAPI(title="Predictive Maintenance API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
DB_USER = "root"
DB_PASSWORD = "Kunal2004"
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "maintenance_db1"

db_url = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(db_url, pool_pre_ping=True)

#2. define a goal variable to hold our trained model
model=None

# define the input data schema matching our 8 features 
class TelemetryInput(BaseModel):
    air_temperature:float
    process_temperature:float
    rotational_speed:float
    torque:float
    tool_wear:float
    machine_power:float
    temp_diff:float
    overstrain:float
        
#3. create a startup event that loads the trained model from disk 
@app.on_event("startup")
def load_model():
    global model
    try:
        model =joblib.load('random_forest_model.joblib')
        print("Machine learning model has been loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
        
# 4. create a simple health-check root endpoint
@app.get("/")
def read_root():
    return{
        "STATUS":"ONLINE",
        "Message": "Predictive Maintenance API gateway is running smoothly"
    }

# GET endpoint to retrieve list of all machines
@app.get("/api/machines")
def get_machines():
    try:
        query = text("SELECT product_id, type FROM machines")
        df = pd.read_sql(query, con=engine)
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# GET endpoint to retrieve telemetry logs for a specific machine ID
@app.get("/api/telemetry/{id}")
def get_telemetry(id: str):
    try:
        query = text("""
        SELECT 
            t.log_id,
            t.product_id,
            t.udi,
            t.air_temperature,
            t.process_temperature,
            t.rotational_speed,
            t.torque,
            t.tool_wear,
            t.temp_diff,
            t.machine_power,
            t.overstrain,
            COALESCE(f.machine_failure, 0) as machine_failure,
            COALESCE(f.twf, 0) as twf,
            COALESCE(f.hdf, 0) as hdf,
            COALESCE(f.pwf, 0) as pwf,
            COALESCE(f.osf, 0) as osf,
            COALESCE(f.rnf, 0) as rnf,
            COALESCE(f.failure_type, 0) as failure_type
        FROM telemetry_logs t
        LEFT JOIN failure_records f 
            ON f.product_id = t.product_id AND t.log_id = f.prediction_id
        WHERE t.product_id = :product_id
        ORDER BY t.log_id ASC
        """)
        df = pd.read_sql(query, con=engine, params={"product_id": id})
        if df.empty:
            raise HTTPException(status_code=404, detail=f"No telemetry data found for machine ID: {id}")
        return df.to_dict(orient="records")
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# GET endpoint to retrieve critical assets and a sample of stable assets
@app.get("/api/alerts")
def get_alerts():
    try:
        # Get the latest telemetry log for each machine
        query = text("""
        SELECT t.product_id, t.air_temperature, t.process_temperature, t.rotational_speed, t.torque, t.tool_wear, t.temp_diff, t.machine_power, t.overstrain
        FROM telemetry_logs t
        INNER JOIN (
            SELECT product_id, MAX(log_id) as max_log_id
            FROM telemetry_logs
            GROUP BY product_id
        ) tm ON t.product_id = tm.product_id AND t.log_id = tm.max_log_id
        """)
        df = pd.read_sql(query, con=engine)
        if df.empty:
            return {"critical": [], "stable": []}
        
        # Predict using the loaded model
        features = ['air_temperature', 'process_temperature', 'rotational_speed', 'torque', 'tool_wear', 'machine_power', 'temp_diff', 'overstrain']
        df_features = df[features]
        
        # Get probabilities
        probs = model.predict_proba(df_features)[:, 1]
        df['probability'] = probs
        
        # Filter critical and stable
        critical_df = df[df['probability'] > 0.7]
        stable_df = df[df['probability'] <= 0.7].sample(n=min(12, len(df[df['probability'] <= 0.7])), random_state=42)
        
        return {
            "critical": critical_df[['product_id', 'probability']].to_dict(orient="records"),
            "stable": stable_df[['product_id', 'probability']].to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database or prediction error: {str(e)}")

# the prediction post endpoint
@app.post("/api/predict")
def predict_maintenance(data: TelemetryInput):
    #Convert input data into dictionary and then a pandas dataframe for consistency
    input_dict = data.dict()
    input_df = pd.DataFrame([input_dict])

    # perform the prediction
    prediction = int(model.predict(input_df)[0])

    # generate probability score for failure
    probability = float(model.predict_proba(input_df)[0][1])
    
    return {
        "machine_failure_prediction": prediction,
        "failure_probability": round(probability,4)
    }

    
    

    
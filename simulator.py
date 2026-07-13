import time
import random
from sqlalchemy import create_engine, text
from datetime import datetime

# Database connection
DB_USER = "root"
DB_PASSWORD = "Kunal2004"
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "maintenance_db1"

db_url = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(db_url)

def simulate_asset_wear():
    """
    Simulates real-time tool wear by incrementing tool_wear 
    and updating telemetry for a random subset of machines.
    """
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Simulation started. Updating asset telemetry...")
    
    try:
        with engine.connect() as conn:
            # 1. Get a list of some active machines
            result = conn.execute(text("SELECT product_id FROM machines LIMIT 100"))
            machines = [row[0] for row in result]
            
            # 2. Update a random sample of these machines
            sample_size = 10
            target_machines = random.sample(machines, sample_size)
            
            for machine_id in target_machines:
                # Simulate incremental tool wear (between 1 and 5 minutes)
                wear_increment = random.randint(1, 5)
                
                # We update the latest log for this machine to simulate "live" current state
                # In a real system, we would insert a NEW log entry.
                # For this demo, we update the most recent log to see the UI change.
                update_query = text("""
                    UPDATE telemetry_logs 
                    SET tool_wear = tool_wear + :inc,
                        process_temperature = process_temperature + :temp_var
                    WHERE product_id = :pid 
                    ORDER BY log_id DESC LIMIT 1
                """)
                
                conn.execute(update_query, {
                    "inc": wear_increment, 
                    "temp_var": random.uniform(-0.5, 0.5),
                    "pid": machine_id
                })
            
            conn.commit()
            print(f"Successfully updated {sample_size} assets.")
            
    except Exception as e:
        print(f"Simulation Error: {e}")

if __name__ == "__main__":
    print("🚀 Starting Predictive Maintenance Live Simulator")
    print("Press Ctrl+C to stop
")
    try:
        while True:
            simulate_asset_wear()
            time.sleep(5) # Update every 5 seconds as per roadmap
    except KeyboardInterrupt:
        print("
Simulation stopped by user.")

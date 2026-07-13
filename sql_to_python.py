
import pandas as pd
from sqlalchemy import create_engine
import matplotlib.pyplot as plt 
import seaborn as sns 

user = "root"
password = "Kunal2004"
host = "localhost"
port = "3306"
database = "maintenance_db1"

engine= create_engine(f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}')

query="""select
t.air_temperature,
t.process_temperature,
t.rotational_speed,
t.torque,
t.tool_wear,
t.machine_power,
t.temp_diff,
t.overstrain,
f.machine_failure
from telemetry_logs t 
join failure_records f on f.product_id=t.product_id and t.log_id=f.prediction_id;"""

# load data into pandas data frame 
try:
    df=pd.read_sql(query,con=engine)
    print("Data loading completed successfully")
    print(f"dataset shape: {df.shape}")

    #check class distribution of target variable
    print("\n target variable distribution(machine failure):")
    print(df['machine_failure'].value_counts())

except Exception as e:
    print(f"Error executing the query: {e}")

# generating  feature to feature and feature to target corelation matrix that helps me understand the 
# feature importance and how it is related to the target variable and how the features are related to each other.

# 1. pairwise correlation matrix of all columns
correlation_matrix= df.corr()

# 2. steup matplot figure layout
plt.figure(figsize=(10,8))

#3. geerate a clean heatmap using seaborn
sns.heatmap(
    correlation_matrix,
    annot=True,
    cmap='coolwarm',
    fmt=".2f",
    linewidths=0.5,
)

# 4. display the correlation matrix plot
plt.title("telemetry feature correlation to machine failure")
plt.tight_layout()
plt.show()

df.to_csv("telemetry_machine_failure.csv", index=False)
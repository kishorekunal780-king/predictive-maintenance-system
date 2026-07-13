# pyrefly: ignore [missing-import]
from sqlalchemy import create_engine
import pandas as pd
data= pd.read_csv('ai4i2020_cleaned.csv')
#Credentials
username= "root"
passowrd="Kunal2004"
host= "127.0.0.1"
port="3306"
database ="maintenance_db1"

#connection engine string 
connection_string=f'mysql+mysqlconnector://{username}:{passowrd}@{host}:{port}/{database}'
engine=create_engine(connection_string)

# push the cleaned csv file
data.to_sql('machine_data', con=engine, if_exists='replace',index=False)

print("data transfer completed")
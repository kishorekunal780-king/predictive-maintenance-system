from logging import error
import pandas as pd

data= pd.read_csv('ai4i2020.csv');

#machine id's for tracking("which machine").
machine_indentifiers= data['Product ID']
print(machine_indentifiers);

#feature engineering
data["Temp_Diff"]= data["Process temperature [K]"] - data["Air temperature [K]"]
data["Power"]= data["Rotational speed [rpm]"]* data["Torque [Nm]"]
data["Overstrain"]= data["Tool wear [min]"]* data["Torque [Nm]"]

data.info();

data= data.drop( columns=['Failure_type','Failure_Type'], errors='ignore')

# muti class target column("will it fail and why").
data['Failure_Type']=0
data.loc[data["TWF"]==1,"Failure_Type"]=1
data.loc[data["HDF"]==1,"Failure_Type"]==2
data.loc[data["PWF"]==1,"Failure_Type"]==3
data.loc[data["OSF"]==1,"Failure_Type"]=4
data.loc[data["RNF"]==1,"Failure_Type"]=5
y=data["Failure_Type"]

#select your input features
features=['Type', 'Air temperature [K]', 
'Process temperature [K]', 'Torque [Nm]', 
'Tool wear [min]', 'Power', 'Temp_Diff', 
'Overstrain','Rotational speed [rpm]']
x=data[features]
x=pd.get_dummies(x, columns=['Type'], drop_first=True)

#select multi-class target
y=data["Failure_Type"]

data.to_csv('ai4i2020_cleaned.csv',index=False);
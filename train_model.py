import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix,classification_report,accuracy_score
from imblearn.over_sampling import SMOTE
import joblib


#1. loading cleaned dataset(telemetry_machine_failure.csv
df=pd.read_csv("telemetry_machine_failure.csv")

#2. speperate into features(x) and target(y)
# we drop machine_failure from x because it's not what we want to predict
X= df.drop(columns=["machine_failure"])
Y= df["machine_failure"]

# 3. create a stratified 80-20 Train-test split
X_train, X_test, y_train, y_test=train_test_split(
    X,Y,
    test_size=0.2,
    random_state=42,
    stratify=Y #ensures both train and test set has same proportion of 0s and 1s
)
print(f"shape of training data: {X_train.shape}")
print(f"shape of testing data: {X_test.shape}")
print(f"\n training class balance:\n {y_train.value_counts()}")

# 4. apply SMOTE to balance the training data only
#this avoids data lekage into out test set
smote = SMOTE(random_state=42)
x_train_resampled,y_train_resampled=smote.fit_resample(X_train,y_train)

print(f"---class balance check---")
print(f"original training failures: {y_train.sum()} out of {len(y_train)}")
print(f"SMOTE Balanced Training Failure: {y_train_resampled.sum()} out of {len(y_train_resampled)}")

#5. Initialize RandomForestClassifier
print("\n training random forest classifier...")
model= RandomForestClassifier(n_estimators=200,random_state=42)
model.fit(x_train_resampled,y_train_resampled)

#6. evaluate the model using the untouched test data
y_pred = model.predict(X_test)

print("\n MODEL PERFORMANCE ON UNTOUCHED TEST DATA")
print("confusion matrix:") 
print(confusion_matrix(y_test,y_pred))

print("\n Classification report")
print(classification_report(y_test,y_pred))

#save the trained model to disk
joblib.dump(model,'random_forest_model.joblib')
print("\n The trained model is saved as 'random_forest_model.joblib'.")




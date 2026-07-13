# Predictive Maintenance System

A production-ready end-to-end Predictive Maintenance System that monitors industrial machinery, predicts failure probabilities in real-time, and visualizes fleet health. The system utilizes a Random Forest classifier trained on telemetry data, balanced with SMOTE, to flag critical assets before failures occur.

---

## 🚀 Features
- **Real-Time Failure Prediction**: Machine learning endpoint that returns failure likelihood and predictions based on 8 key telemetry features.
- **Interactive Fleet Dashboard**: Visualizes overall machine health status (Critical vs. Stable) and failure probabilities.
- **Detailed Machine Telemetry & Analytics**: Interactive charts showing trends in temperature, torque, rotational speed, and tool wear.
- **Automated Live Simulator**: A background process that simulates real-world tool wear and temperature fluctuations to demonstrate dynamic dashboard updates.
- **Database-Backed Architecture**: Robust relational schema linking machines, historical telemetry logs, and failure records.

---

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts
- **Backend**: FastAPI, SQLAlchemy, Uvicorn, Pydantic
- **Machine Learning**: Scikit-Learn, imbalanced-learn (SMOTE), Joblib, Pandas, NumPy
- **Database**: MySQL

---

## 📁 Project Structure
```text
├── frontend/                     # React + TypeScript + Vite Frontend application
│   ├── src/
│   │   ├── api/                  # API client services
│   │   ├── assets/               # Static assets & icons
│   │   ├── components/           # Reusable UI components (AppShell, ErrorBoundary, charts)
│   │   ├── pages/                # Page layouts (MachineFleet, MachineDetail, AlertsDashboard)
│   │   ├── App.jsx               # Main React entrypoint
│   │   └── main.tsx              # Vite main mount point
│   ├── package.json              # Frontend npm package settings
│   └── vite.config.ts            # Vite build configuration
├── data_cleaning.py              # Script to clean raw dataset and engineer features
├── python_to_sql.py              # Database seeder (pushes cleaned CSV data to MySQL)
├── sql_to_python.py              # Export database logs to CSV for ML model training
├── train_model.py                # Script to train RandomForestClassifier using SMOTE
├── main.py                       # FastAPI application serving ML predictions and database queries
├── simulator.py                  # Live simulator that updates machine telemetry in real-time
├── telemetry_machine_failure.csv # Dataset used for training/validation
├── ai4i2020_cleaned.csv          # Cleaned reference dataset
├── requirements.txt              # Backend Python dependencies
└── .gitignore                    # Standard Git ignore configurations
```

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- MySQL Server

### 1. Database Configuration
1. Create a MySQL database named `maintenance_db1`:
   ```sql
   CREATE DATABASE maintenance_db1;
   ```
2. Set your MySQL username and password in the database connection strings in:
   - `main.py`
   - `simulator.py`
   - `python_to_sql.py`
   - `sql_to_python.py`
   
   *(Note: For production, please use environment variables or a configuration manager).*

3. Run the database seeder to populate default telemetry logs:
   ```bash
   python python_to_sql.py
   ```

### 2. Backend Setup
1. Create a virtual environment and activate it:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```

---

## ⚙️ Running the Application

### 1. Start the Backend API
From the root directory:
```bash
uvicorn main:app --reload --port 8000
```
The interactive Swagger API documentation will be available at `http://127.0.0.1:8000/docs`.

### 2. Start the Live Telemetry Simulator
In a separate terminal window, start the simulator to feed mock wear/telemetry data into the database:
```bash
python simulator.py
```

### 3. Start the Frontend
In a separate terminal window:
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧠 Model Training

If you wish to retrain the random forest classifier:
1. Export clean data from your database (or use the preloaded `telemetry_machine_failure.csv`):
   ```bash
   python sql_to_python.py
   ```
2. Run the training script:
   ```bash
   python train_model.py
   ```
This will apply SMOTE to balance the training split and output a newly trained classifier model binary: `random_forest_model.joblib`.

---

## 📸 Screenshots
*(Add high-quality application screenshots here before sharing with recruiters)*
- **Dashboard Overview**: ![Dashboard Screenshot Placeholder](https://via.placeholder.com/800x450.png?text=Dashboard+Overview)
- **Machine Details & Analytics**: ![Analytics Screenshot Placeholder](https://via.placeholder.com/800x450.png?text=Machine+Details+%26+Telemetry)

---

## ☁️ Deployment Instructions

### Backend (FastAPI)
- Package the backend using the provided dependencies in `requirements.txt`.
- Set up a production WSGI/ASGI server using `gunicorn` with `uvicorn` workers.
- Run database migrations using tools like `Alembic` for production-grade schema updates.
- Secure environment secrets using system environment variables or HashiCorp Vault instead of hardcoded strings.

### Frontend (React)
- Build the optimized production assets:
  ```bash
  cd frontend
  npm run build
  ```
- Deploy the resulting `/dist` folder to static web hosts (Vercel, Netlify, AWS S3, or Cloudflare Pages).

---

## 🔮 Future Improvements
1. **Dockerization**: Containerize both backend and frontend applications using Docker and Docker Compose for seamless environment replication.
2. **Authentication & RBAC**: Implement OAuth2/JWT token-based security for REST API endpoints and define Role-Based Access Controls.
3. **Advanced Time-Series Modeling**: Integrate LSTM (Long Short-Term Memory) or Transformer-based networks to capture temporal patterns more effectively.
4. **Enhanced Data Pipeline**: Transition from manual seed scripts to Apache Airflow or Prefect for scheduled ETL data flows.

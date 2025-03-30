import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from google.colab import files
import io
import joblib

# Function to load dataset
def load_data():
    """Uploads a file to Google Colab and reads it into a pandas DataFrame."""
    print("Upload the seat_booking_data.csv dataset:")
    uploaded = files.upload()
    filename = list(uploaded.keys())[0]  # Get the uploaded file name
    return pd.read_csv(io.BytesIO(uploaded[filename]))

# Upload dataset
df = load_data()

# Display first few rows
display(df.head())

# Features and target variable
X = df[['user_id', 'seat_number', 'time_of_booking', 'day_of_week', 'is_holiday']]
y = df['was_booked']

# Split the dataset into training (80%) and testing (20%)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the RandomForest model with cross-validation
model = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42)
cross_val_scores = cross_val_score(model, X_train, y_train, cv=5)
print(f'Cross-validation accuracy scores: {cross_val_scores}')

model.fit(X_train, y_train)

# Predict on the test set
y_pred = model.predict(X_test)

# Evaluate model performance
accuracy = accuracy_score(y_test, y_pred)
print(f'Model Accuracy: {accuracy:.2f}')
print("Classification Report:\n", classification_report(y_test, y_pred))

# Save the model
joblib.dump(model, 'seat_booking_model.pkl')
print("Model saved as seat_booking_model.pkl")

# Function to predict seat booking
def predict_seat_booking(user_id, seat_number, time_of_booking, day_of_week, is_holiday):
    """Predicts if a seat will be booked based on user input."""
    input_data = np.array([[user_id, seat_number, time_of_booking, day_of_week, is_holiday]])
    prediction = model.predict(input_data)
    return 'Booked' if prediction[0] == 1 else 'Available'

# Example Prediction
user_input = [10, 25, 14, 3, 0]  # Example values
print(f'Prediction for input {user_input}: {predict_seat_booking(*user_input)}')
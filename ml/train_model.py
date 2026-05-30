import pandas as pd

from sklearn.model_selection import train_test_split

from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import accuracy_score

import joblib


# Load dataset
df = pd.read_csv("training.csv")


# Features
X = df[
    [
        "faceMatch",
        "panMatched",
        "livenessPassed",
        "ocrConfidence"
    ]
]


# Target
y = df["fraud"]


# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Train model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(
    X_train,
    y_train
)


# Test model
predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)


# Save model
joblib.dump(
    model,
    "fraud_model.pkl"
)

print(
    "Model saved as fraud_model.pkl"
)
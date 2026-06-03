import pandas as pd

from sklearn.model_selection import train_test_split

from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report

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


# Target (0=APPROVED, 1=MANUAL_REVIEW, 2=REJECTED)
y = df["status"]


# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
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


# Predictions
predictions = model.predict(X_test)


# Accuracy
accuracy = accuracy_score(
    y_test,
    predictions
)

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)


# Detailed report
print("\nClassification Report:\n")

print(
    classification_report(
        y_test,
        predictions,
        target_names=[
            "APPROVED",
            "MANUAL_REVIEW",
            "REJECTED"
        ]
    )
)


# Save model
joblib.dump(
    model,
    "fraud_model.pkl"
)

print(
    "\nModel saved as fraud_model.pkl"
)
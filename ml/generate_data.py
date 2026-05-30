import pandas as pd
import random

data = []

for i in range(500):

    faceMatch = random.randint(10, 100)

    panMatched = random.choice([0, 1])

    livenessPassed = random.choice([0, 1])

    ocrConfidence = random.randint(60, 100)

    risk = 0

    if faceMatch < 50:
        risk += 40

    if panMatched == 0:
        risk += 30

    if livenessPassed == 0:
        risk += 30

    if ocrConfidence < 75:
        risk += 10

    fraud = 1 if risk >= 60 else 0

    data.append([
        faceMatch,
        panMatched,
        livenessPassed,
        ocrConfidence,
        fraud
    ])

df = pd.DataFrame(
    data,
    columns=[
        "faceMatch",
        "panMatched",
        "livenessPassed",
        "ocrConfidence",
        "fraud"
    ]
)

df.to_csv(
    "training.csv",
    index=False
)

print("500 records generated successfully")
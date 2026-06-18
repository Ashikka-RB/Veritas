import pandas as pd
import random

data = []

for i in range(1000):

    faceMatch = random.randint(20, 100)

    panMatched = random.choices(
        [1, 0],
        weights=[90, 10]
    )[0]

    livenessPassed = random.choices(
        [1, 0],
        weights=[95, 5]
    )[0]

    ocrConfidence = random.randint(60, 100)

    # HIGH RISK / REJECTED
    if (
        livenessPassed == 0
        or faceMatch < 40
        or (faceMatch < 55 and panMatched == 0)
    ):
        status = 2

    # MEDIUM RISK / MANUAL REVIEW
    elif (
        panMatched == 0
        or faceMatch < 70
        or ocrConfidence < 70
    ):
        status = 1

    # LOW RISK / APPROVED
    else:
        status = 0

    data.append([
        faceMatch,
        panMatched,
        livenessPassed,
        ocrConfidence,
        status
    ])

df = pd.DataFrame(
    data,
    columns=[
        "faceMatch",
        "panMatched",
        "livenessPassed",
        "ocrConfidence",
        "status"
    ]
)

df.to_csv(
    "training.csv",
    index=False
)

print("1000 records generated successfully")

print("\nStatus Distribution:\n")

print(df["status"].value_counts())
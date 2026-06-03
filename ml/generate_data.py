import pandas as pd
import random

data = []

for i in range(1000):

    # Most users are genuine

    faceMatch = random.randint(40, 100)

    panMatched = random.choices(
        [1, 0],
        weights=[90, 10]
    )[0]

    livenessPassed = random.choices(
        [1, 0],
        weights=[95, 5]
    )[0]

    ocrConfidence = random.randint(60, 100)

    # REJECTED

    if (
        faceMatch < 50
        or panMatched == 0
        or livenessPassed == 0
    ):

        status = 2

    # MANUAL REVIEW

    elif (
        faceMatch < 80
        or ocrConfidence < 80
    ):

        status = 1

    # APPROVED

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

print(
    df["status"].value_counts()
)
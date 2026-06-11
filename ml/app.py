from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load trained model
model = joblib.load(
    "fraud_model.pkl"
)

@app.route(
    "/predict",
    methods=["POST"]
)
def predict():

    data = request.json

    faceMatch = data["faceMatch"]



    panMatched = (
        1 if data["panMatched"]
        else 0
    )

    livenessPassed = (
        1 if data["livenessPassed"]
        else 0
    )

    ocrConfidence = data["ocrConfidence"]

    features = [[
        faceMatch,
        panMatched,
        livenessPassed,
        ocrConfidence
    ]]

    prediction = model.predict(
        features
    )[0]

    probabilities = model.predict_proba(
        features
    )[0]

    approvedProb = round(
        probabilities[0] * 100,
        2
    )

    manualReviewProb = round(
        probabilities[1] * 100,
        2
    )

    rejectedProb = round(
        probabilities[2] * 100,
        2
    )

    statusMap = {
        0: "APPROVED",
        1: "MANUAL_REVIEW",
        2: "REJECTED"
    }

    return jsonify({

        "status":
            statusMap[int(prediction)],

        "prediction":
            int(prediction),

        "approvedProbability":
            approvedProb,

        "manualReviewProbability":
            manualReviewProb,

        "rejectedProbability":
            rejectedProb

    })

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )
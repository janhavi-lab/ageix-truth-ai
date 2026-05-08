from __future__ import annotations

import logging
import os
import pickle
from dataclasses import dataclass
from typing import Any, Tuple

from flask import Flask, jsonify, request
from flask_cors import CORS

SERVICE_NAME = "spam-detector"
DEFAULT_PORT = 5003


def _configure_logging() -> None:
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    logging.basicConfig(
        level=getattr(logging, log_level, logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s - %(message)s",
    )


logger = logging.getLogger(SERVICE_NAME)


@dataclass(frozen=True)
class InferenceArtifacts:
    vectorizer: Any
    model: Any


def _load_pickle(path: str) -> Any:
    with open(path, "rb") as f:
        return pickle.load(f)


def _load_artifacts() -> InferenceArtifacts:
    """
    Loads inference-only artifacts once on startup.

    Expected files (default):
    - vectorizer.pkl
    - spam_model.pkl
    """
    vectorizer_path = os.getenv("VECTORIZER_PATH", "vectorizer.pkl")
    model_path = os.getenv("MODEL_PATH", "spam_model.pkl")

    vectorizer = _load_pickle(vectorizer_path)
    model = _load_pickle(model_path)

    return InferenceArtifacts(
        vectorizer=vectorizer,
        model=model
    )


def _predict_with_confidence(
    artifacts: InferenceArtifacts,
    content: str
) -> Tuple[int, float]:

    x = artifacts.vectorizer.transform([content])

    pred = artifacts.model.predict(x)[0]

    # Prefer predict_proba if available
    if hasattr(artifacts.model, "predict_proba"):

        proba = artifacts.model.predict_proba(x)[0]

        try:
            pred_idx = int(pred)

            if 0 <= pred_idx < len(proba):
                return int(pred), float(proba[pred_idx])

        except Exception:
            pass

        return int(pred), float(max(proba))

    return int(pred), 0.5


class ApiError(Exception):

    def __init__(
        self,
        message: str,
        status_code: int = 400
    ) -> None:

        super().__init__(message)

        self.message = message
        self.status_code = status_code


def create_app() -> Flask:

    _configure_logging()

    app = Flask(__name__)

    CORS(app)

    try:
        artifacts = _load_artifacts()
        logger.info("Loaded artifacts successfully.")

    except Exception:
        logger.exception("Failed to load inference artifacts.")
        raise

    # -----------------------------------
    # Error Handlers
    # -----------------------------------

    @app.errorhandler(ApiError)
    def _handle_api_error(err: ApiError):
        return jsonify({
            "error": err.message
        }), err.status_code

    @app.errorhandler(400)
    def _handle_bad_request(_err):
        return jsonify({
            "error": "Invalid JSON or bad request."
        }), 400

    @app.errorhandler(404)
    def _handle_not_found(_err):
        return jsonify({
            "error": "Not found."
        }), 404

    @app.errorhandler(500)
    def _handle_server_error(_err):
        return jsonify({
            "error": "Internal server error."
        }), 500

    # -----------------------------------
    # Home Route
    # -----------------------------------

    @app.get("/")
    def home():

        return jsonify({
            "status": "success",
            "service": SERVICE_NAME,
            "message": "Spam Detector API Running Successfully",
            "available_endpoints": [
                "/health",
                "/predict"
            ],
            "predict_method": "POST"
        })

    # -----------------------------------
    # Health Route
    # -----------------------------------

    @app.get("/health")
    def health():

        return jsonify({
            "status": "ok",
            "service": SERVICE_NAME
        })

    # -----------------------------------
    # Prediction Route
    # -----------------------------------

    @app.post("/predict")
    def predict():

        data = request.get_json(silent=True)

        if data is None:
            raise ApiError("Invalid JSON body.", 400)

        if "content" not in data:
            raise ApiError(
                "Missing required field: content",
                400
            )

        content = data["content"]

        if not isinstance(content, str):
            raise ApiError(
                "Field 'content' must be a string.",
                400
            )

        content = content.strip()

        if not content:
            raise ApiError(
                "Field 'content' must be a non-empty string.",
                400
            )

        pred, confidence = _predict_with_confidence(
            artifacts,
            content
        )

        prediction = (
            "Fake"
            if int(pred) == 1
            else "Real"
        )

        return jsonify(
            {
                "prediction": prediction,
                "confidence": confidence,
            }
        )

    return app


app = create_app()


if __name__ == "__main__":

    port = int(
        os.getenv(
            "PORT",
            str(DEFAULT_PORT)
        )
    )

    logger.info(
        "Starting %s on port %s",
        SERVICE_NAME,
        port
    )

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )
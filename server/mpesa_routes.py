import os
import base64
import requests
import datetime
from dotenv import load_dotenv

from flask import Blueprint, request, jsonify
load_dotenv(dotenv_path="mpesa.env")
# Optional debug logs
print("🧪 DEBUG CONSUMER KEY:", os.getenv("MPESA_CONSUMER_KEY"))
print("🧪 DEBUG CONSUMER SECRET:", os.getenv("MPESA_CONSUMER_SECRET"))

mpesa_bp = Blueprint('mpesa_bp', __name__)

def get_access_token():
    consumer_key = os.getenv("MPESA_CONSUMER_KEY")
    consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")

    print("🔑 CONSUMER_KEY:", consumer_key)
    print("🔐 CONSUMER_SECRET:", consumer_secret)

    auth = base64.b64encode(f"{consumer_key}:{consumer_secret}".encode()).decode()

    response = requests.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        headers={"Authorization": f"Basic {auth}"}
    )

    print("📋 Status Code:", response.status_code)
    print("📥 Access Token Raw Response:", response.text)

    try:
        return response.json().get("access_token")
    except Exception as e:
        print("❌ Failed to parse access token response:", e)
        return None

@mpesa_bp.route("/stk-push", methods=["POST"])
def stk_push():
    data = request.get_json()
    phone = data.get("phone")
    amount = data.get("amount")

    if not phone or not amount:
        return jsonify({"error": "Phone and amount required"}), 400

    access_token = get_access_token()
    if not access_token:
        return jsonify({"error": "Failed to get token"}), 500

    # Timestamp & password generation
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    shortcode = os.getenv("MPESA_SHORTCODE")
    passkey = os.getenv("MPESA_PASSKEY")
    raw_password = f"{shortcode}{passkey}{timestamp}"
    password = base64.b64encode(raw_password.encode()).decode()

    print("🔐 Shortcode:", shortcode)
    print("🔐 Passkey:", passkey)
    print("🕒 Timestamp:", timestamp)
    print("🔒 Raw Password String:", raw_password)
    print("🔑 Encoded Password:", password)

    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": shortcode,
        "PhoneNumber": phone,
        "CallBackURL": os.getenv("MPESA_CALLBACK_URL"),
        "AccountReference": "Solenne Order",
        "TransactionDesc": "Payment for order"
    }

    print("📦 Final STK Payload to Safaricom:", payload)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    response = requests.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        json=payload,
        headers=headers
    )

    print("📨 Safaricom Response:", response.text)
    return jsonify(response.json()), response.status_code

@mpesa_bp.route("/callback", methods=["POST"])
def stk_callback():
    print("📞 MPESA CALLBACK RECEIVED")
    data = request.get_json()
    print(data)  # Save to DB later if needed
    return jsonify({"message": "Callback received"}), 200

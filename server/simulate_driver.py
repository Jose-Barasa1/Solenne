import time
import requests

ORDER_ID = 1  # Change this to match your test order ID
URL = f"http://localhost:5000/api/orders/{ORDER_ID}/location"

# Start location (shop)
lat, lng = -1.2900, 36.8200

print("Starting driver simulation...")
for _ in range(20):
    # Move east/north slightly
    lat += 0.0005
    lng += 0.0007

    response = requests.post(URL, json={"lat": lat, "lng": lng})
    print("Updated location:", response.status_code, response.json())

    time.sleep(5)  # Wait same as frontend polling time

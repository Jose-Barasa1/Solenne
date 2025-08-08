import openrouteservice
import os

ORS_API_KEY = os.getenv("ORS_API_KEY") or "your_api_key_here"
client = openrouteservice.Client(key=ORS_API_KEY)

def geocode_address(address):
    try:
        geocode = client.pelias_search(text=address)
        coords = geocode['features'][0]['geometry']['coordinates']
        return tuple(coords)
    except Exception as e:
        print("[Geocoding error]", e)
        return None

def calculate_distance_km(origin_address, destination_address, speed=40):
    try:
        origin_coords = geocode_address(origin_address)
        dest_coords = geocode_address(destination_address)

        if not origin_coords or not dest_coords:
            return {"distance_km": 5, "eta_minutes": estimate_eta_minutes(5, speed)}

        route = client.directions(
            coordinates=[origin_coords, dest_coords],
            profile='driving-car',
            format='geojson'
        )

        distance = route['features'][0]['properties']['summary']['distance']
        km = round(distance / 1000, 2)
        return {
            "distance_km": km,
            "eta_minutes": estimate_eta_minutes(km, speed)
        }
    except Exception as e:
        print("[Distance error]", e)
        return {"distance_km": 5, "eta_minutes": estimate_eta_minutes(5, speed)}



def estimate_eta_minutes(distance_km, avg_speed_kph=40):
    try:
        eta = (distance_km / avg_speed_kph) * 60
        return round(eta, 1)
    except:
        return 15  # fallback ETA in minutes
    

def reverse_geocode(lat, lng):
    try:
        result = client.pelias_reverse(location=[lng, lat])  # ORS uses [lng, lat]
        return result['features'][0]['properties']['label']
    except Exception as e:
        print("[Reverse geocoding error]", e)
        return "Unknown location"



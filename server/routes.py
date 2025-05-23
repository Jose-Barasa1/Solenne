from flask import Blueprint, request, jsonify, session
from models import db, User, Shop  # Make sure Shop is imported

auth_bp = Blueprint('auth', __name__)

# ----- EXISTING SIGNUP -----
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 409

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

# ----- EXISTING LOGIN -----
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401

# ----- NEW: Fetch all shops for onboarding -----
@auth_bp.route('/shops', methods=['GET'])
def get_shops():
    shops = Shop.query.all()
    shop_list = [{
        "id": shop.id,
        "name": shop.name,
        "type": shop.type,
        "image_url": shop.image_url
    } for shop in shops]
    return jsonify(shop_list), 200

# ----- NEW: Select a shop for the dashboard -----
@auth_bp.route('/select_shop', methods=['POST'])
def select_shop():
    data = request.get_json()
    shop_id = data.get('shop_id')
    
    if not shop_id:
        return jsonify({"message": "Shop ID is required"}), 400

    shop = Shop.query.get(shop_id)
    if not shop:
        return jsonify({"message": "Shop not found"}), 404

    # Optional: persist user-shop relation or session
    session['selected_shop'] = shop.id  # requires Flask sessions setup

    return jsonify({
        "message": "Shop selected",
        "shop": {
            "id": shop.id,
            "name": shop.name,
            "type": shop.type,
            "image_url": shop.image_url
        }
    }), 200

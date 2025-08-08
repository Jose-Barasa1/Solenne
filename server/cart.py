from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Cart

cart = Blueprint('cart', __name__)

@cart.route('/', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        return jsonify({ "items": [] }), 200
    return jsonify({ "items": cart.items }), 200

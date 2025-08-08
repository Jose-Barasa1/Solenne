from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Favorite, Product

favorites = Blueprint('favorites', __name__)

@favorites.route('/', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favs = Favorite.query.filter_by(user_id=user_id).all()
    product_ids = [f.product_id for f in favs]

    products = Product.query.filter(Product.id.in_(product_ids)).all()
    result = [
        {
            "id": p.id,
            "name": p.name,
            "price": float(p.price),
            "image_url": p.image_url,
            "category": p.category,
            "type": p.type
        } for p in products
    ]
    return jsonify({ "favorites": result }), 200

from flask import Blueprint, jsonify
from models import Product

product_bp = Blueprint('products', __name__)

@product_bp.route('/', methods=['GET'])
def get_all_products():
    products = Product.query.all()
    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": float(p.price),
            "image_url": p.image_url,
            "shop_id": p.shop_id,
            "type": p.type,
            "category": p.category
        } for p in products
    ])

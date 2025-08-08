from flask import Blueprint, request, jsonify
from models import Product

product_bp = Blueprint('products', __name__)  # ✅ Define it BEFORE using it

@product_bp.route('/', methods=['GET'])
def get_all_products():
    query = Product.query

    product_type = request.args.get('type')
    category = request.args.get('category')

    if product_type:
        query = query.filter_by(type=product_type)

    if category:
        query = query.filter_by(category=category)

    products = query.all()
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

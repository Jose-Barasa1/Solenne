from flask import Blueprint, jsonify, request
from models import db, Shop

shop_bp = Blueprint('shop', __name__)

# Get all shops for onboarding
@shop_bp.route('/shops', methods=['GET'])
def get_shops():
    shops = Shop.query.all()
    return jsonify([
        {
            "id": shop.id,
            "name": shop.name,
            "type": shop.type,
            "image_url": shop.image_url
        } for shop in shops
    ])

# Get one shop's dashboard data (basic for now)
@shop_bp.route('/shops/<int:shop_id>', methods=['GET'])
def get_shop_dashboard(shop_id):
    shop = Shop.query.get_or_404(shop_id)
    return jsonify({
        "id": shop.id,
        "name": shop.name,
        "type": shop.type,
        "image_url": shop.image_url,
        "dashboard": {
            "revenue": 75000,
            "users": 2300,
            "orders": 950,
            "sessions": 12400,
            "conversions": 18.2
        }
    })

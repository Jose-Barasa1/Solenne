from flask import Blueprint, jsonify, abort
from models import db, Shop   # Make sure Product is imported

shop_bp = Blueprint('shop', __name__)

# Route to get all shops
@shop_bp.route('/', methods=['GET'])
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

# Route to get dashboard info for a specific shop by shop_id
@shop_bp.route('/<int:shop_id>/dashboard', methods=['GET'])
def get_shop_dashboard(shop_id):
    shop = Shop.query.get(shop_id)
    if not shop:
        abort(404, description="Shop not found")

    # products = Product.query.filter_by(shop_id=shop.id).all()

    return jsonify({
        "shop_id": shop.id,
        "shop_name": shop.name,
        # "products": [
        #     {
        #         "id": product.id,
        #         "name": product.name,
        #         "description": product.description,
        #         "price": product.price,
        #         "image_url": product.image_url,
        #         # add other product fields as needed
        #     }
        #     # for product in products
        # ]
    })

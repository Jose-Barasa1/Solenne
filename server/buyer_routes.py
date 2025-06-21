# buyer_routes.py

from flask import Blueprint, request, jsonify
from models import db, Product, Cart, Order, OrderItem, Favorite, User

buyer_bp = Blueprint('buyer_bp', __name__)

# Fetch cart
@buyer_bp.route('/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    cart = Cart.query.filter_by(user_id=user_id).first()
    return jsonify(cart.items if cart else [])

# Update/Add cart
@buyer_bp.route('/cart', methods=['POST'])
def update_cart():
    data = request.get_json()
    user_id = data.get('user_id')
    items = data.get('items')

    if not user_id or not isinstance(items, list):
        return jsonify({'error': 'Invalid data'}), 400

    cart = Cart.query.filter_by(user_id=user_id).first()
    if cart:
        cart.items = items
    else:
        cart = Cart(user_id=user_id, items=items)
        db.session.add(cart)

    db.session.commit()
    return jsonify({'message': 'Cart updated'}), 200

# Toggle favorite
@buyer_bp.route('/favorites', methods=['POST'])
def toggle_favorite():
    data = request.get_json()
    user_id = data.get('user_id')
    product_id = data.get('product_id')

    if not user_id or not product_id:
        return jsonify({'error': 'Missing data'}), 400

    existing = Favorite.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({'message': 'Removed from favorites'}), 200
    else:
        new_fav = Favorite(user_id=user_id, product_id=product_id)
        db.session.add(new_fav)
        db.session.commit()
        return jsonify({'message': 'Added to favorites'}), 201

# Get user's favorites
@buyer_bp.route('/favorites/<int:user_id>', methods=['GET'])
def get_favorites(user_id):
    favs = Favorite.query.filter_by(user_id=user_id).all()
    products = [Product.query.get(f.product_id) for f in favs]
    result = [{
        'id': p.id,
        'name': p.name,
        'image_url': p.image_url,
        'price': float(p.price)
    } for p in products if p]
    return jsonify(result)

# Submit order
@buyer_bp.route('/orders', methods=['POST'])
def place_order():
    data = request.get_json()
    user_id = data.get('user_id')
    shop_id = data.get('shop_id')
    items = data.get('items')
    total = data.get('total')
    email = data.get('email')
    address = data.get('address')

    if not all([user_id, shop_id, items, total]):
        return jsonify({'error': 'Missing order fields'}), 400

    order = Order(
        user_id=user_id,
        shop_id=shop_id,
        items=items,
        total_amount=total,
        status="pending"
    )
    db.session.add(order)
    db.session.commit()

    for item in items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item['product_id'],
            quantity=item['quantity'],
            unit_price=item['unit_price']
        )
        db.session.add(order_item)

    db.session.commit()
    return jsonify({'message': 'Order placed'}), 201

# Get order history
@buyer_bp.route('/orders/<int:user_id>', methods=['GET'])
def get_orders(user_id):
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        result.append({
            'order_id': o.id,
            'total': float(o.total_amount),
            'status': o.status,
            'created_at': o.created_at,
            'items': o.items
        })
    return jsonify(result)

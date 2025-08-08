# buyer_routes.py

from flask import Blueprint, request, jsonify
from utils.distance import calculate_distance_km
from flask_socketio import emit
from flask_socketio import socketio 
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
    email = data.get('email')
    address = data.get('address')
    shop_address = data.get('shop_address', "Ngong Road, Nairobi")
    payment_method = data.get('payment_method', 'mpesa')  # default fallback

    if not all([user_id, shop_id, items, address]):
        return jsonify({'error': 'Missing required fields'}), 400

    # 1. Calculate delivery distance
    distance_km = calculate_distance_km(shop_address, address)

    # 2. Calculate subtotal, delivery, tax
    subtotal = sum(i['unit_price'] * i['quantity'] for i in items)
    delivery_fee = 50 + distance_km * 10
    tax = subtotal * 0.08
    total = subtotal + delivery_fee + tax

    # 3. Simulate payment
    transaction_id = f"{payment_method.upper()}-{user_id}-{int(total)}"

    # 4. Save order
    order = Order(
        user_id=user_id,
        shop_id=shop_id,
        items=items,
        total_amount=round(total, 2),
        status="processing",
        payment_method=payment_method,
        delivery_address=address,
        transaction_id=transaction_id
    )
    db.session.add(order)
    db.session.flush()  # get order.id

    for item in items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item['product_id'],
            quantity=item['quantity'],
            unit_price=item['unit_price']
        )
        db.session.add(order_item)

    db.session.commit()

    return jsonify({
        'message': 'Order placed',
        'order_id': order.id,
        'distance_km': distance_km,
        'pricing': {
            'subtotal': round(subtotal, 2),
            'delivery_fee': round(delivery_fee, 2),
            'tax': round(tax, 2),
            'total': round(total, 2)
        },
        'transaction_id': transaction_id
    }), 201
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

@buyer_bp.route('/orders/<int:order_id>/location', methods=['GET'])
def get_order_tracking_data(order_id):
    order = Order.query.get(order_id)

    if not order:
        return jsonify({'error': 'Order not found'}), 404

    shop_address = "Ngong Road, Nairobi"  # or fetch from DB
    delivery_address = order.delivery_address

    result = get_distance_and_eta(shop_address, delivery_address)

    return jsonify({
        'driver_location': order.driver_location,
        'destination': delivery_address,
        'eta': result['eta_minutes'],
        'distance_km': result['distance_km'],
        'status': order.status
    })
@buyer_bp.route('/orders/<int:order_id>/location', methods=['POST'])
def update_driver_location(order_id):
    data = request.get_json()
    lat = data.get('lat')
    lng = data.get('lng')

    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    order.driver_location = {'lat': lat, 'lng': lng}
    db.session.commit()

    # 🚀 Emit real-time update to frontend clients
    socketio.emit('location_update', {
        'order_id': order_id,
        'latitude': lat,
        'longitude': lng
    }, broadcast=True)

    return jsonify({ 'message': 'Location updated and broadcasted' })
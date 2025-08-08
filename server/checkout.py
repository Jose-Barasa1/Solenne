from flask import Blueprint, request, jsonify
from models import db, Order, OrderItem, Product
from utils.distance import calculate_distance_km
from datetime import datetime

checkout_bp = Blueprint('checkout', __name__)

def calculate_total(cart_items, distance_km):
    subtotal = sum(item['price'] * item['quantity'] for item in cart_items)
    delivery_fee = 50 + (distance_km * 10)
    tax = subtotal * 0.08
    total = subtotal + delivery_fee + tax
    return {
        "subtotal": round(subtotal, 2),
        "delivery_fee": round(delivery_fee, 2),
        "tax": round(tax, 2),
        "total": round(total, 2)
    }

def simulate_payment(method, amount, info):
    if method == "mpesa":
        return {"status": "success", "transaction_id": f"MPESA-{info['phone'][-4:]}"}
    elif method == "paypal":
        return {"status": "success", "transaction_id": f"PAYPAL-{info['email'][:3].upper()}"}
    elif method == "card":
        return {"status": "success", "transaction_id": "CARD-XXXX"}
    else:
        return {"status": "error", "message": "Unsupported payment method"}

@checkout_bp.route('/api/checkout', methods=['POST'])
def checkout():
    data = request.get_json()

    user_id = data.get('user_id')
    cart = data.get('cart', [])
    delivery = data.get('delivery_info')
    payment_method = data.get('payment_method')
    shop_address = data.get('shop_address', "Ngong Road, Nairobi")

    if not user_id or not cart or not delivery:
        return jsonify({"error": "Missing required fields"}), 400

    # Distance calculation
    distance_km = calculate_distance_km(shop_address, delivery['address'])

    # Price calculation
    pricing = calculate_total(cart, distance_km)

    # Simulated payment
    payment_result = simulate_payment(payment_method, pricing['total'], delivery)
    if payment_result['status'] != 'success':
        return jsonify({"error": "Payment failed"}), 402

    # Create Order
    new_order = Order(
        user_id=user_id,
        status="Processing",
        total=pricing['total'],
        delivery_address=delivery['address'],
        payment_method=payment_method,
        transaction_id=payment_result['transaction_id'],
        timestamp=datetime.utcnow()
    )
    db.session.add(new_order)
    db.session.flush()

    for item in cart:
        product = Product.query.get(item['product_id'])
        if not product:
            continue
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=item['quantity'],
            price=product.price
        )
        db.session.add(order_item)

    db.session.commit()

    return jsonify({
        "message": "Checkout successful",
        "order_id": new_order.id,
        "transaction_id": payment_result['transaction_id'],
        "pricing": pricing
    }), 200

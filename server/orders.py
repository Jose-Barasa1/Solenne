from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order

orders = Blueprint('orders', __name__)

@orders.route('/', methods=['POST'])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        print("✅ Incoming order data:", data)

        shop_id = data.get('shop_id')
        items = data.get('items')  # should be a list of dicts
        total = data.get('total')
        delivery_address = data.get('delivery_address', 'Nairobi CBD')
        payment_method = data.get('payment_method', 'mpesa')
        transaction_id = data.get('transaction_id')  # optional

        if not shop_id or not items or not total:
            return jsonify({'error': 'Missing required fields: shop_id, items, or total'}), 400

        new_order = Order(
            user_id=user_id,
            shop_id=shop_id,
            items=items,
            total_amount=total,
            status='confirmed',
            delivery_address=delivery_address,
            payment_method=payment_method,
            transaction_id=transaction_id
        )

        db.session.add(new_order)
        db.session.commit()

        print("✅ Order created with ID:", new_order.id)

        return jsonify({'message': 'Order created', 'order_id': new_order.id}), 201

    except Exception as e:
        print("❌ Error creating order:", str(e))
        return jsonify({'error': str(e)}), 500

@orders.route('/', methods=['GET'])
@jwt_required()
def get_user_orders():
    try:
        user_id = get_jwt_identity()

        user_orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()

        order_list = [
            {
                "id": order.id,
                "shop_id": order.shop_id,
                "items": order.items,
                "total": order.total_amount,
                "status": order.status,
                "created_at": order.created_at.isoformat()
            }
            for order in user_orders
        ]

        return jsonify({ "orders": order_list }), 200

    except Exception as e:
        return jsonify({ "error": str(e) }), 500


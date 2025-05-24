from flask import Blueprint, jsonify, abort
from models import Shop  # Adjust imports
from sqlalchemy import extract
from datetime import datetime


dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/shops', methods=['GET'])
def get_all_shops_dashboard():
    shops = Shop.query.all()
    dashboard_data = []

    for shop in shops:
        orders = Order.query.filter_by(shop_id=shop.id).all()
        income = sum(order.total_amount for order in orders)
        customer_ids = {order.user_id for order in orders}
        num_customers = len(customer_ids)
        total_orders = len(orders)
        avg_order_value = income / total_orders if total_orders else 0

        order_ids = [order.id for order in orders]
        order_items = OrderItem.query.filter(OrderItem.order_id.in_(order_ids)).all()
        total_products_sold = sum(item.quantity for item in order_items)

        dashboard_data.append({
            "shop_id": shop.id,
            "shop_name": shop.name,
            "income": income,
            "num_customers": num_customers,
            "total_orders": total_orders,
            "avg_order_value": avg_order_value,
            "total_products_sold": total_products_sold
        })

    return jsonify(dashboard_data)

@dashboard_bp.route('/shops/<int:shop_id>', methods=['GET'])
def get_shop_details(shop_id):
    shop = Shop.query.get(shop_id)
    if not shop:
        abort(404, description="Shop not found")

    orders = Order.query.filter_by(shop_id=shop.id).all()
    income = sum(order.total_amount for order in orders)
    customer_ids = {order.user_id for order in orders}
    num_customers = len(customer_ids)
    total_orders = len(orders)
    avg_order_value = income / total_orders if total_orders else 0
    order_ids = [order.id for order in orders]
    order_items = OrderItem.query.filter(OrderItem.order_id.in_(order_ids)).all()
    total_products_sold = sum(item.quantity for item in order_items)

    # Monthly revenue (last 6 months)
    revenue_data = []
    now = datetime.now()
    for i in range(5, -1, -1):
        month = (now.month - i - 1) % 12 + 1
        year = now.year - ((now.month - i - 1) // 12)
        monthly_orders = Order.query.filter_by(shop_id=shop.id).filter(
            extract('month', Order.created_at) == month,
            extract('year', Order.created_at) == year
        ).all()
        monthly_income = sum(order.total_amount for order in monthly_orders)
        revenue_data.append({
            "name": f"{datetime(year, month, 1).strftime('%b')}",
            "revenue": monthly_income
        })

    # Sessions data placeholder
    sessions_data = [
        {"name": m["name"], "sessions": m["revenue"] // 10} for m in revenue_data  # example formula
    ]

    # User types placeholder (adjust as needed)
    user_types = [
        {"name": "Admin", "value": 5, "color": "#8884d8"},
        {"name": "Customer", "value": num_customers, "color": "#82ca9d"}
    ]

    # Conversion rate example
    conversion_rate = (total_orders / (total_orders + 100)) * 100  # replace 100 with real visitor number if available

    details = {
        "shop_id": shop.id,
        "shop_name": shop.name,
        "income": income,
        "num_customers": num_customers,
        "total_orders": total_orders,
        "avg_order_value": avg_order_value,
        "total_products_sold": total_products_sold,
        "revenueData": revenue_data,
        "sessionsData": sessions_data,
        "userTypes": user_types,
        "conversions": round(conversion_rate, 2)
    }

    return jsonify(details)

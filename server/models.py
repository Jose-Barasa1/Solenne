from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Shop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(300))


# class Order(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     shop_id = db.Column(db.Integer, db.ForeignKey('shop.id'), nullable=False)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     total_amount = db.Column(db.Float, nullable=False)  # total price of this order
#     created_at = db.Column(db.DateTime, server_default=db.func.now())

#     shop = db.relationship('Shop', backref=db.backref('orders', lazy=True))
#     user = db.relationship('User', backref=db.backref('orders', lazy=True))


# class OrderItem(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
#     product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
#     quantity = db.Column(db.Integer, nullable=False)
#     price_per_unit = db.Column(db.Float, nullable=False)  # store snapshot at time of order

#     order = db.relationship('Order', backref=db.backref('items', lazy=True))
#     product = db.relationship('Product', backref=db.backref('order_items', lazy=True))


#     # class Product(db.Model):
#     #  __tablename__ = 'products'

#     # id = db.Column(db.Integer, primary_key=True)
#     # name = db.Column(db.String(120), nullable=False)
#     # price = db.Column(db.Float, nullable=False)
#     # image_url = db.Column(db.String(300))
#     # shop_id = db.Column(db.Integer, db.ForeignKey('shops.id'), nullable=False)

#     # shop = db.relationship('Shop', backref=db.backref('products', lazy=True))



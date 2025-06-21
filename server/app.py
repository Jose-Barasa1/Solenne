from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from models import db
from auth_routes import auth_bp
from shop_routes import shop_bp
from dashboard import dashboard_bp
from product_routes import product_bp
from buyer_routes import buyer_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Proper initialization
db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

with app.app_context():
    db.create_all()

# Register routes
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(shop_bp, url_prefix='/api/shops')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(product_bp, url_prefix="/api/products")
app.register_blueprint(buyer_bp, url_prefix='/api/buyer')

@app.route('/')
def home():
    return jsonify({"message": "API is running"}), 200

if __name__ == '__main__':
    app.run(debug=True)

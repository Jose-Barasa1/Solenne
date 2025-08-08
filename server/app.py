
from dotenv import load_dotenv
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO

# Load mpesa.env from the same directory as this file
load_dotenv(dotenv_path="mpesa.env")

# ✅ Print to confirm env values are loaded
print("✅ MPESA_CONSUMER_KEY:", os.getenv("MPESA_CONSUMER_KEY"))

from models import db
from auth_routes import auth_bp
from shop_routes import shop_bp
from dashboard import dashboard_bp
from product_routes import product_bp
from buyer_routes import buyer_bp
from orders import orders
from mpesa_routes import mpesa_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = "your_secret_key"
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"

jwt = JWTManager(app)
db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

# 🔌 Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
with app.app_context():
    db.create_all()

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(shop_bp, url_prefix='/api/shops')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(product_bp, url_prefix="/api/products")
app.register_blueprint(buyer_bp, url_prefix='/api/buyer')
app.register_blueprint(orders, url_prefix='/api/orders')
app.register_blueprint(mpesa_bp, url_prefix='/api/mpesa')

@app.route('/')
def home():
    return jsonify({"message": "API is running"}), 200

# 🔌 Use socketio.run instead of app.run
if __name__ == '__main__':
   socketio.run(app, host="0.0.0.0", port=5000, debug=True)

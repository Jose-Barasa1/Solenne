from flask import Flask, jsonify
from flask_cors import CORS
from models import db
from auth_routes import auth_bp
from shop_routes import shop_bp
from dashboard import dashboard_bp



app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(shop_bp, url_prefix='/api/shops')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

@app.route('/')
def home():
    return jsonify({"message": "API is running"}), 200

if __name__ == '__main__':
    app.run(debug=True)

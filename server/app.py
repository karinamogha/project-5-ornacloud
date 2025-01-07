#!/usr/bin/env python3

# Standard library imports
import os

# Remote library imports
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message

# Local imports
# (Include any local imports if needed)

# Instantiate app, set attributes
app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')  # Use environment variable or fallback to SQLite
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

# Instantiate Bcrypt for password hashing
bcrypt = Bcrypt(app)

# Mail configuration (optional, for email functionality)
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'your_email@gmail.com')  # Replace with your email
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'your_password')  # Replace with your email password
mail = Mail(app)

# 3b. Session Set up:
# generate a secret key `python -c 'import os; print(os.urandom(16))'`
# configure secret key with flask app
app.secret_key = os.environ.get('SECRET_KEY', os.urandom(16))

# Routes and Views

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

# User Registration
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json

    # Check if the username already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists!"}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    # Create a new user
    new_user = User(
        name=data['name'],
        lastname=data['lastname'],
        username=data['username'],
        password=hashed_password,
        category=data['category']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully!"})


# User Login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        # Set the user ID in session
        session['user_id'] = user.id
        return jsonify({"message": f"Welcome, {user.name}!"})
    
    return jsonify({"error": "Invalid credentials!"}), 400


# User Logout
@app.route('/api/logout', methods=['DELETE'])
def logout():
    session.pop('user_id', None)  # Remove user_id from session
    return jsonify({"message": "Logged out successfully!"}), 200


# Get Memos by Company
@app.route('/api/memos/<company>', methods=['GET'])
def get_memos(company):
    memos = Memo.query.filter_by(company=company).all()
    return jsonify([memo.to_dict() for memo in memos])


# Create Memo
@app.route('/api/memos', methods=['POST'])
def create_memo():
    if 'user_id' not in session:
        return jsonify({'error': 'User not authenticated'}), 401  # If user is not logged in

    data = request.json
    new_memo = Memo(
        title=data['title'],
        memo_number=data['memo_number'],
        expiry_date=data['expiry_date'],
        wholesaler_details=data['wholesaler_details'],
        buyer_details=data['buyer_details'],
        items=data['items'],
        total_value=data['total_value'],
        remarks=data.get('remarks', ''),
        company=data['company'],
        user_id=session['user_id']
    )
    db.session.add(new_memo)
    db.session.commit()

    if 'email' in data:
        msg = Message('New Memo Created', sender='your_email@gmail.com', recipients=[data['email']])
        msg.body = f"Memo Created: {data['title']}\nDetails: {data['items']}"
        mail.send(msg)

    return jsonify({"message": "Memo created and email sent!"})


# Get Invoices by Company
@app.route('/api/invoices/<company>', methods=['GET'])
def get_invoices(company):
    invoices = Invoice.query.filter_by(company=company).all()
    return jsonify([invoice.to_dict() for invoice in invoices])


# Create Invoice
@app.route('/api/invoices', methods=['POST'])
def create_invoice():
    if 'user_id' not in session:
        return jsonify({'error': 'User not authenticated'}), 401  # If user is not logged in

    data = request.json
    new_invoice = Invoice(
        title=data['title'],
        invoice_number=data['invoice_number'],
        wholesaler_details=data['wholesaler_details'],
        buyer_details=data['buyer_details'],
        items=data['items'],
        total_value=data['total_value'],
        company=data['company'],
        user_id=session['user_id']
    )
    db.session.add(new_invoice)
    db.session.commit()

    if 'email' in data:
        msg = Message('New Invoice Created', sender='your_email@gmail.com', recipients=[data['email']])
        msg.body = f"Invoice Created: {data['title']}\nDetails: {data['items']}"
        mail.send(msg)

    return jsonify({"message": "Invoice created and email sent!"})

# Start the Flask app
if __name__ == '__main__':
    app.run(port=5555, debug=True)






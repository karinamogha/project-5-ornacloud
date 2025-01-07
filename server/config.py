# Standard library imports
import os

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt

# Local imports (if any)

# Instantiate the app and set attributes
app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')  # Use environment variable or fallback to SQLite
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Application secret key (for session management and CSRF protection)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default_secret_key')  # Fallback secret key

# JSON configuration to prevent compacting of JSON responses
app.json.compact = False

# Define metadata for SQLAlchemy
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)

# Initialize Flask-Migrate for database migrations
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate Flask-RESTful API
api = Api(app)

# Instantiate Flask-CORS to handle Cross-Origin Resource Sharing
CORS(app)

# Instantiate Flask-Bcrypt for password hashing
bcrypt = Bcrypt(app)

# Optional: Configure Flask-Mail for email functionality
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'your_email@gmail.com')  # Replace with your email
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'your_password')  # Replace with your email password

# 3b. Session Set up:
# Generate a secret key `python -c 'import os; print(os.urandom(16))'`
# Configure secret key with Flask app (ensure this is set up securely for production)
app.secret_key = os.environ.get('SECRET_KEY', os.urandom(24))  # Fallback to a generated secret key if not set




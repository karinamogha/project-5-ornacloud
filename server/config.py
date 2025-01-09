import os

from sqlalchemy import MetaData
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from flask import Flask
import logging  # Import logging library

# Initialize Flask app
app = Flask(__name__)
CORS(app)


# Database configuration
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///app.db')  # Default to SQLite
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Application secret key for session management
SECRET_KEY = os.environ.get('SECRET_KEY', b'y$2\xa7l\x89\xb0\t\x87\xb5\x1abf\xff\xeb\xd5')  # Use environment variable or fallback

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Mail configuration
MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
MAIL_USE_TLS = True
MAIL_USERNAME = os.environ.get('MAIL_USERNAME', 'your_email@gmail.com')  # Replace with your email
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', 'your_password')  # Replace with your email password

# JSON configuration
JSON_COMPACT = False

# Define metadata for SQLAlchemy
metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)

# Apply configurations
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config['SECRET_KEY'] = SECRET_KEY
app.config['MAIL_SERVER'] = MAIL_SERVER
app.config['MAIL_PORT'] = MAIL_PORT
app.config['MAIL_USE_TLS'] = MAIL_USE_TLS
app.config['MAIL_USERNAME'] = MAIL_USERNAME
app.config['MAIL_PASSWORD'] = MAIL_PASSWORD
app.json.compact = JSON_COMPACT


# Initialize extensions
db = SQLAlchemy(metadata=metadata)
db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
bcrypt = Bcrypt(app)
CORS(app)


# Mail configuration
mail = Mail(app)




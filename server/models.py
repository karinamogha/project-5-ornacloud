from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

from config import db, bcrypt

metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)

db = SQLAlchemy(metadata=metadata)

# User Model
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    lastname = db.Column(db.String, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)

    # Relationships
    memos = db.relationship('Memo', backref='user', lazy=True, cascade="all, delete-orphan")
    invoices = db.relationship('Invoice', backref='user', lazy=True, cascade="all, delete-orphan")

    serialize_rules = ('-memos.user', '-invoices.user')  # Avoid circular references

    # Add validation
    @validates('name')
    def validate_name(self, key, value):
        if not value or (len(value) < 1):
            raise ValueError('User must have a name')
        return value

    @validates('username')
    def validate_username(self, key, value):
        if not value or (len(value) < 1):
            raise ValueError('User must have a username')
        return value

    @validates('category')
    def validate_category(self, key, value):
        if not value:
            raise ValueError('User must have a category')
        return value

    @property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = generate_password_hash(password)

    def authenticate(self, password):
        password = password.strip()
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'name': self.name,
            'category': self.category
        }

# Memo Model
class Memo(db.Model, SerializerMixin):
    __tablename__ = 'memos'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    memo_number = db.Column(db.String, unique=True, nullable=False)
    expiry_date = db.Column(db.String, nullable=False)
    wholesaler_details = db.Column(db.Text, nullable=False)
    buyer_details = db.Column(db.Text, nullable=False)
    items = db.Column(db.Text, nullable=False)
    total_value = db.Column(db.Float, nullable=False)
    remarks = db.Column(db.Text)
    company = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    serialize_rules = ('-user.memos',)  # Avoid circular references

    # Add validation
    @validates('title')
    def validate_title(self, key, value):
        if not value or len(value) < 1:
            raise ValueError('Memo must have a title')
        return value

    @validates('company')
    def validate_company(self, key, value):
        if not value or len(value) < 1:
            raise ValueError('Memo must have a company')
        return value

# Invoice Model
class Invoice(db.Model, SerializerMixin):
    __tablename__ = 'invoices'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    invoice_number = db.Column(db.String, unique=True, nullable=False)
    wholesaler_details = db.Column(db.Text, nullable=False)
    buyer_details = db.Column(db.Text, nullable=False)
    items = db.Column(db.Text, nullable=False)
    total_value = db.Column(db.Float, nullable=False)
    company = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    serialize_rules = ('-user.invoices',)  # Avoid circular references

    # Add validation
    @validates('title')
    def validate_title(self, key, value):
        if not value or len(value) < 1:
            raise ValueError('Invoice must have a title')
        return value

    @validates('company')
    def validate_company(self, key, value):
        if not value or len(value) < 1:
            raise ValueError('Invoice must have a company')
        return value

# Booking Model
class Booking(db.Model, SerializerMixin):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    date_time = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'))

    # Relationship
    user = db.relationship('User', back_populates='bookings')
    listing = db.relationship('Listing', back_populates='bookings')

    # Serialization rules
    serialize_rules = ('-listings', '-users')

    # Add validation
    @validates('date_time')
    def validate_date_time(self, key, value):
        if not value:
            raise ValueError('Booking must have a date and time')
        return value

# Image Model
class Image(db.Model, SerializerMixin):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    file = db.Column(db.String)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'))

    listing = db.relationship('Listing', back_populates='images')

    @validates('file')
    def validate_file(self, key, value):
        if not value or (len(value) < 1):
            raise ValueError('Listing must have an image')
        return value

# Listing Model
class Listing(db.Model, SerializerMixin):
    __tablename__ = 'listings'
    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String, nullable=False)
    sqft = db.Column(db.Integer, nullable=False)
    bedroom = db.Column(db.Integer, nullable=False)
    bathroom = db.Column(db.Integer, nullable=False)
    kitchen = db.Column(db.Integer, nullable=False)
    amenity = db.Column(db.String, nullable=False)
    pets = db.Column(db.Boolean, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    about = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)
    parking = db.Column(db.Boolean, nullable=False)
    heat_water = db.Column(db.Boolean, nullable=False)
    train = db.Column(db.String, nullable=False)
    airport = db.Column(db.String, nullable=False)
    security = db.Column(db.String, nullable=False)

    # Relationship
    bookings = db.relationship('Booking', back_populates='listing', cascade='all, delete-orphan')
    user = db.relationship('User', back_populates='listings')
    images = db.relationship('Image', back_populates='listing', cascade='all, delete-orphan')

    # Serialization rules
    serialize_rules = ('-bookings', '-images', '-users')

    @validates('price')
    def validate_price(self, key, value):
        if int(value) < 100:
            raise ValueError('Listing must have a price and min 100')
        return value
    
    @validates('address')
    def validate_address(self, key, value):
        if len(value) < 10:
            raise ValueError('Listing must have an address and min 10 chars')
        return value

    @validates('sqft')
    def validate_sqft(self, key, value):
        if int(value) < 100:
            raise ValueError('Listing must have a sq footage and min 100 sq ft')
        return value

    # More validation methods for other fields go here...




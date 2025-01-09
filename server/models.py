from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from werkzeug.security import generate_password_hash, check_password_hash
from config import db

# Category Model
class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    # Relationship with User
    users = db.relationship('User', backref='category_obj', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }


# User Model
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    lastname = db.Column(db.String, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

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

    @validates('category_id')
    def validate_category_id(self, key, value):
        if not value:
            raise ValueError('User must have a category')
        if not Category.query.get(value):
            raise ValueError('Invalid category ID')
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
            'lastname': self.lastname,
            'category': self.category_obj.name if self.category_obj else None,
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




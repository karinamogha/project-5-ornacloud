#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
import random

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Memo, Invoice, Category

@app.before_first_request
def seed_categories():
    """
    Ensures the Category table has rows:
    ['Wholesale', 'Designer', 'Individual', 'Other'].
    """
    categories = ["Wholesale", "Designer", "Individual", "Other"]
    for name in categories:
        if not Category.query.filter_by(name=name).first():
            db.session.add(Category(name=name))
    db.session.commit()

with app.app_context():
    # Create and initialize a Faker generator
    fake = Faker()

    # Ensure categories exist so we can reference their IDs
    seed_categories()  # calls the function above

    # Grab all categories from the DB
    categories = Category.query.all()

    # Delete all rows in the User table
    User.query.delete()

    # Create an empty list for users
    users = []

    # For each new user, pick a random Category from the DB
    for n in range(5):
        random_category = rc(categories)  # e.g. Category with id=1, name='Wholesale'
        user = User(
            name=fake.first_name(),
            lastname=fake.last_name(),
            username=fake.user_name(),
            password=fake.password(),
            category_id=random_category.id  # <--- store the numeric ID
        )
        users.append(user)
    
    db.session.add_all(users)
    db.session.commit()

    # Delete all rows in the Memo table
    Memo.query.delete()

    # Create an empty list for memos
    memos = []
    for _ in range(20):  # Seed 20 memos
        memo = Memo(
            title=fake.sentence(),
            memo_number=fake.uuid4(),
            expiry_date=fake.future_date().strftime('%Y-%m-%d'),
            wholesaler_details=fake.address(),
            buyer_details=fake.address(),
            items=fake.text(),
            total_value=randint(100, 10000),
            remarks=fake.sentence(),
            company=fake.company(),
            user_id=rc(users).id  # Assign to a random user
        )
        memos.append(memo)

    db.session.add_all(memos)
    db.session.commit()

    # Delete all rows in the Invoice table
    Invoice.query.delete()

    # Create an empty list for invoices
    invoices = []
    for _ in range(20):  # Seed 20 invoices
        invoice = Invoice(
            title=fake.sentence(),
            invoice_number=fake.uuid4(),
            wholesaler_details=fake.address(),
            buyer_details=fake.address(),
            items=fake.text(),
            total_value=randint(100, 10000),
            company=fake.company(),
            user_id=rc(users).id  # Assign to a random user
        )
        invoices.append(invoice)

    db.session.add_all(invoices)
    db.session.commit()

    print("Seeding complete!")





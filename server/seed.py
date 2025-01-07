#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
import random

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Memo, Invoice
import random

with app.app_context():
    # Create and initialize a fake generator
    fake = Faker()

    # Delete all rows in the User table
    User.query.delete()

    # Create an empty list for users
    users = []

    # Add some user instances to the list
    for n in range(5):
        user = User(
            name=fake.first_name(),
            lastname=fake.last_name(),
            username=fake.user_name(),
            password=fake.password(),
            category=rc(['wholesale', 'designer', 'individual', 'other'])
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
            user_id=rc(users).id
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
            user_id=rc(users).id
        )
        invoices.append(invoice)

    db.session.add_all(invoices)
    db.session.commit()

    print("Seeding complete!")



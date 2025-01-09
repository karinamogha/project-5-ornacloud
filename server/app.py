#!/usr/bin/env python3

# Standard library imports
import os
from flask import request, jsonify, session, make_response
from models import User, Memo, Invoice, Category
from config import app, api, logger, bcrypt, db, mail  # <-- Notice we also import 'mail'
from flask_restful import Resource
from flask_mail import Message  # <-- For sending emails

# Routes and Views
@app.route('/')
def index():
    return '<h1>Project Server Running!</h1>'

### User Management Routes

class Signup(Resource):
    def post(self):
        params = request.json
        try:
            username = params.get('username')
            password = params.get('password')
            name = params.get('name')
            lastname = params.get('lastname')
            category_id = params.get('category_id')

            if not all([username, password, name, lastname, category_id]):
                logger.error("Missing required fields in signup request.")
                return make_response({'error': 'Missing required fields'}, 400)

            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                logger.warning(f"Signup attempt failed: Username '{username}' already exists.")
                return make_response({'error': 'Username already exists'}, 400)

            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            user = User(
                username=username,
                password=hashed_password,
                name=name,
                lastname=lastname,
                category_id=category_id
            )

            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            logger.info(f"User '{username}' successfully signed up.")
            return make_response(user.to_dict(), 201)

        except Exception as e:
            logger.error(f"Error during signup: {e}")
            return make_response({'error': 'Failed to sign up'}, 400)

api.add_resource(Signup, '/signup')


class CheckSession(Resource):
    def get(self):
        try:
            user_id = session.get('user_id')
            if user_id:
                user = db.session.get(User, user_id)
                if user:
                    logger.info(f"Session check successful for user ID: {user_id}")
                    return make_response(user.to_dict(), 200)
            logger.warning("Unauthorized session check attempt.")
            return make_response({'error': 'No authorization'}, 401)
        except Exception as e:
            logger.error(f"Error during session check: {e}")
            return make_response({'error': 'Session check failed'}, 500)

api.add_resource(CheckSession, '/check')


class Login(Resource):
    def post(self):
        params = request.json
        try:
            username = params.get('username')
            password = params.get('password')

            if not username or not password:
                logger.warning("Login attempt with missing username or password.")
                return make_response({'error': 'Username and password are required'}, 400)

            user = User.query.filter_by(username=username).first()

            if not user:
                logger.warning(f"Login attempt failed: User '{username}' not found.")
                return make_response({'error': 'User not found'}, 404)

            if bcrypt.check_password_hash(user.password, password):
                session['user_id'] = user.id
                logger.info(f"User '{username}' successfully logged in.")
                return make_response(user.to_dict(), 200)
            else:
                logger.warning(f"Login attempt failed: Invalid password for user '{username}'.")
                return make_response({'error': 'Invalid password'}, 401)
        except Exception as e:
            logger.error(f"Error during login: {e}")
            return make_response({'error': 'Failed to log in'}, 500)

api.add_resource(Login, '/login')


class Logout(Resource):
    def delete(self):
        try:
            session.pop('user_id', None)
            logger.info("User logged out successfully.")
            return make_response({}, 204)
        except Exception as e:
            logger.error(f"Error during logout: {e}")
            return make_response({'error': 'Failed to log out'}, 500)

api.add_resource(Logout, '/logout')


### Memo Management Routes

class Memos(Resource):
    def get(self):
        try:
            company = request.args.get('company')
            if not company:
                logger.error("Missing company parameter in memo retrieval request.")
                return make_response({'error': 'Company parameter is required'}, 400)

            memos = Memo.query.filter_by(company=company).all()
            logger.info(f"Memos retrieved for company: {company}")
            return jsonify([memo.to_dict() for memo in memos])
        except Exception as e:
            logger.error(f"Error retrieving memos: {e}")
            return make_response({'error': 'Failed to retrieve memos'}, 500)

    def post(self):
        if 'user_id' not in session:
            logger.warning("Unauthorized memo creation attempt.")
            return make_response({'error': 'User not authenticated'}, 401)

        data = request.json
        try:
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
            logger.info(f"Memo '{new_memo.title}' created successfully.")

            # OPTIONAL: Send Email to client if 'email' is included in data
            client_email = data.get('email')
            if client_email:
                msg = Message(
                    subject="Your Memo Has Been Created",
                    sender=app.config['MAIL_USERNAME'],
                    recipients=[client_email]
                )
                msg.body = (
                    f"Hello,\n\n"
                    f"Your memo '{new_memo.title}' has been created.\n"
                    f"Memo Number: {new_memo.memo_number}\n"
                    f"Company: {new_memo.company}\n"
                    f"Items: {new_memo.items}\n"
                    "\nBest,\nOrnaCloud"
                )
                mail.send(msg)
                logger.info(f"Email sent to {client_email} for memo '{new_memo.title}'.")

            return jsonify({"message": "Memo created successfully!"}), 201
        except Exception as e:
            logger.error(f"Error during memo creation: {e}")
            return make_response({'error': 'Failed to create memo'}, 400)

# If your frontend calls "/memos", keep the next line as is:
api.add_resource(Memos, '/memos')
# If your frontend calls "/api/memos", rename it:
# api.add_resource(Memos, '/api/memos')


### Invoice Management Routes

class Invoices(Resource):
    def get(self):
        try:
            company = request.args.get('company')
            if not company:
                logger.error("Missing company parameter in invoice retrieval request.")
                return make_response({'error': 'Company parameter is required'}, 400)

            invoices = Invoice.query.filter_by(company=company).all()
            logger.info(f"Invoices retrieved for company: {company}")
            return jsonify([invoice.to_dict() for invoice in invoices])
        except Exception as e:
            logger.error(f"Error retrieving invoices: {e}")
            return make_response({'error': 'Failed to retrieve invoices'}, 500)

    def post(self):
        if 'user_id' not in session:
            logger.warning("Unauthorized invoice creation attempt.")
            return make_response({'error': 'User not authenticated'}, 401)

        data = request.json
        try:
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
            logger.info(f"Invoice '{new_invoice.title}' created successfully.")
            return jsonify({"message": "Invoice created successfully!"}), 201
        except Exception as e:
            logger.error(f"Error during invoice creation: {e}")
            return make_response({'error': 'Failed to create invoice'}, 400)

api.add_resource(Invoices, '/invoices')


# -----------------------------------------------------------------------
# NEW ROUTES MATCHING YOUR REACT FETCH CALLS
# -----------------------------------------------------------------------

class FutureMemos(Resource):
    def get(self, user_id):
        try:
            memos = Memo.query.filter_by(user_id=user_id).all()
            return jsonify([m.to_dict() for m in memos])
        except Exception as e:
            logger.error(f"Error retrieving future memos for user {user_id}: {e}")
            return make_response({'error': 'Failed to retrieve future memos'}, 500)

api.add_resource(FutureMemos, '/api/memos/<int:user_id>/future')


class FutureInvoices(Resource):
    def get(self, user_id):
        try:
            invoices = Invoice.query.filter_by(user_id=user_id).all()
            return jsonify([inv.to_dict() for inv in invoices])
        except Exception as e:
            logger.error(f"Error retrieving future invoices for user {user_id}: {e}")
            return make_response({'error': 'Failed to retrieve future invoices'}, 500)

api.add_resource(FutureInvoices, '/api/invoices/<int:user_id>/future')


class UserCompanies(Resource):
    def get(self, user_id):
        try:
            memos_companies = db.session.query(Memo.company).filter_by(user_id=user_id).distinct()
            invoices_companies = db.session.query(Invoice.company).filter_by(user_id=user_id).distinct()

            companies = set()
            for row in memos_companies:
                companies.add(row.company)
            for row in invoices_companies:
                companies.add(row.company)

            return jsonify(list(companies))
        except Exception as e:
            logger.error(f"Error retrieving companies for user {user_id}: {e}")
            return make_response({'error': 'Failed to retrieve companies'}, 500)

api.add_resource(UserCompanies, '/api/companies/<int:user_id>')


# -----------------------------------------------------------------------
# NEW ROUTE FOR CATEGORIES
# -----------------------------------------------------------------------
class Categories(Resource):
    def get(self):
        try:
            from models import Category
            categories = Category.query.all()
            return [cat.to_dict() for cat in categories], 200
        except Exception as e:
            logger.error(f"Error retrieving categories: {e}")
            return make_response({'error': 'Failed to retrieve categories'}, 500)

api.add_resource(Categories, '/api/categories')


### Start the Flask App
if __name__ == '__main__':
    app.run(port=5555, debug=True)












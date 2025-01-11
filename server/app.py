#!/usr/bin/env python3

# Standard library imports
import os
from flask import request, session, make_response
from models import User, Memo, Invoice, Category
from config import app, api, logger, bcrypt, db, mail
from flask_restful import Resource
from flask_mail import Message  # For sending emails
from flask_cors import CORS

# Enable CORS if needed
CORS(app, supports_credentials=True)

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
                return {'error': 'Missing required fields'}, 400

            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                logger.warning(f"Signup attempt failed: Username '{username}' already exists.")
                return {'error': 'Username already exists'}, 400

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
            return user.to_dict(), 201

        except Exception as e:
            logger.error(f"Error during signup: {e}")
            return {'error': 'Failed to sign up'}, 400

api.add_resource(Signup, '/signup')


class CheckSession(Resource):
    def get(self):
        try:
            user_id = session.get('user_id')
            if user_id:
                user = db.session.get(User, user_id)
                if user:
                    logger.info(f"Session check successful for user ID: {user.id}")
                    return user.to_dict(), 200
            logger.warning("Unauthorized session check attempt.")
            return {'error': 'No authorization'}, 401
        except Exception as e:
            logger.error(f"Error during session check: {e}")
            return {'error': 'Session check failed'}, 500

api.add_resource(CheckSession, '/check')


class Login(Resource):
    def post(self):
        params = request.json
        try:
            username = params.get('username')
            password = params.get('password')

            if not username or not password:
                logger.warning("Login attempt with missing username or password.")
                return {'error': 'Username and password are required'}, 400

            user = User.query.filter_by(username=username).first()

            if not user:
                logger.warning(f"Login attempt failed: User '{username}' not found.")
                return {'error': 'User not found'}, 404

            if bcrypt.check_password_hash(user.password, password):
                session['user_id'] = user.id
                logger.info(f"User '{username}' successfully logged in.")
                return user.to_dict(), 200
            else:
                logger.warning(f"Login attempt failed: Invalid password for user '{username}'.")
                return {'error': 'Invalid password'}, 401
        except Exception as e:
            logger.error(f"Error during login: {e}")
            return {'error': 'Failed to log in'}, 500

api.add_resource(Login, '/login')


class Logout(Resource):
    def delete(self):
        try:
            session.pop('user_id', None)
            logger.info("User logged out successfully.")
            return {}, 204
        except Exception as e:
            logger.error(f"Error during logout: {e}")
            return {'error': 'Failed to log out'}, 500

api.add_resource(Logout, '/logout')


### Memo Management Routes

class Memos(Resource):
    def get(self):
        try:
            company = request.args.get('company')
            if not company:
                logger.error("Missing company parameter in memo retrieval request.")
                return {'error': 'Company parameter is required'}, 400

            memos = Memo.query.filter_by(company=company).all()
            logger.info(f"Memos retrieved for company: {company}")

            serialized_memos = []
            for memo in memos:
                memo_dict = {
                    "id": memo.id,
                    "title": memo.title,
                    "memo_number": memo.memo_number,
                    "expiry_date": memo.expiry_date,
                    "wholesaler_details": memo.wholesaler_details,
                    "buyer_details": memo.buyer_details,
                    "items": memo.items,
                    "total_value": memo.total_value,
                    "remarks": memo.remarks,
                    "company": memo.company,
                    "user_id": memo.user_id,
                }
                serialized_memos.append(memo_dict)

            return serialized_memos, 200

        except Exception as e:
            logger.error(f"Error retrieving memos: {e}")
            return {'error': 'Failed to retrieve memos'}, 500

    def post(self):
        if 'user_id' not in session:
            logger.warning("Unauthorized memo creation attempt.")
            return {'error': 'User not authenticated'}, 401

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

            # OPTIONAL: Send Email to client if 'email' is included
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

            return {"message": "Memo created successfully!"}, 201
        except Exception as e:
            logger.error(f"Error during memo creation: {e}")
            return {'error': 'Failed to create memo'}, 400

api.add_resource(Memos, '/memos')


# -----------------------------------------------------------------------
# Invoices Management (Mirrors Memos) - Return dicts/lists, not jsonify()
# -----------------------------------------------------------------------
class Invoices(Resource):
    def get(self):
        try:
            company = request.args.get('company')
            if not company:
                logger.error("Missing company parameter in invoice retrieval request.")
                return {'error': 'Company parameter is required'}, 400

            invoices = Invoice.query.filter_by(company=company).all()
            logger.info(f"Invoices retrieved for company: {company}")

            serialized_invoices = []
            for inv in invoices:
                inv_dict = {
                    "id": inv.id,
                    "title": inv.title,
                    "invoice_number": inv.invoice_number,
                    "wholesaler_details": inv.wholesaler_details,
                    "buyer_details": inv.buyer_details,
                    "items": inv.items,
                    "total_value": inv.total_value,
                    "company": inv.company,
                    "user_id": inv.user_id,
                }
                serialized_invoices.append(inv_dict)

            return serialized_invoices, 200

        except Exception as e:
            logger.error(f"Error retrieving invoices: {e}")
            return {'error': 'Failed to retrieve invoices'}, 500

    def post(self):
        if 'user_id' not in session:
            logger.warning("Unauthorized invoice creation attempt.")
            return {'error': 'User not authenticated'}, 401

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

            # OPTIONAL: Send Email if 'email' included
            client_email = data.get('email')
            if client_email:
                msg = Message(
                    subject="Your Invoice Has Been Created",
                    sender=app.config['MAIL_USERNAME'],
                    recipients=[client_email]
                )
                msg.body = (
                    f"Hello,\n\n"
                    f"Your invoice '{new_invoice.title}' has been created.\n"
                    f"Invoice Number: {new_invoice.invoice_number}\n"
                    f"Company: {new_invoice.company}\n"
                    f"Items: {new_invoice.items}\n"
                    f"Total Value: {new_invoice.total_value}\n"
                    "\nBest,\nOrnaCloud"
                )
                mail.send(msg)
                logger.info(f"Email sent to {client_email} for invoice '{new_invoice.title}'.")

            return {"message": "Invoice created successfully!"}, 201

        except Exception as e:
            logger.error(f"Error during invoice creation: {e}")
            return {'error': 'Failed to create invoice'}, 400

api.add_resource(Invoices, '/invoices')


# -----------------------------------------------------------------------
# Single Invoice Resource (Mirrors MemoByID) - No jsonify() on return
# -----------------------------------------------------------------------
class InvoiceByID(Resource):
    def get(self, invoice_id):
        try:
            invoice = Invoice.query.get_or_404(invoice_id)
            inv_dict = {
                "id": invoice.id,
                "title": invoice.title,
                "invoice_number": invoice.invoice_number,
                "wholesaler_details": invoice.wholesaler_details,
                "buyer_details": invoice.buyer_details,
                "items": invoice.items,
                "total_value": invoice.total_value,
                "company": invoice.company,
                "user_id": invoice.user_id,
            }
            return inv_dict, 200
        except Exception as e:
            logger.error(f"Error retrieving invoice {invoice_id}: {e}")
            return {'error': 'Failed to retrieve invoice'}, 500

    def patch(self, invoice_id):
        if 'user_id' not in session:
            return {'error': 'User not authenticated'}, 401

        try:
            invoice = Invoice.query.get_or_404(invoice_id)
            # Ensure only the owner can modify
            if invoice.user_id != session['user_id']:
                return {'error': 'Unauthorized'}, 403

            data = request.json
            invoice.title = data.get('title', invoice.title)
            invoice.invoice_number = data.get('invoice_number', invoice.invoice_number)
            invoice.wholesaler_details = data.get('wholesaler_details', invoice.wholesaler_details)
            invoice.buyer_details = data.get('buyer_details', invoice.buyer_details)
            invoice.items = data.get('items', invoice.items)
            invoice.total_value = data.get('total_value', invoice.total_value)
            invoice.company = data.get('company', invoice.company)

            db.session.commit()
            logger.info(f"Invoice ID {invoice_id} updated successfully.")

            inv_dict = {
                "id": invoice.id,
                "title": invoice.title,
                "invoice_number": invoice.invoice_number,
                "wholesaler_details": invoice.wholesaler_details,
                "buyer_details": invoice.buyer_details,
                "items": invoice.items,
                "total_value": invoice.total_value,
                "company": invoice.company,
                "user_id": invoice.user_id,
            }
            return {
                'message': 'Invoice updated successfully',
                'invoice': inv_dict
            }, 200
        except Exception as e:
            logger.error(f"Error updating invoice {invoice_id}: {e}")
            return {'error': 'Failed to update invoice'}, 500

    def delete(self, invoice_id):
        if 'user_id' not in session:
            return {'error': 'User not authenticated'}, 401

        try:
            invoice = Invoice.query.get_or_404(invoice_id)
            # Ensure only the owner can delete
            if invoice.user_id != session['user_id']:
                return {'error': 'Unauthorized'}, 403

            db.session.delete(invoice)
            db.session.commit()
            logger.info(f"Invoice ID {invoice_id} deleted successfully.")
            return {'message': 'Invoice deleted successfully'}, 200
        except Exception as e:
            logger.error(f"Error deleting invoice {invoice_id}: {e}")
            return {'error': 'Failed to delete invoice'}, 500

api.add_resource(InvoiceByID, '/api/invoices/<int:invoice_id>')


# -----------------------------------------------------------------------
# Additional/Existing Routes (unchanged except removing jsonify in returns)
# -----------------------------------------------------------------------
class FutureMemos(Resource):
    def get(self, user_id):
        try:
            memos = Memo.query.filter_by(user_id=user_id).all()
            return [m.to_dict() for m in memos], 200
        except Exception as e:
            logger.error(f"Error retrieving future memos for user {user_id}: {e}")
            return {'error': 'Failed to retrieve future memos'}, 500

api.add_resource(FutureMemos, '/api/memos/<int:user_id>/future')


class FutureInvoices(Resource):
    def get(self, user_id):
        try:
            invoices = Invoice.query.filter_by(user_id=user_id).all()
            return [inv.to_dict() for inv in invoices], 200
        except Exception as e:
            logger.error(f"Error retrieving future invoices for user {user_id}: {e}")
            return {'error': 'Failed to retrieve future invoices'}, 500

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

            return list(companies), 200
        except Exception as e:
            logger.error(f"Error retrieving companies for user {user_id}: {e}")
            return {'error': 'Failed to retrieve companies'}, 500

api.add_resource(UserCompanies, '/api/companies/<int:user_id>')


class Categories(Resource):
    def get(self):
        try:
            from models import Category
            categories = Category.query.all()
            return [cat.to_dict() for cat in categories], 200
        except Exception as e:
            logger.error(f"Error retrieving categories: {e}")
            return {'error': 'Failed to retrieve categories'}, 500

api.add_resource(Categories, '/api/categories')


# -----------------------------------------------------------------------
# ADDED RESOURCE FOR INDIVIDUAL MEMO (GET, PATCH, DELETE)
# -----------------------------------------------------------------------
class MemoByID(Resource):
    def get(self, memo_id):
        try:
            memo = Memo.query.get_or_404(memo_id)
            memo_dict = {
                "id": memo.id,
                "title": memo.title,
                "memo_number": memo.memo_number,
                "expiry_date": memo.expiry_date,
                "wholesaler_details": memo.wholesaler_details,
                "buyer_details": memo.buyer_details,
                "items": memo.items,
                "total_value": memo.total_value,
                "remarks": memo.remarks,
                "company": memo.company,
                "user_id": memo.user_id,
            }
            return memo_dict, 200
        except Exception as e:
            logger.error(f"Error retrieving memo {memo_id}: {e}")
            return {'error': 'Failed to retrieve memo'}, 500

    def patch(self, memo_id):
        if 'user_id' not in session:
            return {'error': 'User not authenticated'}, 401

        try:
            memo = Memo.query.get_or_404(memo_id)
            if memo.user_id != session['user_id']:
                return {'error': 'Unauthorized'}, 403

            data = request.json
            memo.title = data.get('title', memo.title)
            memo.memo_number = data.get('memo_number', memo.memo_number)
            memo.expiry_date = data.get('expiry_date', memo.expiry_date)
            memo.wholesaler_details = data.get('wholesaler_details', memo.wholesaler_details)
            memo.buyer_details = data.get('buyer_details', memo.buyer_details)
            memo.items = data.get('items', memo.items)
            memo.total_value = data.get('total_value', memo.total_value)
            memo.remarks = data.get('remarks', memo.remarks)
            memo.company = data.get('company', memo.company)

            db.session.commit()
            logger.info(f"Memo ID {memo_id} updated successfully.")

            memo_dict = {
                "id": memo.id,
                "title": memo.title,
                "memo_number": memo.memo_number,
                "expiry_date": memo.expiry_date,
                "wholesaler_details": memo.wholesaler_details,
                "buyer_details": memo.buyer_details,
                "items": memo.items,
                "total_value": memo.total_value,
                "remarks": memo.remarks,
                "company": memo.company,
                "user_id": memo.user_id,
            }
            return {
                'message': 'Memo updated successfully',
                'memo': memo_dict
            }, 200
        except Exception as e:
            logger.error(f"Error updating memo {memo_id}: {e}")
            return {'error': 'Failed to update memo'}, 500

    def delete(self, memo_id):
        if 'user_id' not in session:
            return {'error': 'User not authenticated'}, 401

        try:
            memo = Memo.query.get_or_404(memo_id)
            if memo.user_id != session['user_id']:
                return {'error': 'Unauthorized'}, 403

            db.session.delete(memo)
            db.session.commit()
            logger.info(f"Memo ID {memo_id} deleted successfully.")
            return {'message': 'Memo deleted successfully'}, 200
        except Exception as e:
            logger.error(f"Error deleting memo {memo_id}: {e}")
            return {'error': 'Failed to delete memo'}, 500

api.add_resource(MemoByID, '/api/memos/<int:memo_id>')


### Start the Flask App
if __name__ == '__main__':
    app.run(port=5555, debug=True)

















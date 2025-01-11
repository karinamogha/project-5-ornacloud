# Welcome to OrnaCloud

Efficiently Manage Your Memos and Invoices

OrnaCloud provides a seamless platform to help businesses of all types manage memos and invoices efficiently. Whether you're a wholesaler, designer, or individual, OrnaCloud is tailored to suit your organizational needs. This README provides detailed instructions on how to get started with OrnaCloud, its features, and how to deploy it.

---

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Installation](#installation)
4. [Available Scripts](#available-scripts)
5. [Usage](#usage)
6. [Deployment](#deployment)
7. [Contributing](#contributing)
8. [Support](#support)

---

## Features

- **Efficient Document Management:**
  - View, create, and manage memos and invoices from a single platform.
  - Organize documents in personal folders for easy access.

- **User-Friendly Interface:**
  - Simplified forms for creating memos and invoices.
  - Visual dashboard to navigate between functionalities.

- **Secure Access:**
  - Register and manage your account with secure authentication.
  - Personal dashboards for users to monitor their activities.

- **Quick Communication:**
  - Send memos and invoices directly to clients from the platform.

---

## Technology Stack

OrnaCloud is built using the following technologies:

- **Frontend:** React.js
- **Backend:** Flask (Python)
- **Database:** SQLite (Development) / PostgreSQL (Production)
- **Styling:** TailwindCSS
- **API Communication:** RESTful API

---

## Installation

To set up OrnaCloud locally, follow these steps:

### Prerequisites

Ensure you have the following installed:

- Node.js (https://nodejs.org)
- Python 3.x (https://python.org)
- pip (Python package manager)
- npm or yarn

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ornacloud.git
   cd ornacloud
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Define variables like `SECRET_KEY`, `DATABASE_URL`, etc.

5. Run database migrations:
   ```bash
   cd backend
   flask db upgrade
   ```

---

## Available Scripts

### Backend

In the `backend` directory, you can run:

- `flask run`: Start the Flask development server.

### Frontend

In the `frontend` directory, you can run:

- `npm start`: Start the React development server.
- `npm test`: Launch the test runner in interactive mode.
- `npm run build`: Build the app for production to the `build` folder.

---

## Usage

### Creating a Memo or Invoice

1. Navigate to the dashboard after logging in.
2. Click on "Create Memo" or "Create Invoice."
3. Fill out the required fields and submit the form.
4. Send the memo or invoice to clients or save it in your personal folder.

### Viewing Documents

1. Go to the "Memos" or "Invoices" section from the navigation menu.
2. Select a document to view its details.

### Managing Your Account

1. Access your account settings from the dashboard.
2. Update your profile or change your password as needed.

---

## Deployment

To deploy OrnaCloud for production:

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Configure the backend:**
   - Set the `FLASK_ENV` to `production`.
   - Use a production-ready database like PostgreSQL.

3. **Serve the application:**
   - Use a production server like Gunicorn for the backend.
   - Use Nginx or Apache to serve the built frontend.

4. **Environment Variables:**
   - Ensure all required variables are properly set in a secure `.env` file.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`feature/new-feature`).
3. Commit your changes and push the branch.
4. Open a Pull Request describing your changes.

---

## Support

For support or questions, please open an issue in the repository or contact support at `support@ornacloud.com`.

---

Start managing your memos and invoices efficiently with OrnaCloud today!



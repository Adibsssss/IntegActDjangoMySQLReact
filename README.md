# 🗄️ React + Django + MySQL Full-Stack Web Application

A full-stack web application built with **React** (frontend), **Django** (backend), and **MySQL via XAMPP** (database). Features superuser authentication, database record insertion, and record retrieval through defined HTTP URL routes.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [1. Database Setup (XAMPP)](#1-database-setup-xampp)
  - [2. Django Backend Setup](#2-django-backend-setup)
  - [3. React Frontend Setup](#3-react-frontend-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Default Credentials](#default-credentials)
- [Troubleshooting](#troubleshooting)

---

## Overview

This application demonstrates full-stack integration between a React frontend and a Django REST backend connected to a MySQL database. It includes:

- Admin **login/logout** system restricted to Django superusers
- A `/add` endpoint that **inserts** a text record into the database
- A `/show` endpoint that **retrieves and displays** all stored records
- A React UI with **Tailwind CSS** styling that consumes both endpoints

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React, Tailwind CSS v3  |
| Backend    | Django, Django REST Framework |
| Database   | MySQL (via XAMPP)       |
| Auth       | Django Session Auth (Superuser) |
| CORS       | django-cors-headers     |

---

## Project Structure

```
myproject/
├── venv/                          # Python virtual environment
│
├── backend/                       # Django project root
│   ├── backend/
│   │   ├── __init__.py            # PyMySQL install (if used)
│   │   ├── settings.py            # Django configuration
│   │   ├── urls.py                # Root URL configuration
│   │   └── wsgi.py
│   ├── records/                   # Django app
│   │   ├── admin.py               # Admin panel registration
│   │   ├── models.py              # Record model (database table)
│   │   ├── views.py               # Login, logout, add, show views
│   │   └── urls.py                # App-level URL routes
│   └── manage.py
│
└── frontend/                      # React app
    ├── public/
    ├── src/
    │   ├── App.js                 # Main app with Login + Dashboard
    │   └── index.css              # Tailwind directives
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## Prerequisites

Make sure the following are installed on your machine before proceeding:

- [Python 3.x](https://www.python.org/downloads/)
- [Node.js & npm](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/) (for MySQL)
- pip (comes with Python)

---

## Installation & Setup

### 1. Database Setup (XAMPP)

1. Open the **XAMPP Control Panel**
2. Start both **Apache** and **MySQL**
3. Click **Admin** next to MySQL to open **phpMyAdmin**
4. Click the **SQL** tab and run the following:

```sql
CREATE DATABASE django_react_db;
```

---

### 2. Django Backend Setup

**Step 1 — Create project folder and virtual environment**

```bash
mkdir myproject
cd myproject
python -m venv venv
```

Activate the virtual environment:

```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

**Step 2 — Install Python dependencies**

```bash
pip install django mysqlclient djangorestframework django-cors-headers
```

> ⚠️ If `mysqlclient` fails on Windows, use `PyMySQL` instead:
> ```bash
> pip install PyMySQL
> ```
> Then add this to `backend/backend/__init__.py`:
> ```python
> import pymysql
> pymysql.install_as_MySQLdb()
> ```

**Step 3 — Create Django project and app**

```bash
django-admin startproject backend
cd backend
python manage.py startapp records
```

**Step 4 — Configure `backend/settings.py`**

Update `INSTALLED_APPS`:
```python
INSTALLED_APPS = [
    ...
    'rest_framework',
    'corsheaders',
    'records',
]
```

Add `corsheaders` at the TOP of `MIDDLEWARE`:
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]
```

Replace the `DATABASES` section:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'django_react_db',
        'USER': 'root',
        'PASSWORD': '',        # XAMPP default is empty
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}
```

Add at the bottom of `settings.py`:
```python
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_HTTPONLY = False
```

**Step 5 — Run database migrations**

```bash
python manage.py makemigrations
python manage.py migrate
```

This creates the `records_record` table in your MySQL database.

**Step 6 — Create a superuser**

```bash
python manage.py createsuperuser
```

Follow the prompts to set a username, email, and password.

**Step 7 — Start the Django server**

```bash
python manage.py runserver
```

---

### 3. React Frontend Setup

Open a **new terminal**, navigate back to `myproject/`, then:

**Step 1 — Create the React app**

```bash
npx create-react-app frontend
cd frontend
```

**Step 2 — Install Tailwind CSS v3**

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

> If `npx tailwindcss init -p` fails, try:
> ```bash
> .\node_modules\.bin\tailwindcss init -p
> ```
> Or create `tailwind.config.js` and `postcss.config.js` manually (see Troubleshooting).

**Step 3 — Configure `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**Step 4 — Update `src/index.css`**

Replace the entire file content with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 5 — Start the React app**

```bash
npm start
```

---

## Running the Application

| Service         | Command                        | URL                          |
|-----------------|-------------------------------|------------------------------|
| XAMPP MySQL     | Start via XAMPP Control Panel  | `localhost:3306`             |
| Django Backend  | `python manage.py runserver`   | `http://127.0.0.1:8000`      |
| React Frontend  | `npm start`                    | `http://localhost:3000`      |
| Django Admin    | *(backend must be running)*    | `http://127.0.0.1:8000/admin`|

---

## API Endpoints

| Method | Endpoint  | Description                              | Auth Required |
|--------|-----------|------------------------------------------|---------------|
| POST   | `/login`  | Authenticate superuser                   | No            |
| GET    | `/logout` | Log out current session                  | Yes           |
| GET    | `/add`    | Insert a new text record into database   | No            |
| GET    | `/show`   | Retrieve and display all stored records  | No            |

### Example Responses

**`/add`**
```json
{
  "status": "success",
  "message": "Record inserted into database",
  "record": {
    "id": 1,
    "text": "Hello from Django! Record added successfully.",
    "created_at": "2025-01-01T12:00:00"
  }
}
```

**`/show`**
```json
{
  "status": "success",
  "count": 2,
  "records": [
    { "id": 1, "text": "Hello from Django! Record added successfully.", "created_at": "2025-01-01T12:00:00" },
    { "id": 2, "text": "Hello from Django! Record added successfully.", "created_at": "2025-01-01T12:05:00" }
  ]
}
```

---

## Features

- 🔐 **Superuser Login** — Only Django superusers can access the dashboard
- ➕ **Add Record** — Inserts a record into MySQL via the `/add` route
- 📋 **Show Records** — Fetches and displays all records via the `/show` route
- 🛠 **Admin Panel Link** — Direct link to Django's built-in admin interface
- 🚪 **Logout** — Clears session and returns to the login screen
- 📱 **Responsive UI** — Styled with Tailwind CSS v3

---

## Default Credentials

These are the credentials you set when running `python manage.py createsuperuser`.

| Field    | Value              |
|----------|--------------------|
| Username | *(your choice)*    |
| Password | *(your choice)*    |
| Email    | *(your choice)*    |

> Only accounts with `is_superuser = True` are allowed to log in through the React app.

---

## Troubleshooting

### ❌ `tailwind` is not recognized
Install Tailwind v3 explicitly:
```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

### ❌ PostCSS / Tailwind v4 error
You likely have Tailwind v4 installed. Downgrade:
```bash
npm uninstall tailwindcss
npm install -D tailwindcss@3 postcss autoprefixer
```

### ❌ MySQL connection error
- Confirm XAMPP MySQL is running on port 3306
- Confirm the database `django_react_db` exists in phpMyAdmin
- Confirm `PASSWORD` in `settings.py` is empty `''` (XAMPP default)

### ❌ `mysqlclient` install fails
Switch to PyMySQL:
```bash
pip install PyMySQL
```
Add to `backend/backend/__init__.py`:
```python
import pymysql
pymysql.install_as_MySQLdb()
```

### ❌ CORS error in browser
Ensure `corsheaders.middleware.CorsMiddleware` is the **first** item in the `MIDDLEWARE` list in `settings.py`.

### ❌ Login returns "not a superuser"
Make sure you created the user with `python manage.py createsuperuser` (not a regular user). You can verify in the Django admin panel at `http://127.0.0.1:8000/admin`.

---

## Changing the Superuser Password

```bash
python manage.py changepassword <username>
```

---

*Built with Django, React, MySQL, and Tailwind CSS.*

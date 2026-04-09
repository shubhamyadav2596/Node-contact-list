# Contact Management API

A robust Node.js backend REST API for managing contacts. It features bulk uploading via Excel files (`.xlsx`), duplicate prevention at the database level, and full CRUD (Create, Read, Update, Delete) capabilities with search and pagination support.

## 🚀 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MySQL (via XAMPP)
* **ORM:** Sequelize
* **File Handling:** Multer (Memory Storage)
* **Excel Parsing:** `xlsx` library

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
1.  [Node.js](https://nodejs.org/) (v14 or higher)
2.  [XAMPP](https://www.apachefriends.org/) (For local MySQL Server and phpMyAdmin)

---

## 🛠️ Installation & Setup Guide

### 1. Database Setup (via XAMPP)
1. Open the **XAMPP Control Panel**.
2. Start the **Apache** and **MySQL** modules.
3. Open your browser and go to `http://localhost/phpmyadmin`.
4. Click on **New** on the left sidebar.
5. Create a new database named exactly: `contacts_db`.
 *(Note: You do not need to create any tables manually. The application uses Sequelize to automatically generate the `Contacts` table when the server starts).*

### 2. Project Setup
Clone this repository or navigate to your project folder in the terminal:
```bash
# Install all required dependencies
npm install 
```

### 3. Environment Variables
Create a .env file in the root directory of your project and add the following configuration. (These are the default XAMPP MySQL credentials):

```code snippet
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=contacts_db
```

### 4. Start the Server
Run the following command to start the API:
```Bash
node index.js
```
You should see the following in your terminal:

```
Database connected and models synchronized.
Server is running on http://localhost:3000
```


## 📄 API Endpoints Documentation

### 1. Upload Contacts via Excel
(i) URL: /api/contacts/upload
(ii) Method: POST
(iii) Content-Type: multipart/form-data
(iv) Body: Form-data with a key named file (Type: File) and an .xlsx file as the value.
(v) Excel Format Rules: The first row must contain exact headers: Name, Email, and Phone.
(vi) Success Response: 201 Created

### 2. Get All Contacts (with Search & Pagination)
(i) URL: /api/contacts
(ii) Method: GET
(iii) Query Parameters (Optional):
 - page: Page number (default: 1)
 - limit: Items per page (default: 10)
 - search: Global search string for name, email, or phone.
(iv) Example: /api/contacts?page=1&limit=5&search=Rahul
(v) Success Response: 200 OK (Returns total items, pages, and an array of contact data).

### 3. Update a Contact
(i) URL: /api/contacts/:id
(ii)Method: PUT
(iii)Content-Type: application/json
(iv) Body:
```JSON
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "9998887776"
}
```
(v) Success Response: 200 OK

### 4. Delete a Contact
(i) URL: /api/contacts/:id
(ii) Method: DELETE
(iii)Success Response: 200 OK


## 🧪 Testing the File Upload without Postman
If you encounter issues testing the file upload via Postman, you can use the included test.html file (if created) or create a simple HTML file with the following form:

```HTML
<form action="http://localhost:3000/api/contacts/upload" method="POST" enctype="multipart/form-data">
    <input type="file" name="file" accept=".xlsx" required>
    <button type="submit">Upload</button>
</form>
```
Open the HTML file in any browser, choose your .xlsx file, and click Upload.
# E-commerce Platform

A complete E-commerce platform built with Node.js, Express, MongoDB, and EJS templating engine. Features JWT authentication, role-based access control, and multi-user support.

## Features

### 🔐 Authentication & Authorization
- JWT token-based authentication
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt
- Cookie-based session management
- User registration and login/logout

### 🛍️ Product Management
- CRUD operations for products
- User-specific product ownership
- Product categorization
- Image upload support with multer
- Image URL support (alternative)
- Stock management
- Soft delete functionality

### 📂 Category Management
- Admin-only category CRUD operations
- Category-product relationships
- Category filtering for products
- Validation to prevent deletion of categories with products

### 👥 Multi-User Support
- Each user can manage their own products
- Admin users can manage all products and categories
- User-specific product views
- Role-based navigation

### 🎨 Modern UI/UX
- Responsive Bootstrap 5 design
- Font Awesome icons
- Hover effects and animations
- Mobile-friendly navigation
- Clean and intuitive interface

## Project Structure

```
Node Exam/
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User model with roles
│   ├── Product.js           # Product model with category refs
│   └── Category.js          # Category model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product CRUD routes
│   └── categories.js        # Category management routes
├── views/
│   ├── partials/
│   │   └── navbar.ejs       # Navigation component
│   ├── login.ejs            # Login form
│   ├── register.ejs         # Registration form
│   ├── productList.ejs      # All products view
│   ├── myProducts.ejs       # User's products view
│   ├── productForm.ejs      # Add/edit product form
│   ├── productItem.ejs      # Single product view
│   ├── categoryList.ejs     # Categories list view
│   └── categoryForm.ejs     # Add/edit category form
├── server.js                # Main application file
├── package.json             # Dependencies and scripts
└── README.md               # Project documentation
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Node Exam
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   - Make sure MongoDB is running on your system
   - The application will connect to `mongodb://localhost:27017/ecommerce_platform`

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the application**
   - Open your browser and go to `http://localhost:3000`

## Dependencies

- **express**: Web framework
- **ejs**: Template engine
- **body-parser**: Request body parsing
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT token handling
- **cookie-parser**: Cookie parsing
- **bcrypt**: Password hashing
- **multer**: File upload handling

## API Endpoints

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Login user
- `GET /auth/register` - Registration page
- `POST /auth/register` - Register user
- `GET /auth/logout` - Logout user

### Products
- `GET /products` - All products (public)
- `GET /products/my-products` - User's products (authenticated)
- `GET /products/add` - Add product form (authenticated)
- `POST /products/add` - Create product (authenticated)
- `GET /products/edit/:id` - Edit product form (owner/admin)
- `POST /products/edit/:id` - Update product (owner/admin)
- `GET /products/delete/:id` - Delete product (owner/admin)
- `GET /products/:id` - View single product (public)

### Categories
- `GET /categories` - All categories (public)
- `GET /categories/add` - Add category form (admin only)
- `POST /categories/add` - Create category (admin only)
- `GET /categories/edit/:id` - Edit category form (admin only)
- `POST /categories/edit/:id` - Update category (admin only)
- `GET /categories/delete/:id` - Delete category (admin only)
- `GET /categories/:id/products` - Products by category (public)

## User Roles

### Regular User
- Can register and login
- Can create, edit, and delete their own products
- Can view all products and categories
- Can view their own products

### Admin User
- All regular user permissions
- Can manage all products (edit/delete any product)
- Can create, edit, and delete categories
- Can view all user data

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Different permissions for different user roles
- **Input Validation**: Form validation and sanitization
- **Soft Deletes**: Products are soft-deleted to maintain data integrity
- **Category Protection**: Categories with products cannot be deleted

## Database Models

### User Model
- `username`: Unique username
- `email`: Unique email address
- `password`: Hashed password
- `role`: User role (admin/user)
- `createdAt`: Account creation timestamp

### Product Model
- `name`: Product name
- `description`: Product description
- `price`: Product price
- `category`: Reference to Category model
- `createdBy`: Reference to User model
- `imageUrl`: Product image URL (uploaded file or external URL)
- `stock`: Available stock quantity
- `isActive`: Soft delete flag
- `createdAt/updatedAt`: Timestamps

### Category Model
- `name`: Unique category name
- `description`: Category description
- `createdBy`: Reference to User model (admin)
- `createdAt`: Creation timestamp

## Features Implemented

✅ **Project Setup (5 points)**
- Node.js project initialization
- All required dependencies installed
- Express server setup

✅ **MongoDB Setup (5 points)**
- MongoDB connection
- Product, Category, and User collections
- Mongoose models defined

✅ **User Model with Roles (5 points)**
- Enhanced User model with username, password, role
- Role-based access control (admin/user)
- Secure password hashing with bcrypt

✅ **Authentication Controller (10 points)**
- Registration and login routes
- JWT token issuance and cookie storage
- User roles in JWT payload
- Cookie-parser configuration
- Logout route with token clearing

✅ **Middleware and Routing (10 points)**
- JWT token verification middleware
- User information extraction middleware
- Protected route middleware
- Role-based route protection
- CRUD routes for products and categories

✅ **User-Specific Products (10 points)**
- User model with product references
- Multi-user product support
- User-specific product filtering

✅ **Category Support (10 points)**
- Category CRUD controllers
- Product-category associations
- Category-based product filtering

✅ **View Structure (5 points)**
- All required EJS views created
- Responsive and modern UI design
- Bootstrap 5 integration

✅ **Navbar (5 points)**
- Responsive navigation bar
- User authentication status display
- Role-based navigation links
- Modern and visually appealing design

## Running the Application

1. **Start MongoDB** (if not already running)
2. **Install dependencies**: `npm install`
3. **Start the server**: `npm start`
4. **Access the application**: `http://localhost:3000`

## Default Admin User

To create an admin user, you can either:
1. Register a new user and manually update the role in the database
2. Use MongoDB Compass or mongo shell to update the user role

```javascript
// In MongoDB shell
use ecommerce_platform
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License. 
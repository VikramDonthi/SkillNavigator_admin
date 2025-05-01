Installation and Running
Create the project folder and navigate to it:

bash
mkdir skill-navigator-admin
cd skill-navigator-admin
Initialize the project and install dependencies:

bash
npm init -y
npm install dotenv ejs express express-session mongoose morgan
npm install nodemon --save-dev
Create all the files and folders as shown in the structure above.

Start the development server:

bash
npm run dev
Open your browser and navigate to http://localhost:5000

Features
Authentication: Simple login with predefined credentials (admin/admin123)

Dashboard: View all job listings in a table

CRUD Operations:

Create: Add new job listings

Read: View all listings

Update: Edit existing listings

Delete: Remove listings

Responsive Design: Works on different screen sizes

Form Validation: Basic validation for required fields

Accessing the Application
Go to http://localhost:5000/login

Log in with:

Username: admin

Password: admin123

You'll be redirected to the dashboard where you can manage your job listings

The application is now ready to use with your MongoDB data! You can perform all CRUD operations through the web interface.
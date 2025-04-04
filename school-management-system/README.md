# School Management System

This is a web application for managing a school system, built using Node.js and MySQL. The application supports three types of users: Admin, Teacher, and Student, each with specific functionalities.

## Features

- **Admin Login**: 
  - View the list of teachers.
  - Assign teachers to classes.

- **Teacher Login**: 
  - Mark attendance using a date picker.
  - Update attendance records for each date.
  - View previous attendance records.
  - Update marks for four subjects: English, Sinhala, IT, and Maths.
  - View term test marks for each student.

- **Student Login**: 
  - View personal timetable.
  - View marks for each subject.

## Project Structure

```
school-management-system
├── src
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── utils
│   └── app.js
├── public
│   ├── css
│   ├── js
│   └── index.html
├── views
│   ├── admin
│   ├── student
│   └── teacher
├── package.json
├── README.md
└── .env
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd school-management-system
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your database connection details:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   ```

5. Start the application:
   ```
   npm start
   ```

## Usage

- Access the application through your web browser at `http://localhost:3000`.
- Use the appropriate login credentials for Admin, Teacher, or Student to access their respective functionalities.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you would like to add.

## License

This project is licensed under the MIT License.
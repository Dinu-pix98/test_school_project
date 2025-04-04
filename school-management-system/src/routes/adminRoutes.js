const express = require('express');
const AdminController = require('../controllers/adminController');
const router = express.Router();
const adminController = new AdminController();
const db = require('../utils/db'); // Import the database pool

// Define routes
router.get('/dashboard', (req, res) => adminController.getDashboard(req, res));
router.get('/teachers', async (req, res) => {
    try {
        const [teachers] = await db.query('SELECT id, username, email FROM users WHERE role = "teacher"');
        console.log('Teachers:', teachers); // Debugging: Check if teachers data is fetched
        res.render('admin/teachers', { teachers }); // Pass teachers to the view
    } catch (err) {
        console.error('Error fetching teachers:', err);
        res.status(500).send('An error occurred while fetching teachers');
    }
});
router.get('/assign-teacher', async (req, res) => {
    try {
        const [teachers] = await db.query('SELECT id, username FROM users WHERE role = "teacher"');
        const [grades] = await db.query('SELECT id, grade_name FROM grades');
        res.render('admin/assignTeacher', { teachers, grades });
    } catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).send('Error retrieving data');
    }
});
router.post('/assign-teacher', async (req, res) => {
    const { teacherId, gradeId } = req.body; // Get teacherId and gradeId from the form submission
    console.log('Teacher ID:', teacherId); // Debugging: Check teacherId
    console.log('Grade ID:', gradeId); // Debugging: Check gradeId

    const query = 'UPDATE grades SET teacher_id = ? WHERE id = ?';
    const db = require('../utils/db');

    try {
        const connection = await db.getConnection(); // Get a connection from the pool
        try {
            const [results] = await connection.query(query, [teacherId, gradeId]);
            console.log('Teacher assigned successfully:', results); // Debugging: Check if the query was successful
            res.redirect('/admin/'); // Redirect to the admin dashboard (root of admin)
        } catch (err) {
            console.error('Error assigning teacher to grade:', err);
            res.status(500).send('Error assigning teacher to grade');
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).send('Database connection error');
    }
});
router.get('/register-teacher', (req, res) => {
    res.render('admin/registerTeacher'); // Render the registerTeacher.ejs view
});
router.post('/register-teacher', async (req, res) => {
    const { name, email, password } = req.body; // Get teacher details from the form
    try {
        const hashedPassword = require('crypto').createHash('sha256').update(password).digest('hex'); // Hash the password
        const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "teacher")';

        // Use db.query() directly for simple queries
        const [results] = await db.query(query, [name, email, hashedPassword]);
        console.log('Teacher registered successfully:', results); // Debugging: Check if the query was successful
        res.redirect('/admin/teachers'); // Redirect to the list of teachers
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            console.error('Duplicate entry error:', err);
            res.status(400).send('A user with this username or email already exists.');
        } else {
            console.error('Error registering teacher:', err);
            res.status(500).send('An error occurred while registering the teacher');
        }
    }
});

router.get('/register-student', async (req, res) => {
    try {
        const [grades] = await db.query('SELECT id, grade_name FROM grades'); // Fetch grades
        res.render('admin/registerStudent', { grades }); // Pass grades to the view
    } catch (err) {
        console.error('Error retrieving grades:', err);
        res.status(500).send('Error retrieving grades');
    }
});

router.post('/register-student', async (req, res) => {
    const { name, email, classId } = req.body; // Get student details and class ID from the form
    try {
        const query = 'INSERT INTO students (student_name, email, class_id) VALUES (?, ?, ?)';
        const [results] = await db.query(query, [name, email, classId]);
        console.log('Student registered successfully:', results); // Debugging: Check if the query was successful
        res.redirect('/admin/students'); // Redirect to the list of students
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            console.error('Duplicate entry error:', err);
            res.status(400).send('A student with this email already exists.');
        } else {
            console.error('Error registering student:', err);
            res.status(500).send('An error occurred while registering the student');
        }
    }
});

router.get('/students', async (req, res) => {
    try {
        const query = `
            SELECT students.id, students.student_name, students.email, grades.grade_name
            FROM students
            JOIN grades ON students.class_id = grades.id
        `;
        const [students] = await db.query(query);
        res.render('admin/students', { students }); // Render the students.ejs view and pass the students data
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).send('An error occurred while fetching students');
    }
});

router.get('/grades', async (req, res) => {
    try {
        const query = 'SELECT id, grade_name FROM grades'; // Fetch all grades
        const [grades] = await db.query(query);
        res.render('admin/grades', { grades }); // Render the grades.ejs view
    } catch (err) {
        console.error('Error fetching grades:', err);
        res.status(500).send('An error occurred while fetching grades');
    }
});

router.get('/grades/:classId', async (req, res) => {
    const { classId } = req.params; // Get the class ID from the URL
    try {
        const query = `
            SELECT students.id, students.student_name, students.email, grades.grade_name
            FROM students
            JOIN grades ON students.class_id = grades.id
            WHERE grades.id = ?
        `;
        const [students] = await db.query(query, [classId]);
        res.render('admin/classStudents', { students }); // Render the classStudents.ejs view
    } catch (err) {
        console.error('Error fetching students for class:', err);
        res.status(500).send('An error occurred while fetching students for the class');
    }
});

// Define the /admin route
router.get('/', (req, res) => {
    res.render('admin/dashboard'); // Render the admin dashboard view
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/'); // Redirect to the home page
    });
});

module.exports = router;
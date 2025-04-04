const express = require('express');
const StudentController = require('../controllers/studentController');
const db = require('../utils/db'); // Import the database pool

const router = express.Router();
const studentController = new StudentController();

// Render the Student Login Page
router.get('/', (req, res) => {
    res.render('student/login'); // Render the login.ejs view for students
});

// Handle Student Login
router.post('/login', async (req, res) => {
    const { email } = req.body; // Get the email from the form
    try {
        const query = 'SELECT * FROM students WHERE email = ?';
        const [results] = await db.query(query, [email]);

        if (results.length > 0) {
            req.session.studentId = results[0].id; // Store student ID in the session
            res.redirect('/student/dashboard'); // Redirect to the student dashboard
        } else {
            res.status(401).send('Invalid email. Please try again.');
        }
    } catch (err) {
        console.error('Error during student login:', err);
        res.status(500).send('An error occurred during login');
    }
});

// Render the Student Dashboard
router.get('/dashboard', async (req, res) => {
    const studentId = req.session.studentId; // Get the student ID from the session
    if (!studentId) {
        return res.redirect('/student'); // Redirect to login if not logged in
    }

    try {
        // Fetch student details and class ID
        const studentQuery = `
            SELECT students.student_name, grades.grade_name, students.class_id
            FROM students
            JOIN grades ON students.class_id = grades.id
            WHERE students.id = ?
        `;
        const [studentResults] = await db.query(studentQuery, [studentId]);

        if (studentResults.length === 0) {
            return res.status(404).send('Student not found');
        }

        const student = studentResults[0];

        // Fetch timetable for the student's class
        const timetableQuery = `
            SELECT day_of_week, subject, start_time, end_time
            FROM timetables
            WHERE class_id = ?
            ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time
        `;
        const [timetable] = await db.query(timetableQuery, [student.class_id]);

        res.render('student/dashboard', { student, timetable }); // Render the dashboard view
    } catch (err) {
        console.error('Error fetching student dashboard:', err);
        res.status(500).send('An error occurred while fetching the dashboard');
    }
});

// Define routes
router.get('/timetable', (req, res) => studentController.getTimetable(req, res));
router.get('/marks', (req, res) => studentController.getMarks(req, res));

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/student'); // Redirect to the student login page
    });
});

module.exports = router;
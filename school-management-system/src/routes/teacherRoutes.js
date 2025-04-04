const express = require('express');
const TeacherController = require('../controllers/teacherController');
const db = require('../utils/db'); // Import the database pool

const router = express.Router();
const teacherController = new TeacherController();

// Define routes
router.post('/mark-attendance', (req, res) => teacherController.markAttendance(req, res));
router.get('/attendance', (req, res) => teacherController.getAttendance(req, res));
router.post('/update-marks', (req, res) => teacherController.updateMarks(req, res));
router.get('/marks', (req, res) => teacherController.getMarks(req, res));

// Render the teacher login page
router.get('/teacher', (req, res) => {
    res.render('teacher/login'); // Render the login.ejs file for teacher login
});

// Teacher Login Route
router.post('/teacher/login', async (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ? AND role = "teacher"';
    const hashedPassword = require('crypto').createHash('sha256').update(password).digest('hex');

    try {
        const [results] = await db.query(query, [email, hashedPassword]);
        if (results.length > 0) {
            req.session.teacherId = results[0].id; // Store teacherId in the session
            res.redirect('/teacher/dashboard'); // Redirect to the teacher dashboard
        } else {
            res.send('Invalid email or password');
        }
    } catch (err) {
        console.error('Error during teacher login:', err);
        res.status(500).send('Error during login');
    }
});

// Teacher Dashboard Route
router.get('/teacher/dashboard', async (req, res) => {
    const teacherId = req.session.teacherId; // Ensure teacherId is stored in the session after login
    if (!teacherId) {
        return res.redirect('/teacher'); // Redirect to login if teacherId is not found
    }

    try {
        const [results] = await db.query('SELECT id, grade_name FROM grades WHERE teacher_id = ?', [teacherId]);
        console.log('Assigned Classes:', results); // Debugging: Check the query results
        res.render('teacher/dashboard', { classes: results }); // Pass the classes to the view
    } catch (err) {
        console.error('Error fetching assigned classes:', err);
        res.status(500).send('Error fetching assigned classes');
    }
});

// Attendance Page Route
router.get('/teacher/attendance/:classId', async (req, res) => {
    const classId = req.params.classId; // Get the classId from the URL

    try {
        const [results] = await db.query('SELECT id, student_name FROM students WHERE class_id = ?', [classId]);
        console.log('Students:', results); // Debugging: Check if students data is fetched
        res.render('teacher/attendance', { students: results, classId }); // Pass students and classId to the view
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).send('Error fetching students');
    }
});

// Attendance Submission Route
router.post('/teacher/attendance/:classId', async (req, res) => {
    const classId = req.params.classId;
    const attendance = req.body.attendance; // Attendance data from the form
    console.log('Class ID:', classId); // Debugging: Check classId
    console.log('Attendance Data:', attendance); // Debugging: Check attendance data

    if (!attendance) {
        console.error('No attendance data received');
        return res.status(400).send('No attendance data received');
    }

    try {
        const connection = await db.getConnection(); // Get a connection from the pool
        try {
            await connection.beginTransaction();

            for (const studentId in attendance) {
                const { student_id, status } = attendance[studentId];
                if (!student_id || !status) {
                    console.error(`Invalid data for Student ID: ${student_id}, Status: ${status}`);
                    continue; // Skip invalid entries
                }

                const query = 'INSERT INTO attendance (student_id, class_id, status, date) VALUES (?, ?, ?, NOW())';
                console.log(`Inserting attendance for Student ID: ${student_id}, Class ID: ${classId}, Status: ${status}`);
                await connection.query(query, [student_id, classId, status]);
            }

            await connection.commit();
            console.log('Attendance saved successfully');
            res.redirect('/teacher/dashboard'); // Redirect back to the dashboard
        } catch (err) {
            await connection.rollback();
            console.error('Error saving attendance:', err);
            res.status(500).send('Error saving attendance');
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).send('Database connection error');
    }
});

router.post('/attendance/:classId', async (req, res) => {
    const classId = req.params.classId;
    const attendance = req.body.attendance; // Attendance data from the form
    console.log('Class ID:', classId); // Debugging: Check classId
    console.log('Attendance Data:', attendance); // Debugging: Check attendance data

    if (!attendance) {
        console.error('No attendance data received');
        return res.status(400).send('No attendance data received');
    }

    try {
        const connection = await db.getConnection(); // Get a connection from the pool
        try {
            await connection.beginTransaction();

            for (const studentId in attendance) {
                const { student_id, status } = attendance[studentId];
                const query = 'INSERT INTO attendance (student_id, class_id, status, date) VALUES (?, ?, ?, NOW())';
                console.log(`Inserting attendance for Student ID: ${student_id}, Class ID: ${classId}, Status: ${status}`);
                await connection.query(query, [student_id, classId, status]);
            }

            await connection.commit();
            console.log('Attendance saved successfully');
            res.redirect('/teacher/dashboard'); // Redirect back to the dashboard
        } catch (err) {
            await connection.rollback();
            console.error('Error saving attendance:', err);
            res.status(500).send('Error saving attendance');
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).send('Database connection error');
    }
});

// Route to fetch attendance records for a specific date
router.get('/attendance/:classId/:date', async (req, res) => {
    const { classId, date } = req.params; // Get classId and date from the URL
    try {
        const query = `
            SELECT students.student_name, attendance.status, attendance.date
            FROM attendance
            JOIN students ON attendance.student_id = students.id
            WHERE attendance.class_id = ? AND DATE(attendance.date) = ?
        `;
        const [attendanceRecords] = await db.query(query, [classId, date]);
        console.log('Attendance Records:', attendanceRecords); // Debugging: Check fetched records
        res.render('teacher/attendanceRecords', { attendanceRecords, date }); // Render the attendanceRecords.ejs view
    } catch (err) {
        console.error('Error fetching attendance records:', err);
        res.status(500).send('Error fetching attendance records');
    }
});

// Route to handle attendance view form submission
router.get('/view-attendance', (req, res) => {
    const { classId, date } = req.query; // Get classId and date from the form
    if (!classId || !date) {
        return res.status(400).send('Class ID and Date are required');
    }
    res.redirect(`/teacher/attendance/${classId}/${date}`); // Redirect to the attendance records page
});

module.exports = router;
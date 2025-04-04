class AdminController {
    constructor(teacherModel, attendanceModel) {
        this.teacherModel = teacherModel;
        this.attendanceModel = attendanceModel;
    }

    async getTeacherList(req, res) {
        try {
            const query = `
                SELECT 
                    users.id, 
                    users.username, 
                    users.email, 
                    grades.grade_name AS assigned_class
                FROM users
                LEFT JOIN grades ON users.id = grades.teacher_id
                WHERE users.role = "teacher"
            `;
            const db = require('../utils/db');
            db.getConnection().query(query, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error retrieving teacher list');
                }
                res.render('admin/teacherList', { teachers: results });
            });
        } catch (error) {
            res.status(500).send('An error occurred');
        }
    }

    async assignTeacher(req, res) {
        const { teacherId, gradeId } = req.body;
        try {
            const query = 'UPDATE grades SET teacher_id = ? WHERE id = ?';
            const db = require('../utils/db');
            db.getConnection().query(query, [teacherId, gradeId], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error assigning teacher to class');
                }
                res.redirect('/admin/teachers'); // Redirect to the teacher list
            });
        } catch (error) {
            res.status(500).send('An error occurred');
        }
    }

    async viewAttendance(req, res) {
        const { teacherId } = req.params;
        try {
            const attendanceRecords = await this.attendanceModel.getAttendanceByTeacher(teacherId);
            res.render('admin/viewAttendance', { attendanceRecords });
        } catch (error) {
            res.status(500).send('Error retrieving attendance records');
        }
    }

    getDashboard(req, res) {
        res.send('Admin Dashboard');
    }
}

module.exports = AdminController;
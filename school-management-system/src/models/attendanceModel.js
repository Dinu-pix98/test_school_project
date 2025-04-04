const db = require('../utils/db');

class AttendanceModel {
    static async getAttendanceByTeacher(teacherId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM attendance WHERE teacher_id = ?';
            db.getConnection().query(query, [teacherId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static async markAttendance(studentId, teacherId, date, status) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO attendance (student_id, teacher_id, date, status) VALUES (?, ?, ?, ?)';
            db.getConnection().query(query, [studentId, teacherId, date, status], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = AttendanceModel;
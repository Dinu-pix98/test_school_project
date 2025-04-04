const db = require('../utils/db');

class SubjectModel {
    static async getAllSubjects() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM subjects';
            db.getConnection().query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static async addSubject(name, code, teacherId, gradeId) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO subjects (name, code, teacher_id, grade_id) VALUES (?, ?, ?, ?)';
            db.getConnection().query(query, [name, code, teacherId, gradeId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = SubjectModel;
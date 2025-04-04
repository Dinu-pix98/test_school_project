const db = require('../utils/db');

class GradeModel {
    static async getAllGrades() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM grades';
            db.getConnection().query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static async addGrade(gradeName) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO grades (grade_name) VALUES (?)';
            db.getConnection().query(query, [gradeName], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = GradeModel;
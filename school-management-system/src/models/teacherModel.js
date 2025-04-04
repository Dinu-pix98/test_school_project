const db = require('../utils/db');

class TeacherModel {
    static async findAll() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE role = "teacher"';
            db.getConnection().query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = TeacherModel;
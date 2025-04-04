const db = require('../utils/db');

class UserModel {
    static async getUserById(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE id = ?';
            db.getConnection().query(query, [userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
    }

    static async getAllUsersByRole(role) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE role = ?';
            db.getConnection().query(query, [role], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = UserModel;
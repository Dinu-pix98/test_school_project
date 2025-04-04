const db = require('../utils/db');

const marksSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subject: {
        type: String,
        enum: ['English', 'Sinhala', 'IT', 'Maths'],
        required: true
    },
    marks: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    term: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Marks = model('Marks', marksSchema);

class MarksModel {
    // Get marks for a specific student
    static async getMarksByStudent(studentId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM marks WHERE student_id = ?';
            db.getConnection().query(query, [studentId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    // Add marks for a student
    static async addMarks(studentId, subjectId, gradeId, marks, term) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO marks (student_id, subject_id, grade_id, marks, term) VALUES (?, ?, ?, ?, ?)';
            db.getConnection().query(query, [studentId, subjectId, gradeId, marks, term], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    // Update marks for a student
    static async updateMarks(studentId, subjectId, gradeId, marks, term) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE marks SET marks = ? WHERE student_id = ? AND subject_id = ? AND grade_id = ? AND term = ?';
            db.getConnection().query(query, [marks, studentId, subjectId, gradeId, term], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    // Get marks for all students in a specific grade and term
    static async getMarksByGradeAndTerm(gradeId, term) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM marks WHERE grade_id = ? AND term = ?';
            db.getConnection().query(query, [gradeId, term], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = { Marks, MarksModel };
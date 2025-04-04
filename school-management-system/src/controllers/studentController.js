class StudentController {
    async getTimetable(req, res) {
        // Logic to fetch and return the student's timetable
        res.send('Student timetable');
    }

    async getMarks(req, res) {
        // Logic to fetch and return the student's marks
        res.send('Student marks');
    }
}

module.exports = StudentController;
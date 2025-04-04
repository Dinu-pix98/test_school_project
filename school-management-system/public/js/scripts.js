document.addEventListener('DOMContentLoaded', function() {
    const attendanceForm = document.getElementById('attendance-form');
    const marksForm = document.getElementById('marks-form');
    const datePicker = document.getElementById('date-picker');

    if (attendanceForm) {
        attendanceForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(attendanceForm);
            fetch('/api/attendance', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                attendanceForm.reset();
            })
            .catch(error => console.error('Error:', error));
        });
    }

    if (marksForm) {
        marksForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(marksForm);
            fetch('/api/marks', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                marksForm.reset();
            })
            .catch(error => console.error('Error:', error));
        });
    }

    if (datePicker) {
        datePicker.addEventListener('change', function() {
            const selectedDate = datePicker.value;
            fetch(`/api/attendance/${selectedDate}`)
            .then(response => response.json())
            .then(data => {
                // Update the attendance display with the fetched data
                updateAttendanceDisplay(data);
            })
            .catch(error => console.error('Error:', error));
        });
    }

    function updateAttendanceDisplay(data) {
        const attendanceDisplay = document.getElementById('attendance-display');
        attendanceDisplay.innerHTML = ''; // Clear previous data
        data.forEach(record => {
            const recordElement = document.createElement('div');
            recordElement.textContent = `${record.studentName}: ${record.status}`;
            attendanceDisplay.appendChild(recordElement);
        });
    }
});
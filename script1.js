

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getDatabase, ref, set, onValue, update, get } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCO-iPHycqRH-OkItRob92wOp9Hd1gau9o",
    authDomain: "attendance-dashboard-55466.firebaseapp.com",
    databaseURL: "https://attendance-dashboard-55466-default-rtdb.firebaseio.com",
    projectId: "attendance-dashboard-55466",
    storageBucket: "attendance-dashboard-55466.appspot.com",
    messagingSenderId: "450332479502",
    appId: "1:450332479502:web:182976f8c41513ebe4ec5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
        // If no token is found, redirect to the login page
        // prompt("You must be logged in to access the dashboard.");
        // alert("You must be logged in to access the dashboard.");
        window.location.href = "index.html";
    }
});



// Timetable data
const timetable = {
    Monday: [
        { time: "10:00-11:00", course: "Mathematics" },
        { time: "11:00-12:00", course: "Science" },
        { time: "12:00-1:00", course: "History" },
        { time: "1:00-2:00", course: "Literature" },
        { time: "2:00-3:00", course: "Art" }
    ],
    Tuesday: [
        { time: "10:00-11:00", course: "Science" },
        { time: "11:00-12:00", course: "Mathematics" },
        { time: "12:00-1:00", course: "Literature" },
        { time: "1:00-2:00", course: "Art" },
        { time: "2:00-3:00", course: "History" }
    ],
    Saturday: [
        { time: "10:00-11:00", course: "History" },
        { time: "22:00-23:00", course: "Literature" },
        { time: "12:00-13:00", course: "Art" },
        { time: "20:00-21:00", course: "Science" },
        { time: "2:00-3:00", course: "Mathematics" }
    ],
    Sunday: [
        { time: "10:00-11:00", course: "Art" },
        { time: "11:00-12:00", course: "History" },
        { time: "13:00-15:00", course: "Literature" },
        { time: "20:00-21:00", course: "Science" },
        { time: "22:00-23:00", course: "Mathematics" }
    ]

    // Add other days similarly...
};

// Attach functions to the window object
window.showTab = function (tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabName).style.display = 'block';
};

// Display timetable
function displayTimetable() {
    const timetableDiv = document.getElementById('timetable');
    const today = new Date();
    const dayName = today.toLocaleString('default', { weekday: 'long' });
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTime = `${currentHour}:${currentMinute < 10 ? '0' + currentMinute : currentMinute}`;

    timetableDiv.innerHTML = '';
    timetable[dayName].forEach(slot => {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'timetable-slot';
        slotDiv.innerHTML = `<span>${slot.time}</span><span>${slot.course}</span>`;
        if (isCurrentSlot(slot.time, currentTime)) {
            slotDiv.classList.add('active');
            loadStudents(slot.course);
            document.getElementById('markAttendanceButton').style.display = 'block'; // Show the attendance button
        }
        timetableDiv.appendChild(slotDiv);
    });
}

// Add new student
document.getElementById('addStudentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const studentName = document.getElementById('studentName').value;
    const studentEmail = document.getElementById('studentEmail').value;
    const studentPhone = document.getElementById('studentPhone').value;
    const studentBatch = document.getElementById('studentBatch').value;
    const courses = Array.from(document.querySelectorAll('#courseCheckboxes input:checked')).map(checkbox => checkbox.value);

    const newStudentRef = ref(db, 'students/' + studentName.replace(/\s+/g, '_')); // Use the student's name as the key, replacing spaces with underscores for compatibility

    // Create a new student object with attendance initialized for each course
    const newStudent = {
        name: studentName,
        email: studentEmail,
        phone: studentPhone,
        batch: studentBatch,
        courses: courses,
        attendance: {} // Initialize attendance as an empty object
    };

    // Get the current date in a suitable format (e.g., YYYY-MM-DD)
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Initialize attendance for each course with the current date
    // courses.forEach(course => {
    //     newStudent.attendance[course] = [currentDate]; // Each course will have an array with the current date
    // });

    courses.forEach(course => {
        newStudent.attendance[course] = ['0000-00-00']; // Each course will have an array with the fake date
    });

    // Set the new student data in the database
    set(newStudentRef, newStudent)
        .then(() => {
            alert('Student added successfully!');
            document.getElementById('addStudentForm').reset(); // Reset the form
        })
        .catch((error) => {
            console.error('Error adding student: ', error);
        });
});

// Check if the current time is within the slot time
function isCurrentSlot(slotTime, currentTime) {
    const [start, end] = slotTime.split('-');
    return currentTime >= start && currentTime < end;
}

// Load students based on selected course
window.loadStudents = function (courseSelect) {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    const studentsRef = ref(db, 'students');
    onValue(studentsRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const student = childSnapshot.val();
            if (student.courses && student.courses.includes(courseSelect)) {
                const studentItem = document.createElement('div');
                studentItem.innerHTML = `<input type="checkbox" id="${childSnapshot.key}" data-course="${courseSelect}" style="width:50px;">${student.name}`;
                studentList.appendChild(studentItem);
            }
        });
    });
};



window.markAttendance = function () {
    const studentList = document.getElementById('studentList');
    const checkboxes = studentList.querySelectorAll('input[type="checkbox"]:checked');
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    checkboxes.forEach(checkbox => {
        const studentName = checkbox.id.replace(/\s+/g, '_'); // Replace spaces with underscores for compatibility
        const course = checkbox.getAttribute('data-course');
        // console.log(studentName);
        const studentRef = ref(db, 'students/' + studentName); // Use student name as the key

        // Check if the attendance for today has already been marked
        get(studentRef).then((snapshot) => {
            if (snapshot.exists()) {
                const studentData = snapshot.val();
                const attendanceArray = studentData.attendance?.[course] || []; // Use optional chaining
                // console.log(course);

                // Check if today's date is already in the attendance array
                if (attendanceArray.includes(currentDate)) {
                    alert('Attendance for today has already been marked for ' + checkbox.nextSibling.textContent + ' in ' + course);
                } else {
                    // If the attendance array contains the fake date, replace it with the current date
                    if (attendanceArray.includes('0000-00-00')) {
                        // Update the student's attendance record for the specific course, replacing the fake date
                        update(studentRef, {
                            [`attendance/${course}`]: attendanceArray.filter(date => date !== '0000-00-00').concat(currentDate)
                        }).then(() => {
                            alert('Attendance marked for ' + checkbox.nextSibling.textContent + ' in ' + course);
                            loadStudents(course); // Reload the student list after marking attendance
                        }).catch((error) => {
                            console.error('Error marking attendance: ', error);
                        });
                    } else {
                        // Update the student's attendance record for the specific course
                        update(studentRef, {
                            [`attendance/${course}`]: firebase.database.ServerValue.arrayUnion(currentDate)
                        }).then(() => {
                            alert('Attendance marked for ' + checkbox.nextSibling.textContent + ' in ' + course);
                            loadStudents(course); // Reload the student list after marking attendance
                        }).catch((error) => {
                            console.error('Error marking attendance: ', error);
                        });
                    }
                }
            } else {
                console.error('Student data does not exist for name: ', studentName);
            }
        }).catch((error) => {
            console.error('Error fetching student data: ', error);
        });
    });
};

// Event listeners for tab buttons
document.getElementById('addStudentTab').addEventListener('click', () => {
    document.getElementById('addStudentTab').classList.add('active');
    document.getElementById('markAttendanceTab').classList.remove('active');
    showTab('addStudent');
});
document.getElementById('markAttendanceTab').addEventListener('click', () => {
    document.getElementById('addStudentTab').classList.remove('active');
    document.getElementById('markAttendanceTab').classList.add('active');
    showTab('markAttendance');
    displayTimetable(); // Display the timetable when switching to the attendance tab
});

// Initialize the timetable display on page load
window.onload = function () {
    displayTimetable();
};

const profileIcon = document.getElementById("profileIcon");
const profileDropdown = document.getElementById("profileDropdown");

profileIcon.addEventListener("click", () => {
    profileDropdown.classList.toggle("active");
});

// Logout functionality
const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", () => {
    alert("Logged out");
    localStorage.removeItem("auth-token");
    window.location.href = "index.html";
});
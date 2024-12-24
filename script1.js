
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






//Auth-token checking system
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
        window.location.href = "index.html";
    }
});








// Edit Your Timetable Below
const timetable = {
    Monday: [
        { time: "10:00-11:00", course: "Mathematics" },
        { time: "11:00-12:00", course: "Science" },
        { time: "12:00-13:00", course: "History" },
        { time: "13:00-14:00", course: "Literature" },
        { time: "14:00-15:00", course: "Art" }
    ],
    Tuesday: [
        { time: "10:00-11:00", course: "Science" },
        { time: "11:00-12:00", course: "Mathematics" },
        { time: "12:00-13:00", course: "Literature" },
        { time: "13:00-14:00", course: "Art" },
        { time: "14:00-24:00", course: "History" }
    ],
    Wednesday: [
        { time: "10:00-11:00", course: "History" },
        { time: "11:00-12:00", course: "Literature" },
        { time: "12:00-13:00", course: "Art" },
        { time: "13:00-14:00", course: "Science" },
        { time: "14:00-15:00", course: "Mathematics" }
    ],
    Thursday: [
        { time: "10:00-11:00", course: "Mathematics" },
        { time: "11:00-12:00", course: "Science" },
        { time: "12:00-13:00", course: "History" },
        { time: "13:00-14:00", course: "Literature" },
        { time: "14:00-15:00", course: "Art" }
    ],
    Friday: [
        { time: "10:00-11:00", course: "Science" },
        { time: "11:00-12:00", course: "Mathematics" },
        { time: "12:00-13:00", course: "Literature" },
        { time: "13:00-14:00", course: "Art" },
        { time: "14:00-15:00", course: "History" }
    ],

    Sunday: [
        { time: "10:00-11:00", course: "History" },
        { time: "22:00-23:00", course: "Literature" },
        { time: "12:00-13:00", course: "Art" },
        { time: "13:00-14:00", course: "Science" },
        { time: "14:00-15:00", course: "Mathematics" }
    ],
    Saturday: []
};
























// Attach functions to the window object
window.showTab = function (tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabName).style.display = 'block';
};




function isCurrentSlot(slotTime, currentTime) {
    const [start, end] = slotTime.split("-");
    const startTime = convertToMinutes(start);
    const endTime = convertToMinutes(end);
    const currentMinutes = convertToMinutes(currentTime);

    return currentMinutes >= startTime && currentMinutes < endTime;
}

function convertToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}



























// Add new student System
document.getElementById('addStudentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const studentName = document.getElementById('studentName').value.trim().toLowerCase(); // Convert name to lowercase
    const studentEmail = document.getElementById('studentEmail').value;
    const studentPhone = document.getElementById('studentPhone').value;
    const studentBatch = document.getElementById('studentBatch').value;
    const courses = Array.from(document.querySelectorAll('#courseCheckboxes input:checked')).map(checkbox => checkbox.value);

    const studentKey = studentName.replace(/\s+/g, '_'); // Use the student's name as the key, replacing spaces with underscores for compatibility
    const newStudentRef = ref(db, 'students/' + studentKey);

    // Check if the student already exists
    get(newStudentRef).then(snapshot => {
        if (snapshot.exists()) {
            alert('A student with this name already exists! Please use a unique name.');
        } else {
            // Create a new student object with attendance initialized for each course
            const newStudent = {
                name: studentName,
                email: studentEmail,
                phone: studentPhone,
                batch: studentBatch,
                courses: courses,
                attendance: {} // Initialize attendance as an empty object
            };

            courses.forEach(course => {
                newStudent.attendance[course] = ['0000-00-00']; // Each course will have an array with the fake date
            });

            // Set the new student data in the database
            set(newStudentRef, newStudent)
                .then(() => {
                    // console.log('Student added successfully!');
                    document.getElementById('addStudentForm').reset(); // Reset the form
                    // Create a popup message
                    const popup = document.createElement("div");
                    popup.id = "login-popup";
                    popup.textContent = "Student added successfully!";
                    document.body.appendChild(popup);

                    // Style the popup
                    const style = document.createElement("style");
                    style.textContent = `
                                        #login-popup {
                                        position: fixed;
                                        top: -50px;
                                        left: 50%;
                                        transform: translateX(-50%);
                                        background-color: #4CAF50;
                                        color: white;
                                        padding: 10px 20px;
                                        border-radius: 5px;
                                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                                        font-size: 16px;
                                        opacity: 1;
                                        transition: opacity 0.5s ease, top 0.3s ease;
                                        z-index: 1000;
                                        }

                                        #login-popup.show {
                                        top: 20px;
                                        }

                                        #login-popup.hide {
                                        opacity: 0;
                                        top: -50px;
                                        }
                                    `;
                    document.head.appendChild(style);

                    // Show the popup with an upward effect
                    setTimeout(() => {
                        popup.classList.add("show");
                    }, 10);

                    // Hide the popup after 1.7 seconds
                    setTimeout(() => {
                        popup.classList.add("hide");
                    }, 1400);

                })
                .catch((error) => {
                    console.error('Error adding student: ', error);
                });
        }
    }).catch(error => {
        console.error('Error checking student existence: ', error);
    });
});












































window.loadStudents = function (courseSelect) {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = ''; // Clear existing rows

    const studentsRef = ref(db, 'students');
    const currentDate = new Date();
    const currentDateString = currentDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }); // Format as DD Mon

    const previousDates = Array.from({ length: 5 }, (_, i) => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - (i + 1)); // Start from the previous day
        return date.toISOString().split('T')[0];
    }).reverse(); // Reverse to get oldest first

    // Create table structure
    const table = document.createElement('table');
    table.className = 'attendance-table';

    // Table header
    const headerRow = document.createElement('tr');

    const formattedDates = previousDates.map(dateString => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
    });

    headerRow.innerHTML = `<th>Student Name</th>${formattedDates.map(date => `<th>${date}</th>`).join('')}<th>${currentDateString}</th>`;
    table.appendChild(headerRow);

    const existingStudents = new Set(); // Track added students

    onValue(studentsRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const student = childSnapshot.val();
            if (student.courses && student.courses.includes(courseSelect) && !existingStudents.has(childSnapshot.key)) {
                existingStudents.add(childSnapshot.key); // Mark student as added
                const attendanceRow = document.createElement('tr');

                // Student Name Column
                const nameCell = document.createElement('td');
                nameCell.textContent = student.name;
                attendanceRow.appendChild(nameCell);

                // Previous Days Attendance Columns
                previousDates.forEach(date => {
                    const attendanceCell = document.createElement('td');
                    const attendanceArray = student.attendance?.[courseSelect] || [];

                    if (attendanceArray.includes(date)) {
                        attendanceCell.textContent = 'P';
                        attendanceCell.className = 'present';
                    } else {
                        attendanceCell.textContent = 'A';
                        attendanceCell.className = 'absent';
                    }

                    attendanceRow.appendChild(attendanceCell);
                });

                // Current Day Attendance Column
                const currentDayCell = document.createElement('td');
                const isChecked = student.attendance?.[courseSelect]?.includes(currentDate.toISOString().split('T')[0]);

                currentDayCell.innerHTML = `<input type="checkbox" id="${childSnapshot.key}" data-course="${courseSelect}" ${isChecked ? 'checked' : ''} />`;
                attendanceRow.appendChild(currentDayCell);

                // Append Row to Table
                table.appendChild(attendanceRow);
            }
        });
    });

    studentList.appendChild(table);
};






























//Marking Attendance System

window.markAttendance = function () {
    const studentList = document.getElementById('studentList');
    const checkboxes = studentList.querySelectorAll('input[type="checkbox"]');
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    checkboxes.forEach(checkbox => {
        const studentName = checkbox.id.replace(/\s+/g, '_'); // Replace spaces with underscores for compatibility
        const course = checkbox.getAttribute('data-course');
        const studentRef = ref(db, 'students/' + studentName); // Use student name as the key

        get(studentRef).then((snapshot) => {
            if (snapshot.exists()) {
                const studentData = snapshot.val();
                const attendanceArray = studentData.attendance?.[course] || []; // Use optional chaining

                if (checkbox.checked) {
                    // If checkbox is checked, add the current date to attendance if not already present
                    if (!attendanceArray.includes(currentDate)) {
                        const updatedArray = attendanceArray.concat(currentDate);
                        const updates = {};
                        updates[`attendance/${course}`] = updatedArray;
                        update(studentRef, updates).then(() => {
                            console.log('Attendance marked for ' + studentName + ' in ' + course);
                           
                            // Create a popup message
                            const popup = document.createElement("div");
                            popup.id = "login-popup";
                            popup.textContent = "Attendance marked !";
                            document.body.appendChild(popup);

                            // Style the popup
                            const style = document.createElement("style");
                            style.textContent = `
        #login-popup {
          position: fixed;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          font-size: 16px;
          opacity: 1;
          transition: opacity 0.5s ease, top 0.3s ease;
          z-index: 1000;
        }

        #login-popup.show {
          top: 20px;
        }

        #login-popup.hide {
          opacity: 0;
          top: -50px;
        }
      `;
                            document.head.appendChild(style);

                            // Show the popup with an upward effect
                            setTimeout(() => {
                                popup.classList.add("show");
                            }, 10);

                            // Hide the popup after 1.7 seconds
                            setTimeout(() => {
                                popup.classList.add("hide");
                            }, 1400);
                        }).catch((error) => {
                            console.error('Error marking attendance: ', error);
                        });
                    }
                } else {
                    // If checkbox is unchecked, remove the current date from attendance if present
                    if (attendanceArray.includes(currentDate)) {
                        const updatedArray = attendanceArray.filter(date => date !== currentDate);
                        const updates = {};
                        updates[`attendance/${course}`] = updatedArray;
                        update(studentRef, updates).then(() => {
                            console.log('Attendance unmarked for ' + studentName + ' in ' + course);
                            
                            // Create a popup message
                            const popup = document.createElement("div");
                            popup.id = "login-popup";
                            popup.textContent = "Attendance marked !";
                            document.body.appendChild(popup);

                            // Style the popup
                            const style = document.createElement("style");
                            style.textContent = `
        #login-popup {
          position: fixed;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          font-size: 16px;
          opacity: 1;
          transition: opacity 0.5s ease, top 0.3s ease;
          z-index: 1000;
        }

        #login-popup.show {
          top: 20px;
        }

        #login-popup.hide {
          opacity: 0;
          top: -50px;
        }
      `;
                            document.head.appendChild(style);

                            // Show the popup with an upward effect
                            setTimeout(() => {
                                popup.classList.add("show");
                            }, 10);

                            // Hide the popup after 1.7 seconds
                            setTimeout(() => {
                                popup.classList.add("hide");
                            }, 1400);
                        }).catch((error) => {
                            console.error('Error unmarking attendance: ', error);
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
    // displayTimetable(); // Display the timetable when switching to the attendance tab
});


















// Logout functionality
const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", () => {
    console.log("Logged out");
    localStorage.removeItem("auth-token");
    // Create a popup message
    const popup = document.createElement("div");
    popup.id = "login-popup";
    popup.textContent = "Logged out !!! Redirecting to Login Page...";
    document.body.appendChild(popup);

    // Style the popup
    const style = document.createElement("style");
    style.textContent = `
      #login-popup {
        position: fixed;
        top: -50px;
        left: 50%;
        transform: translateX(-50%);
        background-color:rgb(236, 26, 26);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-size: 16px;
        opacity: 1;
        transition: opacity 0.5s ease, top 0.3s ease;
        z-index: 1000;
      }

      #login-popup.show {
        top: 20px;
      }

      #login-popup.hide {
        opacity: 0;
        top: -50px;
      }
    `;
    document.head.appendChild(style);

    // Show the popup with an upward effect
    setTimeout(() => {
        popup.classList.add("show");
    }, 10);

    // Hide the popup after 1.7 seconds
    setTimeout(() => {
        popup.classList.add("hide");
    }, 1400);

    // Redirect to dashboard after 2.2 seconds
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1800);
    // window.location.href = "index.html";
});

























function createTimetableTable(data, highlightCurrent = false) {
    const days = Object.keys(data);
    const allTimeSlots = [...new Set(days.flatMap(day => data[day].map(slot => slot.time)))];

    const table = document.createElement("table");
    table.classList.add("timetable-table");

    // Header row
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `<th>Day</th>${allTimeSlots.map(slot => `<th>${slot}</th>`).join("")}`;
    table.appendChild(headerRow);

    // Rows for each day
    days.forEach(day => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${day}</td>${allTimeSlots
            .map(slot => {
                const classData = data[day].find(classSlot => classSlot.time === slot);
                const isActive = highlightCurrent && isCurrentSlot(slot, getCurrentTime());
                if (isActive && classData) {
                    loadStudents(classData.course);
                    document.getElementById("markAttendanceButton").style.display = "block"; // Show the button
                }
                return `<td class="${isActive ? "active-slot" : ""}">${classData ? classData.course : "--"}</td>`;
            })
            .join("")}`;
        table.appendChild(row);
    });

    return table;
}

// Utility to get current time
function getCurrentTime() {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
}


function generateFullTimetable() {
    const timetableDiv = document.getElementById("fullTimetable");
    const table = createTimetableTable(timetable);
    timetableDiv.innerHTML = "";
    timetableDiv.appendChild(table);
}

function generateCurrentDayTimetable() {
    const timetableDiv = document.getElementById("currentDayTimetable");
    const today = new Date();
    const currentDay = today.toLocaleString("default", { weekday: "long" });
    const table = createTimetableTable({ [currentDay]: timetable[currentDay] }, true);
    timetableDiv.innerHTML = "";
    timetableDiv.appendChild(table);
}



generateFullTimetable();
generateCurrentDayTimetable();





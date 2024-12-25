
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
let timetable1 = {
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
























//Courses List All


let cachedCourses = null; // Cache for storing fetched courses
let courses = []; // Global variable to hold courses

function fetchCoursesFromDatabaseAndUpdate() {
    // console.log("Fetching data");
    const coursesRef = ref(db, 'Data/subjects');
    get(coursesRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                cachedCourses = Object.values(snapshot.val()); // Cache the fetched courses
                // courses = cachedCourses; // Update the global courses variable
                courses = Array.from(new Set([...courses, ...cachedCourses]));
                const courseRow = document.querySelector('.courseRow');
                const select = courseRow.querySelector('.courseSelect');
                populateCourseDropdown(select);
            } else {
                console.error('No courses found in the database.');
                courses = []; // Set courses to an empty array if no data is found
            }
        })
        .catch((error) => {
            console.error('Error fetching courses:', error);
            courses = []; // Set courses to an empty array in case of an error
        });
}


// Function to populate the dropdowns dynamically
function populateCourseDropdown(selectElement) {
    // Clear existing options to avoid duplication
    selectElement.innerHTML = '<option value="">Select a Course</option>';

    if (courses) {
        const uniqueCourses = new Set(courses); // Use Set to ensure uniqueness

        uniqueCourses.forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            selectElement.appendChild(option);
        });
    }

}





// Add the first dropdown on page load
document.addEventListener("DOMContentLoaded", () => {
    const courseRow = document.querySelector('.courseRow');
    const select = courseRow.querySelector('.courseSelect');
    populateCourseDropdown(select);
});

// Event listener for adding new course dropdown
document.getElementById('courseDropdowns').addEventListener('click', function (event) {
    if (event.target.classList.contains('addCourseBtn')) {
        const newCourseRow = document.createElement('div');
        newCourseRow.classList.add('courseRow');
        const newSelect = document.createElement('select');
        newSelect.classList.add('courseSelect');
        newSelect.innerHTML = '<option value="">Select a Course</option>';
        populateCourseDropdown(newSelect);
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.classList.add('removeCourseBtn');
        removeBtn.textContent = '×';
        newCourseRow.appendChild(newSelect);
        newCourseRow.appendChild(removeBtn);
        document.getElementById('courseDropdowns').appendChild(newCourseRow);
    }
});

// Event listener for removing a course dropdown
document.getElementById('courseDropdowns').addEventListener('click', function (event) {
    if (event.target.classList.contains('removeCourseBtn')) {
        const rowToRemove = event.target.closest('.courseRow');
        rowToRemove.remove();
    }
});

// Handle form submission and save data to the database
document.getElementById('addStudentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const studentName = document.getElementById('studentName').value.trim().toLowerCase(); // Convert name to lowercase
    const studentEmail = document.getElementById('studentEmail').value;
    const studentPhone = document.getElementById('studentPhone').value;
    const studentBatch = document.getElementById('studentBatch').value;
    const studentId = document.getElementById('studentId').value;
    // Collect selected courses from the dropdowns
    const courses = Array.from(
        new Set(
            Array.from(document.querySelectorAll('.courseSelect'))
                .map(select => select.value)
                .filter(course => course !== "") // Only keep selected courses
        )
    );


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
                id:studentId,
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
    course = courseSelect;
    // console.log(course);
    if (course == '--' || course == "") {
        const studentList = document.getElementById('studentList');
        studentList.innerHTML = 'Select Your Subject';
        studentList.classList.add("msgClass");
    } else {
        const studentList = document.getElementById('studentList');
        studentList.classList.remove("msgClass");
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
                    attendanceRow.classList.add("table_row_Class");
                    // Student Name Column
                    const nameCell = document.createElement('td');
                    nameCell.textContent = student.name;
                    attendanceRow.appendChild(nameCell);


                    previousDates.forEach(date => {
                        const attendanceCell = document.createElement('td');

                        // Check if the attendance for the student, course, and date exists
                        const attendanceStatus = student.attendance?.[courseSelect]?.[date]; // Get the attendance status for this student, course, and date

                        // If there's no attendance recorded for this date, show empty radio buttons
                        if (!attendanceStatus) {
                            attendanceCell.textContent = '-'; // Leave
                            attendanceCell.className = 'empty';
                        } else {

                            if (attendanceStatus === 'P') {
                                attendanceCell.textContent = 'P'; // Present
                                attendanceCell.className = 'present';
                            } else if (attendanceStatus === 'A') {
                                attendanceCell.textContent = 'A'; // Absent
                                attendanceCell.className = 'absent';
                            } else if (attendanceStatus === 'L') {
                                attendanceCell.textContent = 'L'; // Leave
                                attendanceCell.className = 'leave';
                            }
                        }

                        // Append the attendance cell to the row
                        attendanceRow.appendChild(attendanceCell);
                    });



                    // Current Day Attendance Column with Radio Buttons for P, A, L
                    const currentDayCell = document.createElement('td');
                    // const currentDayAttendance = student.attendance?.[courseSelect]?.find(date => date === currentDate.toISOString().split('T')[0]);
                    const currentDayAttendance = student.attendance?.[courseSelect]?.[currentDate.toISOString().split('T')[0]];

                    // Create radio buttons for Present (P), Absent (A), and Leave (L)
                    currentDayCell.innerHTML = `
                    <label style="color: blue;">
                        <input type="radio" name="attendance-${childSnapshot.key}" value="P" ${currentDayAttendance === 'P' ? 'checked' : ''} />
                        P
                    </label>
                    <label style="color: red;">
                        <input type="radio" name="attendance-${childSnapshot.key}" value="A" ${currentDayAttendance === 'A' ? 'checked' : ''} />
                        A
                    </label>
                    <label style="color: green;">
                        <input type="radio" name="attendance-${childSnapshot.key}" value="L" ${currentDayAttendance === 'L' ? 'checked' : ''} />
                        L
                    </label>
                `;

                    // If no data exists for the current day, make sure no radio button is selected
                    if (!currentDayAttendance) {
                        currentDayCell.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
                    }

                    attendanceRow.appendChild(currentDayCell);

                    // Append Row to Table
                    table.appendChild(attendanceRow);

                }
            });
        });

        studentList.appendChild(table);
    }
};




































let course;

window.markAttendance = function () {
    const studentList = document.getElementById('studentList');
    const radioButtons = studentList.querySelectorAll('input[type="radio"]:checked'); // Select checked radio buttons
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    radioButtons.forEach(radioButton => {
        const studentName = radioButton.name.replace('attendance-', ''); // Use student ID
        // var course = radioButton.getAttribute('data-course'); // Get the course
        // console.log(course);
        const studentRef = ref(db, 'students/' + studentName); // Reference to the student's data in Firebase

        get(studentRef).then((snapshot) => {
            if (snapshot.exists()) {
                const studentData = snapshot.val();
                const currentAttendance = studentData.attendance?.[course] || {}; // Get current attendance object for the course

                // Determine the selected attendance status (P, A, L)
                const attendanceStatus = radioButton.value;

                // Update the attendance for the current day
                const updatedAttendance = {
                    ...currentAttendance,
                    [currentDate]: attendanceStatus // Update the attendance for today's date
                };

                const updates = {};
                updates[`attendance/${course}`] = updatedAttendance;

                // Update the Firebase record
                update(studentRef, updates).then(() => {
                    // console.log('Attendance marked for ' + studentName + ' in ' + course + ' as ' + attendanceStatus);

                }).catch((error) => {
                    console.error('Error marking attendance: ', error);
                });
            } else {
                console.error('Student data does not exist for name: ', studentName);
            }
        }).catch((error) => {
            console.error('Error fetching student data: ', error);
        });
    });
    // Create and show the popup message
    const popup = document.createElement("div");
    popup.id = "login-popup";
    popup.textContent = `Attendance marked !`;
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
};











// Attach functions to the window object
window.showTab = function (tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabName).style.display = 'block';
};

// Event listeners for tab buttons
document.getElementById('addStudentTab').addEventListener('click', () => {
    document.getElementById('addStudentTab').classList.add('active');
    document.getElementById('markAttendanceTab').classList.remove('active');
    fetchCoursesFromDatabaseAndUpdate();
    showTab('addStudent');
});
document.getElementById('markAttendanceTab').addEventListener('click', () => {
    document.getElementById('addStudentTab').classList.remove('active');
    document.getElementById('markAttendanceTab').classList.add('active');
    showTab('markAttendance');
    loadDataFromDatabase();
    // displayTimetable(); // Display the timetable when switching to the attendance tab
});

fetchCoursesFromDatabaseAndUpdate();
















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








































// Define your variables
// let timetable = {};
// let subjects = ["Math", "Science", "History", "Geography", "English"];

// Set the data in Firebase Realtime Database
// const databaseRef = ref(db, 'Data/'); // Replace 'your/path' with the actual location you want to store the data
// set(databaseRef, {
//   timetable: timetable,
//   subjects: subjects
// })
//   .then(() => {
//     console.log('Data successfully saved!');
//   })
//   .catch((error) => {
//     console.error('Error saving data:', error);

// References for database
const timetableRef = ref(db, "Data/timetable");
const subjectsRef = ref(db, "Data/subjects");

// Default data for timetable and subjects
let timetable = {};
let subjects = [];

let isEditing = false;

// Fetch data from Firebase Realtime Database
function loadDataFromDatabase() {
    // Fetch timetable data
    get(timetableRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                timetable = snapshot.val(); // Load timetable
            } else {
                timetable = {
                    Monday: [],
                    Tuesday: [],
                    Wednesday: [],
                    Thursday: [],
                    Friday: [],
                    Saturday: [],
                    Sunday: [],
                };
                console.log("No timetable data found. Using default.");
            }
            generateFullTimetable(); // Render timetable after loading
        })
        .catch((error) => console.error("Error fetching timetable data:", error));

    // Fetch subjects data
    get(subjectsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                subjects = snapshot.val(); // Load subjects
            } else {
                subjects = ["Math", "Science", "History", "Geography", "English"];
                console.log("No subjects data found. Using default subjects.");
            }
        })
        .catch((error) => console.error("Error fetching subjects data:", error));
}

// Save data to Firebase
function saveDataToDatabase() {
    set(timetableRef, timetable)
        .then(() => {
            console.log("Timetable saved successfully!");
            // Create a popup message
            const popup = document.createElement("div");
            popup.id = "login-popup";
            popup.textContent = `Timetable saved successfully!`;
            document.body.appendChild(popup);

            // Style the popup
            const style = document.createElement("style");
            style.textContent = `
                #login-popup {
                    position: fixed;
                    top: -50px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color:#4CAF50;
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
        .catch((error) => alert("Error saving timetable:", error));

    set(subjectsRef, subjects)
        .then(() => console.log("Subjects saved successfully!"))
        .catch((error) => alert("Error saving subjects:", error));
}

// Generate timetable table
function generateFullTimetable() {
    const timetableDiv = document.getElementById("fullTimetable");
    timetableDiv.innerHTML = "";

    // Add buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit Timetable";
    editButton.id = "editButton";
    // editButton.style.backgroundColor = "#ffeb3b";
    editButton.style.color = "#fff";
    editButton.style.borderRadius = "5px";
    editButton.style.padding = "10px 15px";
    editButton.style.margin = "5px";
    editButton.addEventListener("click", enableEditMode);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Timetable";
    saveButton.id = "saveButton";
    saveButton.style.display = "none";
    saveButton.style.backgroundColor = "#ffeb3b";
    saveButton.style.color = "#000";
    saveButton.style.border = "none";
    saveButton.style.padding = "10px 15px";
    saveButton.style.margin = "5px";
    saveButton.style.borderRadius = "5px";
    saveButton.style.cursor = "pointer";
    saveButton.addEventListener("click", () => {
        saveTimetable();
        saveDataToDatabase(); // Save timetable and subjects to the database
    });

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(saveButton);
    timetableDiv.appendChild(buttonContainer);

    // Generate timetable table
    const table = createTimetableTable(timetable, false);
    timetableDiv.appendChild(table);
}



function createTimetableTable(data, highlightCurrent = false) {
    const days = Object.keys(data);
    const allTimeSlots = [...new Set(days.flatMap(day => data[day].map(slot => slot.time)))];

    const table = document.createElement("table");
    table.classList.add("timetable-table");

    // Header row
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `<th>Day</th>${allTimeSlots
        .map(slot => `<th data-time-slot>${slot}</th>`)
        .join("")}`;
    table.appendChild(headerRow);

    // Rows for each day
    days.forEach(day => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${day}</td>${allTimeSlots
            .map(slot => {
                const classData = data[day].find(classSlot => classSlot.time === slot);
                return `<td data-day="${day}" data-time="${slot}" contenteditable="${isEditing}">
                            ${classData ? classData.course : "--"}
                        </td>`;
            })
            .join("")}`;
        table.appendChild(row);
    });

    return table;
}


// Enable edit mode for timetable
function enableEditMode() {
    const table = document.querySelector(".timetable-table");
    const editButton = document.getElementById("editButton");
    const saveButton = document.getElementById("saveButton");

    editButton.style.display = "none";
    saveButton.style.display = "inline-block";

    table.querySelectorAll("tr").forEach((row, rowIndex) => {
        row.querySelectorAll("td").forEach((cell, colIndex) => {
            if (colIndex === 0) return; // Skip first column (Day names)

            const currentCourse = cell.textContent.trim();

            // Create dropdown for subjects
            const dropdown = document.createElement("select");
            dropdown.className = "subject-dropdown";

            // Add an empty option for blank cells
            const emptyOption = document.createElement("option");
            emptyOption.value = "";
            emptyOption.textContent = "--";
            emptyOption.selected = currentCourse === "--" || currentCourse === "";
            dropdown.appendChild(emptyOption);

            // Populate dropdown with subjects
            subjects.forEach(subject => {
                const option = document.createElement("option");
                option.value = subject;
                option.textContent = subject;
                option.selected = subject === currentCourse;
                dropdown.appendChild(option);
            });

            dropdown.addEventListener("change", () => {
                const selectedValue = dropdown.value;
                const day = row.children[0].textContent.trim();
                timetable[day][colIndex - 1] = {
                    time: table.querySelector(`th:nth-child(${colIndex})`).textContent.trim(),
                    course: selectedValue || "--",
                };
            });

            cell.textContent = "";
            cell.appendChild(dropdown);
        });
    });
}

// Save timetable
function saveTimetable() {
    const table = document.querySelector(".timetable-table");
    const editButton = document.getElementById("editButton");
    const saveButton = document.getElementById("saveButton");

    editButton.style.display = "inline-block";
    saveButton.style.display = "none";

    const rows = table.querySelectorAll("tr:not(:first-child)");
    rows.forEach(row => {
        const day = row.children[0].textContent.trim();
        timetable[day] = [];

        const cells = Array.from(row.children).slice(1); // Skip the day column
        cells.forEach((cell, index) => {
            const dropdown = cell.querySelector("select");
            if (dropdown) {
                const selectedValue = dropdown.value;
                timetable[day].push({ time: table.querySelector(`th:nth-child(${index + 2})`).textContent.trim(), course: selectedValue || "--" });
            }
        });
    });

    generateFullTimetable(); // Re-render the timetable in view mode
}



function generateCurrentDayTimetable() {
    const timetableDiv = document.getElementById("currentDayTimetable");
    const today = new Date();
    const currentDay = today.toLocaleString("default", { weekday: "long" });
    const table = createTimetableTable({ [currentDay]: timetable[currentDay] }, true);
    loadStudents("");
    table.querySelectorAll("td").forEach((cell, index) => {
        const course = cell.textContent.trim();
        if (index === 0) return;

        if (course && course != '--') {
            // console.log("Hello : " + course);
            cell.style.cursor = "pointer";
            cell.addEventListener("click", () => {
                // Remove the 'selected' class from all cells
                table.querySelectorAll("td").forEach(c => c.classList.remove("active-slot"));

                // Add the 'selected' class to the clicked cell
                cell.classList.add("active-slot");

                loadStudents(course);

                // Create a popup message
                const popup = document.createElement("div");
                popup.id = "login-popup";
                popup.textContent = `Loaded students for ${course}`;
                document.body.appendChild(popup);

                // Style the popup
                const style = document.createElement("style");
                style.textContent = `
      #login-popup {
        position: fixed;
        top: -50px;
        left: 50%;
        transform: translateX(-50%);
        background-color:#4CAF50;
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
                // alert(`Loading students for ${course}`);
            });
        }
    });

    timetableDiv.innerHTML = "";
    timetableDiv.appendChild(table);
}



document.getElementById('headingTwo').addEventListener('click', () => {
    // console.log("SecondHeading");
    generateCurrentDayTimetable();
});
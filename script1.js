
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getDatabase, ref, set, onValue, update, get, remove } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

// Your Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCO-iPHycqRH-OkItRob92wOp9Hd1gau9o",
//     authDomain: "attendance-dashboard-55466.firebaseapp.com",
//     databaseURL: "https://attendance-dashboard-55466-default-rtdb.firebaseio.com",
//     projectId: "attendance-dashboard-55466",
//     storageBucket: "attendance-dashboard-55466.appspot.com",
//     messagingSenderId: "450332479502",
//     appId: "1:450332479502:web:182976f8c41513ebe4ec5f"
// };

const firebaseConfig = {
    apiKey: "AIzaSyCO-iPHycqRH-OkItRob92wOp9Hd1gau9o",
    authDomain: "attendance-dashboard-55466.firebaseapp.com",
    databaseURL: "https://attendance-dashboard-55466-default-rtdb.firebaseio.com",
    projectId: "attendance-dashboard-55466",
    storageBucket: "attendance-dashboard-55466.firebasestorage.app",
    messagingSenderId: "450332479502",
    appId: "1:450332479502:web:182976f8c41513ebe4ec5f",
    measurementId: "G-074TBX3VLC"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);






//Auth-token checking system
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("auth");
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
    Saturday: [
        { time: "10:00-11:00", course: "History" },
        { time: "22:00-23:00", course: "Literature" },
        { time: "12:00-13:00", course: "Art" },
        { time: "13:00-14:00", course: "Science" },
        { time: "14:00-15:00", course: "Mathematics" }
    ],
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
            // Create a popup message
            const popup = document.createElement("div");
            popup.id = "login-popup";
            popup.textContent = "Network Error ! Try After Sometime";
            document.body.appendChild(popup);

            // Style the popup
            const style = document.createElement("style");
            style.textContent = `
                    #login-popup {
                        position: fixed;
                        top: -50px;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: rgb(255,0,0);
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
            }, 2000);
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
                id: studentId,
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














































































function applyRedFlagLogic() {
    const table = document.querySelector(".attendance-table");
    // console.log(table);
    if (!table) return;

    const rows = table.querySelectorAll("tr.table_row_Class");
    rows.forEach(row => {
        // Get the last three attendance cells, including the current day cell
        const attendanceCells = Array.from(row.querySelectorAll("td")).slice(-3);

        // Map attendance statuses
        const statuses = attendanceCells.map(cell => {
            if (cell.querySelector('input[type="radio"]:checked')) {
                return cell.querySelector('input[type="radio"]:checked').value; // Get selected radio button value
            }
            return cell.textContent.trim(); // For older days where attendance is plain text
        });

        // Check if all three statuses are 'A' (Absent)
        const isRedFlag = statuses.every(status => status === 'A');

        if (isRedFlag) {
            row.classList.add('red-flag');
        } else {
            row.classList.remove('red-flag');
        }
    });
}


window.loadStudents = function (courseSelect) {
    course = courseSelect;

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
        const currentDateString = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

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
        headerRow.innerHTML = `<th>Student Name</th><th>Phone Number</th>${formattedDates.map(date => `<th>${date}</th>`).join('')}<th>Today</th>`;
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

                    // Phone Number Column
                    const phoneCell = document.createElement('td');
                    phoneCell.textContent = student.phone || 'N/A';
                    attendanceRow.appendChild(phoneCell);

                    // Attendance Columns
                    const attendanceStatusArray = [];
                    previousDates.forEach(date => {
                        const attendanceCell = document.createElement('td');
                        const attendanceStatus = student.attendance?.[courseSelect]?.[date];

                        if (!attendanceStatus) {
                            attendanceCell.textContent = '-';
                            attendanceCell.className = 'empty';
                        } else {
                            attendanceCell.textContent = attendanceStatus;
                            attendanceCell.className = attendanceStatus === 'P' ? 'present' : (attendanceStatus === 'A' ? 'absent' : 'leave');
                        }

                        attendanceStatusArray.push(attendanceStatus || '-');
                        attendanceRow.appendChild(attendanceCell);
                    });

                    // Current Day Attendance Column with Radio Buttons
                    const currentDayCell = document.createElement('td');
                    // const currentDayAttendance = student.attendance?.[courseSelect]?.[currentDateString];
                    const currentDayAttendance = student.attendance?.[courseSelect]?.[currentDate.toISOString().split('T')[0]];
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
                    attendanceStatusArray.push(currentDayAttendance || '-');
                    attendanceRow.appendChild(currentDayCell);

                    // Append Row to Table
                    table.appendChild(attendanceRow);
                }
            });
            
        });
        studentList.appendChild(table);
        
    }

    // Apply red-flag logic after rendering the table
    applyRedFlagLogic();
};





































let course;

window.markAttendance = function () {

    if(course == ""){
            // Create and show the popup message
        const popup = document.createElement("div");
        popup.id = "login-popup";
        popup.textContent = `Select Any Subject !`;
        document.body.appendChild(popup);

        // Style the popup
        const style = document.createElement("style");
        style.textContent = `
            #login-popup {
                position: fixed;
                top: -50px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgb(255,0,0);
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
        return;
    }

    const studentList = document.getElementById('studentList');
    const radioButtons = studentList.querySelectorAll('input[type="radio"]:checked'); // Select checked radio buttons
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    // 
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
    
    // loadStudents(course);    
    applyRedFlagLogic();

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
    document.getElementById('editStudentTab').classList.remove('active');
    document.getElementById('editCoursesTab').classList.remove('active');
    fetchCoursesFromDatabaseAndUpdate();
    showTab('addStudent');
});
document.getElementById('markAttendanceTab').addEventListener('click', () => {
    document.getElementById('addStudentTab').classList.remove('active');
    document.getElementById('editStudentTab').classList.remove('active');
    document.getElementById('markAttendanceTab').classList.add('active');
    document.getElementById('editCoursesTab').classList.remove('active');
    showTab('markAttendance');
    loadDataFromDatabase();

    // displayTimetable(); // Display the timetable when switching to the attendance tab
});

document.getElementById('editStudentTab').addEventListener('click', () => {
    // console.log("Edit Mode");
    document.getElementById('addStudentTab').classList.remove('active');
    document.getElementById('markAttendanceTab').classList.remove('active');
    document.getElementById('editStudentTab').classList.add('active');
    document.getElementById('editCoursesTab').classList.remove('active');
    populateCourses("");
    showTab('editStudent');
});

document.getElementById('editCoursesTab').addEventListener('click', () => {
    // console.log("Edit Mode");
    document.getElementById('addStudentTab').classList.remove('active');
    document.getElementById('markAttendanceTab').classList.remove('active');
    document.getElementById('editStudentTab').classList.remove('active');
    document.getElementById('editCoursesTab').classList.add('active');
    showTab('editCourses');
});
fetchCoursesFromDatabaseAndUpdate();












// document.addEventListener('DOMContentLoaded', () => {
//     const profileIcon = document.getElementById('profileIcon');
//     const profileDropdown = document.getElementById('profileDropdown');

//     // Function to toggle the dropdown visibility
//     const toggleDropdown = () => {
//         const isDropdownVisible = profileDropdown.style.display === 'block';
//         profileDropdown.style.display = isDropdownVisible ? 'none' : 'block';
//     };

//     // Function to close the dropdown
//     const closeDropdown = () => {
//         profileDropdown.style.display = 'none';
//     };

//     // Add click event to profile icon
//     profileIcon.addEventListener('click', (event) => {
//         event.stopPropagation(); // Prevent click from propagating to the document
//         toggleDropdown();
//     });

//     // Close the dropdown when clicking anywhere else
//     document.addEventListener('click', (event) => {
//         if (!profileDropdown.contains(event.target)) {
//             closeDropdown();
//         }
//     });
// });















// Logout functionality
const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", () => {
    console.log("Logged out");
    localStorage.removeItem("auth");
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
const databaseRef = ref(db, 'Data/timetable'); // Replace 'your/path' with the actual location you want to store the data
// set(databaseRef, {
//   timetable: timetable_01,
//   subjects: subjects
// })


//Database Time Table saving once.

// set(databaseRef,timetable1)
//   .then(() => {
//     console.log('Data successfully saved!');
//   })
//   .catch((error) => {
//     console.error('Error saving data:', error);});



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
            generateCurrentDayTimetable();
            generateFullTimetable(); // Render timetable after loading

        })
        .catch((error) => {
            // Create a popup message
            console.error("Error fetching timetable data:", error);
            const popup = document.createElement("div");
            popup.id = "login-popup";
            popup.textContent = "Network Error ! Try After Sometime";
            document.body.appendChild(popup);

            // Style the popup
            const style = document.createElement("style");
            style.textContent = `
                    #login-popup {
                        position: fixed;
                        top: -50px;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: rgb(255,0,0);
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
            }, 2000);
        });

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
        .catch((error) => { 
            console.error("Error fetching subjects data:", error);
            // Create a popup message
            const popup = document.createElement("div");
            popup.id = "login-popup";
            popup.textContent = "Network Error ! Try After Sometime";
            document.body.appendChild(popup);

            // Style the popup
            const style = document.createElement("style");
            style.textContent = `
                    #login-popup {
                        position: fixed;
                        top: -50px;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: rgb(255,0,0);
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
            }, 2000);
        } );
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
    editButton.style.float = 'right';
    editButton.style.borderRadius = "5px";
    editButton.style.padding = "10px 15px";
    editButton.style.margin = "5px 0px";
    editButton.addEventListener("click", enableEditMode);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Timetable";
    saveButton.id = "saveButton";
    saveButton.style.display = "none";
    saveButton.style.backgroundColor = "#ffeb3b";
    saveButton.style.color = "#000";
    saveButton.style.border = "none";
    saveButton.style.padding = "10px 15px";
    saveButton.style.margin = "5px 0px";
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
    // loadDataFromDatabase();
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

    const headerRow = table.querySelector("tr");
    headerRow.querySelectorAll("th").forEach((header, colIndex) => {
        if (colIndex === 0) return; // Skip the first column (Day names)

        const currentTimeSlot = header.textContent.trim();

        // Create an input element for editing the time slot
        const timeSlotInput = document.createElement("input");
        timeSlotInput.type = "text";
        timeSlotInput.value = currentTimeSlot;
        timeSlotInput.className = "time-slot-input";

        // Update the timetable time slot when the input value changes
        timeSlotInput.addEventListener("input", () => {
            table.querySelectorAll("tr").forEach((row, rowIndex) => {
                if (rowIndex === 0) return; // Skip the header row

                const day = row.children[0].textContent.trim();
                if (timetable[day] && timetable[day][colIndex - 1]) {
                    timetable[day][colIndex - 1].time = timeSlotInput.value;
                }
            });
            // console.log(timetable);
        });

        // Replace the header text with the input element
        header.textContent = "";
        header.appendChild(timeSlotInput);
    });



    table.querySelectorAll("tr").forEach((row, rowIndex) => {
        // if (rowIndex === 0) return;
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
                    course: selectedValue || "--",
                    time: table.querySelector(`th:nth-child(${colIndex-1})`).textContent.trim(),
                };
                // console.log(timetable);
            });

            cell.textContent = "";
            cell.appendChild(dropdown);
        });
    });
    // console.log("Final" + timetable);
}

// Save timetable
function saveTimetable() {
    const table = document.querySelector(".timetable-table");
    const editButton = document.getElementById("editButton");
    const saveButton = document.getElementById("saveButton");

    editButton.style.display = "inline-block";
    saveButton.style.display = "none";

    const headerRow = table.querySelector("tr");
    const timeSlots = [];

    // Collect updated time slots from the header row
    headerRow.querySelectorAll("th").forEach((header, colIndex) => {
        if (colIndex === 0) return; // Skip the first column (Day names)
        
        const timeSlotInput = header.querySelector("input");
        if (timeSlotInput) {
            timeSlots.push(timeSlotInput.value.trim());
        }
    });

    const rows = table.querySelectorAll("tr:not(:first-child)");
    rows.forEach(row => {
        const day = row.children[0].textContent.trim();
        timetable[day] = [];

        const cells = Array.from(row.children).slice(1); // Skip the day column
        cells.forEach((cell, index) => {
            const dropdown = cell.querySelector("select");
            if (dropdown) {
                const selectedValue = dropdown.value;
                timetable[day].push({
                    time: timeSlots[index] || "--", // Use the updated time slot
                    course: selectedValue || "--",
                });
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
    const downloadAbsentListCourse = document.getElementById('downloadAbsentListCourse');


    loadStudents("");
    downloadAbsentListCourse.style.display='none';
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
                downloadAbsentListCourse.style.display='block';
                downloadAbsentListCourse.innerHTML=`For ${course}`;

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

document.getElementById('headingOne').addEventListener('click', () => {
    // console.log("SecondHeading");
    // generateCurrentDayTimetable();
    generateFullTimetable();

});

document.getElementById('headingTwo').addEventListener('click', () => {
    // console.log("SecondHeading");
    generateCurrentDayTimetable();
});






























//Edit Student Tab


function fetchAllStudents() {
    const studentRef = ref(db, 'students'); // Reference to the 'students' object in the database
    const studentSelect = document.getElementById('studentSelect');

    get(studentRef).then(snapshot => {
        if (snapshot.exists()) {
            const students = snapshot.val();
            Object.keys(students).forEach(studentId => {
                const student = students[studentId];
                const option = document.createElement('option');
                option.value = studentId; // Use Firebase's key as the value
                option.textContent = student.name; // Assuming 'name' is a property of your student object
                studentSelect.appendChild(option);
            });
        } else {
            console.log("No students found in the database.");
        }
    }).catch(error => {
        console.error("Error fetching students:", error);
        // Create a popup message
        const popup = document.createElement("div");
        popup.id = "login-popup";
        popup.textContent = "Network Error ! Try After Sometime";
        document.body.appendChild(popup);

        // Style the popup
        const style = document.createElement("style");
        style.textContent = `
                #login-popup {
                    position: fixed;
                    top: -50px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgb(255,0,0);
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
        }, 2200);
    });
}


function fetchStudentDetails(studentId) {
    const studentRef = ref(db, `students/${studentId}`); // Reference to the specific student in the database

    return get(studentRef).then(snapshot => {
        if (snapshot.exists()) {
            return snapshot.val(); // Return the student details as an object
        } else {
            console.log("Student not found in the database.");
            return null; // Return null if no data exists for the student
        }
    }).catch(error => {
        console.error("Error fetching student details:", error);
        throw error; // Propagate the error for further handling
    });
}





function handleStudentSelection() {
    const studentSelect = document.getElementById('studentSelect');
    const studentId = studentSelect.value;

    if (studentId) {
        // console.log("Selected : " + studentId);
        fetchStudentDetails(studentId).then(student => {
            if (student) {
                // console.log("Clear to go ...");
                // populateStudentDetails(student);
                populateCourses(student);
            }
        }).catch(error => {
            console.error("Failed to fetch student details:", error);
        });
    } else {
        populateCourses("");
    }
}

document.getElementById('studentSelect').addEventListener('change', handleStudentSelection);



document.getElementById('editStudentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const studentId = document.getElementById('studentName_01').value;
    const updatedDetails = {
        name: document.getElementById('studentName_01').value,
        id: document.getElementById('studentId_01').value,
        email: document.getElementById('studentEmail_01').value,
        phone: document.getElementById('studentPhone_01').value,
        batch: document.getElementById('studentBatch_01').value,
        courses: Array.from(document.querySelectorAll('.courseSelect_01')).map(select => select.value),
    };

    try {
        // Update student details in Firebase
        const studentRef = ref(db, `students/${studentId}`);
        update(studentRef, updatedDetails);

        // alert('Student details updated successfully!');
        // Create a popup message
        const popup = document.createElement("div");
        popup.id = "login-popup";
        popup.textContent = `Student details updated successfully!`;
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


        populateCourses("");


        // Hide the popup after 1.7 seconds
        setTimeout(() => {
            popup.classList.add("hide");
        }, 1400);
    } catch (error) {
        console.error('Error updating student details:', error);
        alert('Failed to update student details. Please try again.');
    }
});

// Initialize the form
fetchAllStudents();


const courseDropdowns = document.getElementById('courseDropdowns_01');
const addCourseBtn = document.getElementById('addCourseBtn_01');
var availableCourses_01;


async function addCourseRow(selectedValue = "") {
    try {
        // Fetch the available courses from Firebase
        const subjectsRef = ref(db, 'Data/subjects');
        const snapshot = await get(subjectsRef);

        if (snapshot.exists()) {
            availableCourses_01 = snapshot.val(); // Assuming this is an array of course names
        } else {
            console.error("No subjects found in the database.");
        }

    } catch (error) {
        console.error("Error fetching available courses:", error);
    }

    const courseRow = document.createElement('div');
    courseRow.classList.add('courseRow');
    courseRow.style.display = 'flex';
    courseRow.style.alignItems = 'center';

    // Create the course select dropdown
    const select = document.createElement('select');
    select.classList.add('courseSelect_01');
    select.innerHTML = `<option value="">Select a Course</option>`;
    availableCourses_01.forEach(course => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        select.appendChild(option);
    });
    select.value = selectedValue; // Set the selected value if provided

    // Create the remove button
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('removeCourseBtn');
    removeBtn.textContent = "X";
    removeBtn.style.backgroundColor = 'rgb(255,0,0)';
    // removeBtn.style.borderRadius = '5px';
    removeBtn.type = "button";
    // removeBtn.style.marginLeft = "10px";
    removeBtn.onclick = () => {
        courseDropdowns.removeChild(courseRow);
    };

    // Append the select and remove button to the course row
    courseRow.appendChild(select);
    courseRow.appendChild(removeBtn);

    // Append the course row to the container
    courseDropdowns.appendChild(courseRow);
}


addCourseBtn.addEventListener('click', () => {
    addCourseRow();
});

function populateCourses(student) {

    if (student === "") {

        document.getElementById('studentSelect').value = '';
        document.getElementById('studentName_01').value = '';
        document.getElementById('studentId_01').value = '';
        document.getElementById('studentEmail_01').value = '';
        document.getElementById('studentPhone_01').value = '';
        document.getElementById('studentBatch_01').value = '';

        courseDropdowns.innerHTML = '';
    } else {


        document.getElementById('studentName_01').value = student.name;
        document.getElementById('studentId_01').value = student.id;
        document.getElementById('studentEmail_01').value = student.email;
        document.getElementById('studentPhone_01').value = student.phone;
        document.getElementById('studentBatch_01').value = student.batch;

        courseDropdowns.innerHTML = ''; // Clear existing courses
        student.courses.forEach(course => addCourseRow(course));
    }
}
































//EditCourses


const courseList = document.getElementById('course-list');
const addCourseBtn_01 = document.getElementById('add-course-btn');
const courseModal = document.getElementById('course-modal');
const closeModal = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const courseNameInput = document.getElementById('course-name');
const saveCourseBtn = document.getElementById('save-course-btn');

// State Variables
let editingCourseKey = null;

// Load Courses
function loadCourses() {
    const coursesRef = ref(db, 'Data/subjects');
    onValue(coursesRef, (snapshot) => {
        courseList.innerHTML = '';
        const courses = snapshot.val();
        for (const key in courses) {
            createCourseItem(key, courses[key]);
        }
    });
}



function createCourseItem(index, name) {
    const courseItem = document.createElement('div');
    courseItem.className = 'course-item';

    const courseName = document.createElement('span');
    courseName.className = 'course-name';
    courseName.textContent = name;

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('editButton');
    editBtn.addEventListener('click', () => openModal('Edit Course', index, name));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Remove';
    deleteBtn.classList.add('deleteButton');
    deleteBtn.style.background = 'red';
    deleteBtn.addEventListener('click', () => deleteCourse(index));

    buttonGroup.appendChild(editBtn);
    buttonGroup.appendChild(deleteBtn);

    courseItem.appendChild(courseName);
    courseItem.appendChild(buttonGroup);

    courseList.appendChild(courseItem);
}




function saveCourse() {
    const courseName = courseNameInput.value.trim();
    if (!courseName) {
        alert('Please enter a course name.');
        return;
    }

    const subjectsRef = ref(db, 'Data/subjects');
    if (editingCourseKey !== null) {
        // Update the specific index in the subjects array
        get(subjectsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const subjects = snapshot.val();
                subjects[editingCourseKey] = courseName; // Update the specific course
                set(subjectsRef, subjects)
                    .then(() => {
                        // console.log('Course updated successfully.');
                        closeModalFn();
                        // Create a popup message
                        const popup = document.createElement("div");
                        popup.id = "login-popup";
                        popup.textContent = `${courseName} updated successfully.`;
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
                    .catch((error) => {
                        console.error('Error updating course:', error);
                    });
            } else {
                console.error('Subjects list not found in the database.');
            }
        });
    } else {
        // Add a new course
        get(subjectsRef).then((snapshot) => {
            let subjects = snapshot.exists() ? snapshot.val() : [];
            subjects.push(courseName); // Add the new course to the array
            set(subjectsRef, subjects)
                .then(() => {
                    // console.log('Course added successfully.');
                    closeModalFn();
                    // Create a popup message
                    const popup = document.createElement("div");
                    popup.id = "login-popup";
                    popup.textContent = `${courseName} added successfully.`;
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
                .catch((error) => {
                    console.error('Error adding course:', error);
                });
        });
    }
}



let courseToDelete = null; // Temporary variable to store the course key to delete

function deleteCourse(key) {
    courseToDelete = key; // Store the course key
    openConfirmModal(); // Open the confirmation modal
}

function openConfirmModal() {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'flex'; // Show the modal
}

function closeConfirmModal() {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'none'; // Hide the modal
}

// Handle modal button clicks
document.getElementById('confirmYesBtn').addEventListener('click', () => {
    if (courseToDelete !== null) {
        remove(ref(db, `Data/subjects/${courseToDelete}`))
            .then(() => {
                console.log('Course deleted successfully.');

                // Create a popup message
                const popup = document.createElement("div");
                popup.id = "login-popup";
                popup.textContent = `Course deleted successfully.`;
                document.body.appendChild(popup);

                courseToDelete = null; // Reset the variable

                // Style the popup
                const style = document.createElement("style");
                style.textContent = `
                #login-popup {
                    position: fixed;
                    top: -50px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color:rgb(255,0,0);
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
                console.error('Error deleting course:', error);
            });
    }
    closeConfirmModal(); // Close the modal
});

document.getElementById('confirmNoBtn').addEventListener('click', () => {
    courseToDelete = null; // Reset the variable
    closeConfirmModal(); // Close the modal
});

// Delete Course
// function deleteCourse(key) {
//     if (confirm('Are you sure you want to delete this course?')) {
//         remove(ref(db, `Data/subjects/${key}`));
//     }
// }

// Open Modal
function openModal(title, key = null, name = '') {
    modalTitle.textContent = title;
    courseNameInput.value = name;
    editingCourseKey = key;
    courseModal.style.display = 'block';
}

// Close Modal
function closeModalFn() {
    courseModal.style.display = 'none';
    courseNameInput.value = '';
    editingCourseKey = null;
}

// Event Listeners
addCourseBtn_01.addEventListener('click', () => openModal('Add Course'));
closeModal.addEventListener('click', closeModalFn);
saveCourseBtn.addEventListener('click', saveCourse);
window.addEventListener('click', (e) => {
    if (e.target === courseModal) closeModalFn();
});

// Initialize
loadCourses();































// Code for Download absent student list 

// Function to generate a file of absent students
window.downloadAbsentList = function () {
    const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const absentList = [];
    const studentsRef = ref(db, 'students'); // Reference to all students

    // Ensure a course is selected
    if (!course) {
        alert("Please select a course before downloading the absent list.");
        return;
    }

    // Fetch all students' data
    get(studentsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const students = snapshot.val();

            // Loop through all students to check attendance
            for (const [studentName, studentData] of Object.entries(students)) {
                const attendanceStatus = studentData.attendance?.[course]?.[currentDate]; // Get today's attendance
                const phoneNumber = studentData.phone || "N/A"; // Get phone number or default to "N/A"

                if (attendanceStatus === 'A') {
                    absentList.push(`${studentName} (Phone: ${phoneNumber})`); // Add name and phone to absent list
                }
            }

            // Generate the text file content
            const content = absentList.length
                ? `Absent Students Report\nCourse: ${course}\nDate: ${currentDate}\n\n` +
                  `-----------------------------------\n` +
                  absentList.join('\n') +
                  `\n\n-----------------------------------\n`
                : `Absent Students Report\nCourse: ${course}\nDate: ${currentDate}\n\nNo absent students.`;

            // Create a blob and a link to download the file
            const blob = new Blob([content], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Absent_Students_${course}_${currentDate}.txt`;
            link.click();

        } else {
            console.error('No students found in the database.');
        }
    }).catch((error) => {
        console.error('Error fetching students data:', error);
    });
};







//For All Courses 

// Function to download a course-wise formatted absent list with phone numbers
window.downloadAllCoursesAbsentList = function () {
    const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const coursesAbsentData = {};
    const studentsRef = ref(db, 'students'); // Reference to all students

    // Fetch all students' data
    get(studentsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const students = snapshot.val();

            // Loop through all students to check attendance course-wise
            for (const [studentName, studentData] of Object.entries(students)) {
                const attendance = studentData.attendance || {};
                const phoneNumber = studentData.phone || "N/A"; // Get phone number or default to "N/A"

                for (const [courseName, courseAttendance] of Object.entries(attendance)) {
                    const attendanceStatus = courseAttendance[currentDate]; // Get today's attendance for this course
                    if (attendanceStatus === 'A') {
                        // Add student to the absent list for this course
                        if (!coursesAbsentData[courseName]) {
                            coursesAbsentData[courseName] = [];
                        }
                        coursesAbsentData[courseName].push(`${studentName} (Phone: ${phoneNumber})`);
                    }
                }
            }

            // Generate the text file content
            let content = `Absent Students Report (Date: ${currentDate})\n`;
            content += `============================================================\n\n`;

            for (const [courseName, absentStudents] of Object.entries(coursesAbsentData)) {
                content += `Course: ${courseName}\n`;
                content += `-----------------------------------\n`;
                content += absentStudents.length
                    ? absentStudents.join('\n') + '\n'
                    : 'No absent students\n';
                content += `\n============================================================\n\n`;
            }

            if (Object.keys(coursesAbsentData).length === 0) {
                content += 'No absent students found for any course.\n';
            }

            // Create a blob and a link to download the file
            const blob = new Blob([content], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `All_Courses_Absent_${currentDate}.txt`;
            link.click();

        } else {
            console.error('No students found in the database.');
        }
    }).catch((error) => {
        console.error('Error fetching students data:', error);
    });
};

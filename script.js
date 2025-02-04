import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// const submitButton = document.getElementById("submit");
// const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
// const main = document.getElementById("main");
// const createacct = document.getElementById("create-acct")

// const signupEmailIn = document.getElementById("email-signup");
// const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
// const signupPasswordIn = document.getElementById("password-signup");
// const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
// const createacctbtn = document.getElementById("create-acct-btn");

// const returnBtn = document.getElementById("return-btn");

var email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword;

// createacctbtn.addEventListener("click", function() {
//   var isVerified = true;

//   signupEmail = signupEmailIn.value;
//   confirmSignupEmail = confirmSignupEmailIn.value;
//   if(signupEmail != confirmSignupEmail) {
//       window.alert("Email fields do not match. Try again.")
//       isVerified = false;
//   }

//   signupPassword = signupPasswordIn.value;
//   confirmSignUpPassword = confirmSignUpPasswordIn.value;
//   if(signupPassword != confirmSignUpPassword) {
//       window.alert("Password fields do not match. Try again.")
//       isVerified = false;
//   }

//   if(signupEmail == null || confirmSignupEmail == null || signupPassword == null || confirmSignUpPassword == null) {
//     window.alert("Please fill out all required fields.");
//     isVerified = false;
//   }

//   if(isVerified) {
//     createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
//       .then((userCredential) => {
//       // Signed in 
//       const user = userCredential.user;
//       // ...
//       window.alert("Success! Account created.");

//       main.style.display = "block";
//       createacct.style.display = "none";
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // ..
//       window.alert("Error occurred. Try again.");
//     });
//   }
// });

// submitButton.addEventListener("click", function () {
//   email = emailInput.value;
//   console.log(email);
//   password = passwordInput.value;
//   console.log(password);

//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       console.log("Success! Welcome back!");
//       //   window.alert("Success! Welcome back!");
//       window.location.href = 'dashboard.html';

//       // ...
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log("Error occurred. Try again.");
//       window.alert("Error occurred. Try again.");
//     });
// });





// document.getElementById("loginForm").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   email = emailInput.value;
//   console.log(email);
//   password = passwordInput.value;
//   console.log(password);



//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       console.log("Success! Welcome back!");
//       localStorage.setItem("auth-token", "secure-token");

//       alert("Login successful!");
//       window.location.href = "dashboard.html";
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log("Error occurred. Try again.");
//       window.alert("Error occurred. Try again.");
//     });
// });

















document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  email = emailInput.value;
  console.log(email);
  password = passwordInput.value;
  console.log(password);

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("Success! Welcome back!");
      localStorage.setItem("auth", "secure-token");

      // Create a popup message
      const popup = document.createElement("div");
      popup.id = "login-popup";
      popup.textContent = "Login successful! Redirecting to dashboard...";
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

      // Redirect to dashboard after 2.2 seconds
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1800);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error occurred. Try again.");
      window.alert("Error occurred. Try again.");
    });
});





// function FormSubmited() {
//   email = emailInput.value;
//   console.log(email);
//   password = passwordInput.value;
//   console.log(password);

//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       console.log("Success! Welcome back!");
//       //   window.alert("Success! Welcome back!");
//       window.location.href = 'dashboard.html';

//       // fetch("dashboard.html")
//       //   .then(response => response.text())
//       //   .then(html => {
//       //     document.documentElement.innerHTML = html;
//       //     history.pushState(null, "", "dashboard.html");
//       //   })
//       //   .catch(error => console.error("Error:", error));



//       // ...
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log("Error occurred. Try again.");
//       window.alert("Error occurred. Try again.");
//     });
// }

// signupButton.addEventListener("click", function() {
//     main.style.display = "none";
//     createacct.style.display = "block";
// });

// returnBtn.addEventListener("click", function() {
//     main.style.display = "block";
//     createacct.style.display = "none";
// });

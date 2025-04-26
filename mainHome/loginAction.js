function login() {
 const userTypeSelect = document.querySelector('select[name="userType"]');
 const regNumbInput = document.querySelector('input[name="regNumb"]');
 const passwordInput = document.querySelector('input[name="password"]');

 const userType = userTypeSelect.value;
 const regNumb = regNumbInput.value;
 const password = passwordInput.value;

 // Basic validation (replace with your actual authentication logic)
 if (!userType || !regNumb || !password) {
   alert("Please fill in all fields!");
   return;
 }

 // Replace with your logic to verify username and password based on user type (Teacher/Student)
 if (userType === "teacher" && verifyTeacher(regNumb, password)) {
   window.location.href = "teacherHome.html";
 } else if (userType === "student" && verifyStudent(regNumb, password)) {
   window.location.href = "studentHome.html";
 } else {
   alert("Invalid login credentials!");
 }
}

// Replace these functions with your actual logic to verify teacher/student credentials
function verifyTeacher(regNumb, password) {
 // Implement your logic to check username and password against teacher database
 return (regNumb === "12345" && password === "teacher123"); // Replace with actual validation
}

function verifyStudent(regNumb, password) {
 // Implement your logic to check username and password against student database
 return (regNumb === "54321" && password === "student456"); // Replace with actual validation
}

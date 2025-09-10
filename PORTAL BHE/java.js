// --- Login/Registration Form Elements ---
const authContainer = document.getElementById('authContainer');
const studentLoginForm = document.getElementById('studentLoginForm');
const studentEnrollmentForm = document.getElementById('studentEnrollmentForm');
const teacherLoginForm = document.getElementById('teacherLoginForm');
const teacherRegisterForm = document.getElementById('teacherRegisterForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const showStudentBtn = document.getElementById('showStudent');
const showTeacherBtn = document.getElementById('showTeacher');
const showStudentEnrollmentLink = document.getElementById('showStudentEnrollmentLink');
const showStudentLoginLink = document.getElementById('showStudentLoginLink');
const showTeacherRegisterLink = document.getElementById('showTeacherRegister');
const showTeacherLoginLink = document.getElementById('showTeacherLoginLink');
const forgotPasswordLinks = document.querySelectorAll('.forgot-password-link');
const backToLoginLink = document.getElementById('showAuthFormFromForgot');
const authErrorMessage = document.getElementById('authErrorMessage');

// --- Portal Elements ---
const studentPortal = document.getElementById('studentPortal');
const teacherPortal = document.getElementById('teacherPortal');
const portalSections = document.querySelectorAll('#studentPortal .portal-section');
const portalNavLinks = document.querySelectorAll('#studentPortal nav ul li a');
const studentNameDisplay = document.getElementById('studentNameDisplay');
const logoutButtonStudent = document.getElementById('logoutButtonStudent');
const logoutButtonTeacher = document.getElementById('logoutButtonTeacher');

// Student Dashboard Elements
const dashboardWelcome = document.getElementById('dashboard-welcome');
const gradesView = document.getElementById('grades-view');
const subjectsView = document.getElementById('subjects-view');
const scheduleView = document.getElementById('schedule-view');
const studentGradesTableBody = document.getElementById('student-grades-table-body');
const studentSubjectsTableBody = document.getElementById('student-subjects-table-body');
const showGradesLink = document.getElementById('showGradesLink');
const showSubjectsLink = document.getElementById('showSubjectsLink');
const showScheduleLink = document.getElementById('showScheduleLink');

// Profile Display Elements
const profileName = document.getElementById('profileName');
const profileProgram = document.getElementById('profileProgram');
const profileAddress = document.getElementById('profileAddress');
const profileContact = document.getElementById('profileContact');
const profileGender = document.getElementById('profileGender');
// MODIFIED: Changed from profileBirthMonth to profileBirthdate
const profileBirthdate = document.getElementById('profileBirthdate');
const profileBirthplace = document.getElementById('profileBirthplace');
const profileEmail = document.getElementById('profileEmail');

// Teacher Portal Elements
const addStudentButtonTeacher = document.getElementById('add-student-button-teacher');
const saveButtonTeacher = document.getElementById('save-button-teacher');
const gradesTableBody = document.getElementById('grades-table-body');
const messageBoxTeacher = document.getElementById('message-box-teacher');
const messageBoxContentTeacher = document.getElementById('message-content-teacher');
const messageBoxCloseTeacher = document.getElementById('message-box-close-teacher');
const messageBoxContainerTeacher = document.getElementById('message-box-container-teacher');

// Student Profile Picture
const studentProfilePicContainer = document.getElementById('student-profile-pic-container');
const studentProfilePic = document.getElementById('student-profile-pic');
const studentProfilePicSvg = document.getElementById('student-profile-pic-svg');
const studentProfilePicInput = document.getElementById('student-profile-pic-input');

// Teacher Profile Picture
const profilePicContainer = document.getElementById('profile-pic-container');
const profilePic = document.getElementById('profile-pic');
const profilePicSvg = document.getElementById('profile-pic-svg');
const profilePicInput = document.getElementById('profile-pic-input');


// --- Helper Functions ---
const showAuthForm = (formToShow, userType = null) => {
    const forms = [studentLoginForm, studentEnrollmentForm, teacherLoginForm, teacherRegisterForm, forgotPasswordForm];
    forms.forEach(form => form.classList.remove('active'));
    formToShow.classList.add('active');
    authErrorMessage.style.display = 'none';

    // Update auth toggle buttons
    showStudentBtn.classList.remove('active');
    showTeacherBtn.classList.remove('active');
    if (userType === 'student') {
        showStudentBtn.classList.add('active');
    } else if (userType === 'teacher') {
        showTeacherBtn.classList.add('active');
    }
};

const togglePortal = (show, userType) => {
    if (show) {
        authContainer.style.display = 'none';
        if (userType === 'student') {
            studentPortal.classList.add('active');
            teacherPortal.classList.remove('active');
            loadStudentDashboard();
            updateProfileDisplay();
        } else if (userType === 'teacher') {
            teacherPortal.classList.add('active');
            studentPortal.classList.remove('active');
            loadTeacherPortal();
        }
    } else {
        authContainer.style.display = 'flex';
        studentPortal.classList.remove('active');
        teacherPortal.classList.remove('active');
        sessionStorage.removeItem('loggedInStudentEmail');
        sessionStorage.removeItem('loggedInTeacherEmail');
        showAuthForm(studentLoginForm, 'student'); // Default back to student login
    }
};

const showMessage = (message, type = 'error') => {
    authErrorMessage.textContent = message;
    authErrorMessage.className = `message-display ${type}`;
    authErrorMessage.style.display = 'block';
};

// This function would be part of a proper login system, but for this localStorage demo, we'll just show the user-entered values
const updateProfileDisplay = () => {
    const loggedInStudentEmail = sessionStorage.getItem('loggedInStudentEmail');
    if (loggedInStudentEmail) {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const student = students.find(s => s.email === loggedInStudentEmail);
        if (student) {
            profileName.textContent = student.name;
            profileProgram.textContent = student.program;
            profileAddress.textContent = student.address;
            profileContact.textContent = student.contact;
            profileGender.textContent = student.gender;
            profileBirthdate.textContent = student.birthdate;
            profileBirthplace.textContent = student.birthplace;
            profileEmail.textContent = student.email;
            studentNameDisplay.textContent = student.name;
            // Load profile picture
            const profilePicData = localStorage.getItem(`profilePic-${loggedInStudentEmail}`);
            if (profilePicData) {
                studentProfilePic.src = profilePicData;
                studentProfilePic.classList.remove('hidden');
                studentProfilePicSvg.classList.add('hidden');
            } else {
                studentProfilePic.classList.add('hidden');
                studentProfilePicSvg.classList.remove('hidden');
            }
        }
    }
};

const getStudentEmailByFullName = (fullName) => {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.name === fullName);
    return student ? student.email : null;
};

const getStudentGrades = (studentName) => {
    const grades = JSON.parse(localStorage.getItem('teacher_grades')) || [];
    return grades.filter(grade => grade.fullName === studentName);
};

const getSubjectsAndTeachers = (studentName) => {
    const grades = getStudentGrades(studentName);
    const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    const subjects = grades.map(grade => {
        const teacher = teachers.find(t => t.name === grade.teacherName);
        return {
            subject: grade.subject,
            teacher: grade.teacherName,
        };
    });
    return subjects;
};

const loadStudentDashboard = () => {
    // Show the welcome message by default
    const sections = [dashboardWelcome, gradesView, subjectsView, scheduleView];
    sections.forEach(sec => sec.classList.remove('active'));
    dashboardWelcome.classList.add('active');

    // Load grades and subjects
    const loggedInStudentEmail = sessionStorage.getItem('loggedInStudentEmail');
    if (loggedInStudentEmail) {
        const student = (JSON.parse(localStorage.getItem('students')) || []).find(s => s.email === loggedInStudentEmail);
        if (student) {
            const studentGrades = getStudentGrades(student.name);
            studentGradesTableBody.innerHTML = ''; // Clear previous data
            studentGrades.forEach(grade => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${grade.subject}</td>
                    <td>${grade.grade1stSem}</td>
                    <td>${grade.grade2ndSem}</td>
                `;
                studentGradesTableBody.appendChild(row);
            });

            const studentSubjects = getSubjectsAndTeachers(student.name);
            studentSubjectsTableBody.innerHTML = ''; // Clear previous data
            studentSubjects.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.subject}</td>
                    <td>${item.teacher}</td>
                `;
                studentSubjectsTableBody.appendChild(row);
            });
        }
    }
};

const loadTeacherPortal = () => {
    const loggedInTeacherEmail = sessionStorage.getItem('loggedInTeacherEmail');
    if (loggedInTeacherEmail) {
        const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        const teacher = teachers.find(t => t.email === loggedInTeacherEmail);
        if (teacher) {
            const profilePicData = localStorage.getItem(`profilePic-${loggedInTeacherEmail}`);
            if (profilePicData) {
                profilePic.src = profilePicData;
                profilePic.classList.remove('hidden');
                profilePicSvg.classList.add('hidden');
            } else {
                profilePic.classList.add('hidden');
                profilePicSvg.classList.remove('hidden');
            }
        }
        populateTeacherGradesTable();
    }
};

const showTeacherMessageBox = (message) => {
    messageBoxContentTeacher.textContent = message;
    messageBoxContainerTeacher.classList.remove('hidden');
};

// Populate table from localStorage
const populateTeacherGradesTable = () => {
    const gradesData = JSON.parse(localStorage.getItem('teacher_grades')) || [];
    const loggedInTeacherEmail = sessionStorage.getItem('loggedInTeacherEmail');
    const loggedInTeacherName = (JSON.parse(localStorage.getItem('teachers')) || []).find(t => t.email === loggedInTeacherEmail)?.name;
    const myGrades = gradesData.filter(grade => grade.teacherName === loggedInTeacherName);
    gradesTableBody.innerHTML = '';
    myGrades.forEach(grade => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-3 sm:px-6 py-4 whitespace-nowrap">${grade.studentId}</td>
            <td class="px-3 sm:px-6 py-4 whitespace-nowrap">${grade.fullName}</td>
            <td class="px-3 sm:px-6 py-4 whitespace-nowrap">${grade.section}</td>
            <td class="px-3 sm:px-6 py-4 whitespace-nowrap">${grade.subject}</td>
            <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                <input type="number" value="${grade.grade1stSem}" min="0" max="100" class="w-20 text-center border rounded-md">
            </td>
            <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                <input type="number" value="${grade.grade2ndSem}" min="0" max="100" class="w-20 text-center border rounded-md">
            </td>
        `;
        gradesTableBody.appendChild(row);
    });
};

// --- Event Listeners ---
showStudentBtn.addEventListener('click', () => showAuthForm(studentLoginForm, 'student'));
showTeacherBtn.addEventListener('click', () => showAuthForm(teacherLoginForm, 'teacher'));
showStudentEnrollmentLink.addEventListener('click', (e) => {
    e.preventDefault();
    showAuthForm(studentEnrollmentForm, 'student');
});
showStudentLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showAuthForm(studentLoginForm, 'student');
});
showTeacherRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    showAuthForm(teacherRegisterForm, 'teacher');
});
showTeacherLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showAuthForm(teacherLoginForm, 'teacher');
});
backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showAuthForm(studentLoginForm, 'student'); // Default to student login after reset attempt
});
forgotPasswordLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const userType = e.target.getAttribute('data-user-type');
        forgotPasswordForm.setAttribute('data-user-type', userType);
        showAuthForm(forgotPasswordForm);
    });
});

// Student Login Form Submission
studentLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('studentLoginEmail').value;
    const password = document.getElementById('studentLoginPassword').value;
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.email === email && s.password === password);
    if (student) {
        sessionStorage.setItem('loggedInStudentEmail', email);
        togglePortal(true, 'student');
        // showMessage('Login successful!', 'success');
    } else {
        showMessage('Invalid email or password.');
    }
});

// Student Enrollment Form Submission
studentEnrollmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('enrollmentName').value;
    const program = document.getElementById('enrollmentProgram').value;
    const address = document.getElementById('enrollmentAddress').value;
    const contact = document.getElementById('enrollmentContact').value;
    const gender = document.querySelector('input[name="enrollmentGender"]:checked').value;
    const birthdate = document.getElementById('enrollmentBirthdate').value;
    const birthplace = document.getElementById('enrollmentBirthplace').value;
    const email = document.getElementById('enrollmentEmail').value;
    const password = document.getElementById('enrollmentPassword').value;
    const confirmPassword = document.getElementById('enrollmentConfirmPassword').value;

    if (password !== confirmPassword) {
        showMessage('Passwords do not match.');
        return;
    }
    const students = JSON.parse(localStorage.getItem('students')) || [];
    if (students.find(s => s.email === email)) {
        showMessage('An account with this email already exists.');
        return;
    }
    students.push({
        name,
        program,
        address,
        contact,
        gender,
        birthdate,
        birthplace,
        email,
        password
    });
    localStorage.setItem('students', JSON.stringify(students));
    showMessage('Student account created successfully! Please log in.', 'success');
    showAuthForm(studentLoginForm, 'student');
});

// Teacher Login Form Submission
teacherLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('teacherLoginEmail').value;
    const password = document.getElementById('teacherLoginPassword').value;
    const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    const teacher = teachers.find(t => t.email === email && t.password === password);
    if (teacher) {
        sessionStorage.setItem('loggedInTeacherEmail', email);
        togglePortal(true, 'teacher');
    } else {
        showMessage('Invalid email or password.');
    }
});

// Teacher Registration Form Submission
teacherRegisterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('teacherRegisterName').value;
    const email = document.getElementById('teacherRegisterEmail').value;
    const password = document.getElementById('teacherRegisterPassword').value;
    const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    if (teachers.find(t => t.email === email)) {
        showMessage('An account with this email already exists.');
        return;
    }
    teachers.push({
        name,
        email,
        password,
    });
    localStorage.setItem('teachers', JSON.stringify(teachers));
    showMessage('Teacher account created successfully! Please log in.', 'success');
    showAuthForm(teacherLoginForm, 'teacher');
});

// Forgot Password Form Submission
forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotPasswordEmail').value;
    const newPassword = document.getElementById('forgotPasswordNewPassword').value;
    const confirmPassword = document.getElementById('forgotPasswordConfirmPassword').value;
    const userType = forgotPasswordForm.getAttribute('data-user-type');

    if (newPassword !== confirmPassword) {
        showMessage('New passwords do not match.');
        return;
    }

    let users = JSON.parse(localStorage.getItem(`${userType}s`)) || [];
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex > -1) {
        // Update the password
        users[userIndex].password = newPassword;
        localStorage.setItem(`${userType}s`, JSON.stringify(users));
        showMessage('Password reset successful! You can now log in with your new password.', 'success');
        setTimeout(() => showAuthForm(userType === 'student' ? studentLoginForm : teacherLoginForm, userType), 2000);
    } else {
        showMessage('Email not found.');
    }
});

// Navigation
portalNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        portalSections.forEach(section => {
            section.classList.remove('active');
        });
        portalNavLinks.forEach(navLink => {
            navLink.classList.remove('active-link');
        });
        document.getElementById(targetId).classList.add('active');
        e.target.classList.add('active-link');

        if (targetId === 'dashboard') {
            // Reset to the main dashboard view when clicking "Dashboard"
            const sections = [dashboardWelcome, gradesView, subjectsView, scheduleView];
            sections.forEach(sec => sec.classList.remove('active'));
            dashboardWelcome.classList.add('active');
            loadStudentDashboard(); // Reload data just in case
        }
    });
});

// Dashboard sub-navigation
document.querySelectorAll('.dashboard-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.target.id.replace('show', '').replace('Link', '').toLowerCase() + '-view';
        const sections = [dashboardWelcome, gradesView, subjectsView, scheduleView];
        sections.forEach(sec => sec.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
    });
});

document.querySelectorAll('.back-to-dashboard').forEach(btn => {
    btn.addEventListener('click', () => {
        const sections = [dashboardWelcome, gradesView, subjectsView, scheduleView];
        sections.forEach(sec => sec.classList.remove('active'));
        dashboardWelcome.classList.add('active');
    });
});

// Logout
logoutButtonStudent.addEventListener('click', () => togglePortal(false, 'student'));
logoutButtonTeacher.addEventListener('click', () => togglePortal(false, 'teacher'));

// Teacher Portal - Add Student
addStudentButtonTeacher.addEventListener('click', () => {
    const studentId = document.getElementById('student-id').value;
    const fullName = document.getElementById('full-name').value;
    const section = document.getElementById('section').value;
    const subject = document.getElementById('subject').value;
    const grade1stSem = document.getElementById('grade-1st-sem').value;
    const grade2ndSem = document.getElementById('grade-2nd-sem').value;
    
    // Check if the student's full name exists in the student registration data
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const studentExists = students.some(s => s.name.toLowerCase() === fullName.toLowerCase());
    
    if (!studentId || !fullName || !section || !subject || !grade1stSem || !grade2ndSem) {
        showTeacherMessageBox('Please fill out all fields to add a student.');
        return;
    }

    if (!studentExists) {
        showTeacherMessageBox('Error: The student with this name is not registered.');
        return;
    }

    const gradesData = JSON.parse(localStorage.getItem('teacher_grades')) || [];
    const newGrade = {
        studentId,
        fullName,
        teacherName: JSON.parse(localStorage.getItem('teachers')).find(t => t.email === sessionStorage.getItem('loggedInTeacherEmail'))?.name || 'Unknown Teacher',
        section,
        subject,
        grade1stSem: parseInt(grade1stSem),
        grade2ndSem: parseInt(grade2ndSem),
    };

    gradesData.push(newGrade);
    localStorage.setItem('teacher_grades', JSON.stringify(gradesData));
    showTeacherMessageBox('Student and grades added successfully!');
    populateTeacherGradesTable();
    // Clear the form
    document.getElementById('student-form-teacher').querySelectorAll('input, select').forEach(el => el.value = '');
});

// Teacher Portal - Save Grades
saveButtonTeacher.addEventListener('click', () => {
    const loggedInTeacherEmail = sessionStorage.getItem('loggedInTeacherEmail');
    const loggedInTeacherName = (JSON.parse(localStorage.getItem('teachers')) || []).find(t => t.email === loggedInTeacherEmail)?.name;
    let gradesData = JSON.parse(localStorage.getItem('teacher_grades')) || [];
    
    // Create a temporary object to hold updated grades for the current teacher
    const updatedGradesByTeacher = [];

    // Get the updated grades from the table
    const tableRows = gradesTableBody.querySelectorAll('tr');
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const studentId = cells[0].innerText;
        const fullName = cells[1].innerText;
        const section = cells[2].innerText;
        const subject = cells[3].innerText;
        const grade1stSem = cells[4].querySelector('input').value;
        const grade2ndSem = cells[5].querySelector('input').value;

        updatedGradesByTeacher.push({
            studentId,
            fullName,
            teacherName: loggedInTeacherName,
            section,
            subject,
            grade1stSem: parseInt(grade1stSem),
            grade2ndSem: parseInt(grade2ndSem),
        });
    });

    // Filter out grades from the current teacher and then add the new list
    gradesData = gradesData.filter(grade => grade.teacherName !== loggedInTeacherName);
    gradesData.push(...updatedGradesByTeacher);
    
    localStorage.setItem('teacher_grades', JSON.stringify(gradesData));
    showTeacherMessageBox('Grades saved successfully!');
});

// Profile Picture Upload Logic
studentProfilePicContainer.addEventListener('click', () => {
    studentProfilePicInput.click();
});

profilePicContainer.addEventListener('click', () => {
    profilePicInput.click();
});

studentProfilePicInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgData = e.target.result;
            const loggedInStudentEmail = sessionStorage.getItem('loggedInStudentEmail');
            localStorage.setItem(`profilePic-${loggedInStudentEmail}`, imgData);
            studentProfilePic.src = imgData;
            studentProfilePic.classList.remove('hidden');
            studentProfilePicSvg.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
});

profilePicInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgData = e.target.result;
            const loggedInTeacherEmail = sessionStorage.getItem('loggedInTeacherEmail');
            localStorage.setItem(`profilePic-${loggedInTeacherEmail}`, imgData);
            profilePic.src = imgData;
            profilePic.classList.remove('hidden');
            profilePicSvg.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
});

// Close teacher message box
messageBoxCloseTeacher.addEventListener('click', () => {
    messageBoxContainerTeacher.classList.add('hidden');
});


// --- Initial Page Load Logic ---
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('loggedInStudentEmail')) {
        togglePortal(true, 'student');
    } else if (sessionStorage.getItem('loggedInTeacherEmail')) {
        togglePortal(true, 'teacher');
    }
    else {
        showAuthForm(studentLoginForm, 'student');
    }
});
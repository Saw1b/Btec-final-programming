import { postStudentData, 
    getAllStudents, 
    getStudentDataByID, 
    updateStudentData, 
    deleteStudentData } from "./models/students.js";

// DOM Elements - Form Page
const submitButton = document.getElementById("form-submit");
const studentForm = document.getElementById("student-form");
const subjectsFormGroup = document.getElementById("subjects-form-group");
const addSubjectButton = document.getElementById("add-subject");
const getButton = document.getElementById("get-button");

// DOM Elements - List Page
const studentsTable = document.getElementById("student-list-body");
const backButton = document.getElementById("back-button");
const refreshButton = document.getElementById("refresh-button");

// Subject management
let subjects = [
    {
        subject: "",
        marks: ""
    }
];

// Edit mode tracking
let isEditMode = false;
let editingStudentId = null;

// Debounce timeouts
let subjectTimeout = null;
let marksTimeout = null;



function initializeFormPage() {
    if (!submitButton) return; // Not on form page
    
    // Event listeners
    submitButton.addEventListener("click", submitData);
    studentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        submitData(e);
    });
    addSubjectButton.addEventListener("click", addSubject);
    getButton.addEventListener("click", () => {
        window.location.href = "edit.html";
    });
    
    // Initialize subjects and check for edit mode
    addSubjectField();
    checkEditMode();
}

function submitData(event) {
    event.preventDefault();

    // Get form values
    const nameValue = document.getElementById("name").value.trim();
    const emailValue = document.getElementById("email_address").value.trim();
    const phoneValue = document.getElementById("phone_number").value.trim();
    const addressValue = document.getElementById("address").value.trim();
    const fatherNameValue = document.getElementById("father_name").value.trim();
    const motherNameValue = document.getElementById("mother_name").value.trim();
    const ageElement = document.getElementById("age");
    const guardianNumberValue = document.getElementById("guardian_number").value.trim();

    // Get subject values
    let subjectValue = subjects.map((item, index) => {
        const subjectInput = document.getElementById(`subject-${index + 1}`);
        const marksInput = document.getElementById(`marks-${index + 1}`);
        
        return {
            subject: subjectInput ? subjectInput.value.trim() : "",
            marks: marksInput ? marksInput.value.trim() : ""
        };
    });

    // Validation
    if (!nameValue || !emailValue || !phoneValue || !addressValue || !fatherNameValue || !motherNameValue || !guardianNumberValue) {
        alert("Please fill all the required fields");
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        alert("Please enter a valid email address");
        return;
    }

    // Phone validation
    if (phoneValue.length < 10) {
        alert("Please enter a valid phone number (minimum 10 digits)");
        return;
    }

    const ageValue = parseInt(ageElement.value);
    if (!ageValue || ageValue < 1 || ageValue > 60) {
        alert("Please enter a valid age between 1 and 60");
        return;
    }

    if (subjectValue.some(item => !item.subject || !item.marks)) {
        alert("Please fill all the subject and marks fields");
        return;
    }

    // Marks validation
    if (subjectValue.some(item => parseInt(item.marks) < 0 || parseInt(item.marks) > 100)) {
        alert("Please enter valid marks between 0 and 100");
        return;
    }

    const studentData = {
        name: nameValue,
        email_address: emailValue,
        phone_number: phoneValue,
        address: addressValue,
        father_name: fatherNameValue,
        mother_name: motherNameValue,
        guardian_number: guardianNumberValue,
        age: ageValue,
        subjects: subjectValue
    };

    let result;

    if (isEditMode && editingStudentId) {
        // Update existing student
        result = updateStudentData(editingStudentId, studentData);
    } else {
        // Create new student
        result = postStudentData(studentData);
    }

    if (result?.status === 200 || result?.status === 201) {
        clearForm();
        alert(result?.message);
        resetEditMode();
        
        // Navigate to student list after successful submission
        setTimeout(() => {
            window.location.href = "edit.html";
        }, 1500);
    } else {
        alert(result?.message || "Something went wrong");
    }
}

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("email_address").value = "";
    document.getElementById("phone_number").value = "";
    document.getElementById("address").value = "";
    document.getElementById("father_name").value = "";
    document.getElementById("mother_name").value = "";
    document.getElementById("guardian_number").value = "";
    document.getElementById("age").value = "";
    
    // Reset subjects
    subjects = [{
        subject: "",
        marks: ""
    }];
    addSubjectField();
}

function resetEditMode() {
    isEditMode = false;
    editingStudentId = null;
    submitButton.textContent = "Submit";
    submitButton.classList.remove("edit-mode");
    removeCancelButton();
}

function updateSubject(e, index) {
    if (subjectTimeout) {
        clearTimeout(subjectTimeout);
    }
    subjectTimeout = setTimeout(() => {
        const subjectValue = e.target.value;
        const marksInput = document.getElementById(`marks-${index + 1}`);
        const marksValue = marksInput ? marksInput.value : "";
        
        if (subjects[index]) {
            subjects[index] = {
                subject: subjectValue,
                marks: marksValue
            };
        }
    }, 300);
}

function updateMarks(e, index) {
    if (marksTimeout) {
        clearTimeout(marksTimeout);
    }
    marksTimeout = setTimeout(() => {
        const marksValue = e.target.value;
        const subjectInput = document.getElementById(`subject-${index + 1}`);
        const subjectValue = subjectInput ? subjectInput.value : "";
        
        if (subjects[index]) {
            subjects[index] = {
                subject: subjectValue,
                marks: marksValue
            };
        }
    }, 300);
}

function addSubjectField() {
    if (!subjectsFormGroup) return;
    
    subjectsFormGroup.innerHTML = "";
    
    subjects.forEach((subject, idx) => {
        // Create container div
        const formRowDiv = document.createElement("div");
        formRowDiv.className = "subject-row";
        
        // Create subject input
        const subjectDiv = document.createElement("div");
        subjectDiv.className = "form-row";
        
        const subjectLabel = document.createElement("label");
        subjectLabel.textContent = "Subject";
        subjectLabel.setAttribute("for", `subject-${idx + 1}`);
        
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.name = "subject";
        inputField.id = `subject-${idx + 1}`;
        inputField.value = subject.subject;
        inputField.placeholder = "Enter subject name";
        inputField.addEventListener("input", (e) => updateSubject(e, idx));
        
        subjectDiv.appendChild(subjectLabel);
        subjectDiv.appendChild(inputField);
        
        // Create marks input
        const marksDiv = document.createElement("div");
        marksDiv.className = "form-row";
        
        const marksLabel = document.createElement("label");
        marksLabel.textContent = "Marks";
        marksLabel.setAttribute("for", `marks-${idx + 1}`);
        
        const marksField = document.createElement("input");
        marksField.type = "number";
        marksField.name = "marks";
        marksField.id = `marks-${idx + 1}`;
        marksField.value = subject.marks;
        marksField.placeholder = "Enter marks (0-100)";
        marksField.min = "0";
        marksField.max = "100";
        marksField.addEventListener("input", (e) => updateMarks(e, idx));
        
        marksDiv.appendChild(marksLabel);
        marksDiv.appendChild(marksField);
        
        // Create remove button
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "remove-subject";
        deleteButton.innerText = "Remove";
        deleteButton.addEventListener("click", () => {
            if (subjects.length > 1) {
                subjects.splice(idx, 1);
                addSubjectField();
            } else {
                alert("At least one subject is required");
            }
        });
        
        // Append all elements
        formRowDiv.appendChild(subjectDiv);
        formRowDiv.appendChild(marksDiv);
        formRowDiv.appendChild(deleteButton);
        subjectsFormGroup.appendChild(formRowDiv);
    });
}

function addSubject() {
    subjects.push({
        subject: "",
        marks: ""
    });
    addSubjectField();
}

function addCancelButton() {
    if (isEditMode && !document.querySelector('.btn-cancel')) {
        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.className = "btn-cancel";
        cancelButton.textContent = "Cancel Edit";
        cancelButton.addEventListener("click", () => {
            clearForm();
            resetEditMode();
        });
        
        const actionContainer = document.querySelector('.action-container .form-row');
        if (actionContainer) {
            actionContainer.appendChild(cancelButton);
        }
    }
}

function removeCancelButton() {
    const cancelButton = document.querySelector('.btn-cancel');
    if (cancelButton) {
        cancelButton.remove();
    }
}

function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        const studentResult = getStudentDataByID(editId);
        
        if (studentResult?.status === 200 && studentResult?.payload?.data) {
            const student = studentResult.payload.data;
            
            // Populate form with student data
            document.getElementById("name").value = student.name;
            document.getElementById("email_address").value = student.email_address;
            document.getElementById("phone_number").value = student.phone_number;
            document.getElementById("address").value = student.address;
            document.getElementById("father_name").value = student.father_name;
            document.getElementById("mother_name").value = student.mother_name;
            document.getElementById("guardian_number").value = student.guardian_number;
            document.getElementById("age").value = student.age;
            
            // Populate subjects
            if (student.subjects && student.subjects.length > 0) {
                subjects = [...student.subjects];
                addSubjectField();
            }
            
            // Set edit mode
            isEditMode = true;
            editingStudentId = parseInt(editId);
            submitButton.textContent = "Update Student";
            submitButton.classList.add("edit-mode");
            addCancelButton();
            
            // Focus on name field
            document.getElementById("name").focus();
        }
    }
}



function initializeListPage() {
    if (!studentsTable) return; // Not on list page
    
    // Event listeners
    backButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    refreshButton.addEventListener("click", () => {
        displayStudents();
    });
    
    // Initialize display
    displayStudents();
    
    // Auto-refresh every 30 seconds
    setInterval(() => {
        displayStudents();
    }, 30000);
}

function displayStudents() {
    if (!studentsTable) return;
    
    const studentsResult = getAllStudents();
    studentsTable.innerHTML = "";
    
    if (studentsResult?.status === 200 && studentsResult?.payload?.data?.length > 0) {
        studentsResult.payload.data.forEach((student) => {
            const row = document.createElement("tr");
            
            // Format subjects display
            const subjectsDisplay = student.subjects && student.subjects.length > 0 
                ? student.subjects.map(sub => `<span class="subject-item">${sub.subject}: ${sub.marks}</span>`).join('')
                : '<span class="subject-item">No subjects</span>';
            
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email_address}</td>
                <td>${student.phone_number}</td>
                <td>${student.father_name}</td>
                <td>${student.mother_name}</td>
                <td>${student.age}</td>
                <td>${student.guardian_number}</td>
                <td>${student.address}</td>
                <td class="subjects-cell">
                    <div class="subjects-list">${subjectsDisplay}</div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" data-id="${student.id}">Edit</button>
                        <button class="btn-delete" data-id="${student.id}">Delete</button>
                    </div>
                </td>
            `;
            studentsTable.appendChild(row);
        });
        
        // Add event listeners for delete and edit buttons
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
        
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', handleEdit);
        });
    } else {
        // Show empty state
        const row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="11" class="empty-state">
                <h3>No Students Found</h3>
                <p>Add your first student using the form.</p>
            </td>
        `;
        studentsTable.appendChild(row);
    }
}

function handleDelete(e) {
    const studentId = e.target.getAttribute('data-id');
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
        const result = deleteStudentData(studentId);
        if (result?.status === 200) {
            alert(result.message);
            displayStudents(); 
        } else {
            alert(result?.message || "Failed to delete student");
        }
    }
}

function handleEdit(e) {
    const studentId = e.target.getAttribute('data-id');
    // Navigate to form page with edit parameter
    window.location.href = `index.html?edit=${studentId}`;
}


// Initialize appropriate functionality based on current page
document.addEventListener("DOMContentLoaded", () => {
    initializeFormPage();
    initializeListPage();
});
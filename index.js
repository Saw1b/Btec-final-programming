import { TABLE_NAME } from "./constants.js";
import { getStudentDataByID, postStudentData } from "./models/students.js";
import { getDataFromDB, setDataToDB } from "./utils/storageUtil.js";

const submitButton = document.getElementById("form-submit");
submitButton.addEventListener("click", submitData);

const fetchButton = document.getElementById("get-data");
fetchButton.addEventListener("click", getData);

//Admin Panel
const updateButton = document.getElementById("update-data");
updateButton.addEventListener("click", updateData);

const searchButton = document.getElementById("search-data");
searchButton.addEventListener("click", searchData);

const addAcadenmicButton = document.getElementById("add-academic");
addAcadenmicButton.addEventListener("click", addAcademicData);

let admin = [];

function submitData(event) {
    event.preventDefault();

    // let nameValue, emailValue, phoneNumberValue, addressValue, fatherNameValue, motherNameValue, ageValue, guardianNumberValue;

    // const fields = [
    //     { fieldId: "name", fieldValue: 'nameValue' },
    //     { fieldId: "email_address", fieldValue: 'emailValue' },
    //     { fieldId: "phone_number", fieldValue: 'phoneNumberValue' },
    //     { fieldId: "address", fieldValue: 'addressValue' },
    //     { fieldId: "father_name", fieldValue: 'fatherNameValue' },
    //     { fieldId: "mother_name", fieldValue: 'motherNameValue' },
    //     { fieldId: "age", fieldValue: 'ageValue' },
    //     { fieldId: "guardian_number", fieldValue: 'guardianNumberValue' }
    // ]

    // fields.forEach(field => {
    //     const fieldElement = document.getElementById(field.fieldId);
    //     if (fieldElement) {
    //         console.log('field.fieldValue', field.fieldValue)
    //         console.log('fieldElement.value', fieldElement.value)
    //         window[field.fieldValue] = fieldElement.value;
    //         console.log(nameValue, emailValue, phoneNumberValue, addressValue, fatherNameValue, motherNameValue, ageValue, guardianNumberValue);
    //     }
    // })



    // // get dom element

    const nameField = document.getElementById("name");
    const nameValue = nameField.value;

    const emailField = document.getElementById("email_address");
    const emailValue = emailField.value;

    const phoneNumberField = document.getElementById("phone_number");
    const phoneNumberValue = phoneNumberField.value;

    const addressField = document.getElementById("address");
    const addressValue = addressField.value;

    const fatherNameField = document.getElementById("father_name");
    const fatherNameValue = fatherNameField.value;

    const motherNameField = document.getElementById("mother_name");
    const motherNameValue = motherNameField.value;

    const ageField = document.getElementById("age");
    const ageValue = ageField.value;

    const guardianNumberField = document.getElementById("guardian_number");
    const guardianNumberValue = guardianNumberField.value;


    if (!nameValue || !emailValue || !addressValue || !fatherNameValue || !motherNameValue || !ageValue || !guardianNumberValue) {
        alert('Please fill all the fields');
        return;
    }

    const result = postStudentData({
        name: nameValue,
        email_address: emailValue,
        phone_number: phoneNumberValue,
        address: addressValue,
        father_name: fatherNameValue,
        mother_name: motherNameValue,
        age: ageValue,
        guardian_number: guardianNumberValue
    });

    if (result.status === 201) {
        nameField.value = '';
        emailField.value = '';
        phoneNumberField.value = '';
        addressField.value = '';
        fatherNameField.value = '';
        motherNameField.value = '';
        ageField.value = '';
        guardianNumberField.value = '';
        alert('Your data has been saved successfully.')
    } else {
        alert(result.message)
    }

}

function updatesStudentData(){

    event.preventDefault();


    const studentId = document.getElementById('student-id').value;
    const studentName = document.getElementById('student-name').value;
    const studentEmail = document.getElementById('student-email').value;
    const studentPhone = document.getElementById('student-phone').value;
    const studentAddress = document.getElementById('student-address').value;
    const studentFatherName = document.getElementById('student-father-name').value;
    const studentMotherName = document.getElementById('student-mother-name').value;
    const studentAge = document.getElementById('student-age').value;
    const studentGuardianNumber = document.getElementById('student-guardian-number').value;

    if (!nameValue || !emailValue || !addressValue || !fatherNameValue || !motherNameValue || !ageValue || !guardianNumberValue) {
        alert('Updating data failed. Please fill all the fields');
        return;
    }

    const result = updateStudentData({
        id: studentId,
        name: studentName,
        email_address: studentEmail,
        phone_number: studentPhone,
        address: studentAddress,
        father_name: studentFatherName,
        mother_name: studentMotherName,
        age: studentAge,
        guardian_number: studentGuardianNumber
    });
    if (result.status === 200) {
        nameField.value = '';
        emailField.value = '';
        phoneNumberField.value = '';
        addressField.value = '';
        fatherNameField.value = '';
        motherNameField.value = '';
        ageField.value = '';
        guardianNumberField.value = '';
        alert('Your data has been saved successfully.')
    } else {
        alert(result.message)
    }

}

function searchStudent() {
    const studentId = document.getElementById('student-id').value;
    if (!studentId) {
        alert('Please provide a valid student id');
        return;
    }
    if (isNaN(studentId)) {
        alert('Please provide a valid student id');
        return;
    }
    if (studentId < 1) {
        alert('Please provide a valid student id');
        return;
    }
    if (studentId === '') {
        alert('Please provide a valid student id');
        return;
    }
    if (studentId === null) {
        alert('Please provide a valid student id');
        return;
    }
    if (studentId === undefined) {
        alert('Please provide a valid student id');
        return;
    }
    if (studentId.length < 1) {
        alert('Please provide a valid student id');
        return;
    }
    if (studentId.length > 10) {
        alert('Please provide a valid student id');
        return;
    }
    if (!studentId) {
        alert('Sucessfully found the student data');
        return;
    }
    const result = getStudentDataByID(studentId);

     if (result.status === 200) {
        const studentData = result.data;
        const studentName = document.getElementById('student-name');
        const studentEmail = document.getElementById('student-email');
        const studentPhone = document.getElementById('student-phone');
        const studentAddress = document.getElementById('student-address');
        const studentFatherName = document.getElementById('student-father-name');
        const studentMotherName = document.getElementById('student-mother-name');
        const studentAge = document.getElementById('student-age');
        const studentGuardianNumber = document.getElementById('student-guardian-number');
    }
    else {
        alert(result.message);
    }

    const studentName = document.getElementById('student-name');
    const resultA = document.getElementById('result-message');


    if (resultA.status === 200) {
        const studentData = result.data;
        const studentName = document.getElementById('student-name');
        const studentEmail = document.getElementById('student-email');
        const studentPhone = document.getElementById('student-phone');
        const studentAddress = document.getElementById('student-address');
        const studentFatherName = document.getElementById('student-father-name');
        const studentMotherName = document.getElementById('student-mother-name');
        const studentAge = document.getElementById('student-age');
        const studentGuardianNumber = document.getElementById('student-guardian-number');
    }
    else {
        alert(resultA.message);
    }
    

}
function addAcademicData() {

    event.preventDefault();

    const studentId = document.getElementById('student-id').value;
    const academicYear = document.getElementById('academic-year').value;
    const semester = document.getElementById('semester').value;
    const gpa = document.getElementById('gpa').value;

    if (!studentId || !academicYear || !semester || !gpa) {
        alert('Please fill all the fields');
        return;
    }

    const result = addAcademicData({
        student_id: studentId,
        academic_year: academicYear,
        semester: semester,
        gpa: gpa
    });

    if (result.status === 201) {
        alert('Academic data has been added successfully.');
    } else {
        alert(result.message);
    }
}



function getData() {
    const result = getStudentData();
    if (result.status === 200) {
        const studentData = result.data;
        const studentName = document.getElementById('student-name');
        const studentEmail = document.getElementById('student-email');
        const studentPhone = document.getElementById('student-phone');
        const studentAddress = document.getElementById('student-address');
        const studentFatherName = document.getElementById('student-father-name');
        const studentMotherName = document.getElementById('student-mother-name');
        const studentAge = document.getElementById('student-age');
        const studentGuardianNumber = document.getElementById('student-guardian-number');
    }
    else {
        alert(result.message);
    }
}




function searchStudent() {
    const studentId = document.getElementById('search-id').value;
    
    if (!studentId) {
        showMessage('Please enter a student ID', 'error');
        return;
    }

    const result = getStudentDataByID(parseInt(studentId));
    const detailsDiv = document.getElementById('student-details');
    
    if (result.status === 200) {
        const student = result.data;
        
        // Populate form fields
        document.getElementById('edit-name').value = student.name;
        document.getElementById('edit-email').value = student.email_address;
        document.getElementById('edit-phone').value = student.phone_number || '';
        document.getElementById('edit-address').value = student.address;
        document.getElementById('edit-father').value = student.father_name;
        document.getElementById('edit-mother').value = student.mother_name;
        document.getElementById('edit-age').value = student.age;
        document.getElementById('edit-guardian').value = student.guardian_number;
        
        detailsDiv.style.display = 'block';
        showMessage(result.message, 'success');
    } else {
        detailsDiv.style.display = 'none';
        showMessage(result.message, 'error');
    }
}


function addAcademicRecord() {
    const studentId = parseInt(document.getElementById('academic-student-id').value);
    const academicData = {
        subject: document.getElementById('subject').value.trim(),
        marks: parseInt(document.getElementById('marks').value),
        status: document.getElementById('status').value,
        type: document.getElementById('type').value,
        class: document.getElementById('class').value.trim()
    };

    const result = addStudentAcademicRecord(studentId, academicData);
    
    if (result.status === 201) {
        showMessage(result.message, 'success');
        // Clear academic form
        document.getElementById('academic-student-id').value = '';
        document.getElementById('subject').value = '';
        document.getElementById('marks').value = '';
        document.getElementById('status').value = '';
        document.getElementById('type').value = '';
        document.getElementById('class').value = '';
    } else {
        showMessage(result.message, 'error');
    }
}

function clearSearch() {
    document.getElementById('search-id').value = '';
    document.getElementById('student-details').style.display = 'none';
}

function refreshData() {
    loadStudentsTable();
    updateStats();
    showMessage('Data refreshed successfully', 'success');
}




    

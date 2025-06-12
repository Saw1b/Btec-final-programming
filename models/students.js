import { MESSAGES, TABLE_NAME } from "../constants.js";
import {
    generateResponse,
    getDataFromDB,
    setDataToDB,
} from "../utils/storageUtil.js";

const table_name = TABLE_NAME.STUDENTS;

function generateRandomId8Bit() {
    return Math.floor(Math.random() * 256);
}

export function postStudentData(data) {
    if (data) {
        // generate id for student data
        const studentId = generateRandomId8Bit();

        // add id to the data object
        const newStudent = Object.assign(data, {
            id: studentId,
        });

        // get all students list
        const { payload: allStudents } = getDataFromDB(table_name);
        
        // Check if email is unique
        const isEmailUnique = !allStudents?.data?.find(student => student?.email_address === newStudent.email_address);

        let result;
        if (allStudents?.data?.length > 0) {
            if (isEmailUnique) {
                const newStudentsArray = [...allStudents?.data, newStudent];
                result = setDataToDB(table_name, newStudentsArray);

                if (result?.status === 201) {
                    return generateResponse(MESSAGES.student.SAVED, result?.status, newStudent);
                }
            } else {
                return generateResponse(MESSAGES.student.ALREADY_EXISTS, 400);
            }
        } else {
            result = setDataToDB(table_name, [newStudent]);

            if (result?.status === 201) {
                return generateResponse(MESSAGES.student.SAVED, result?.status, newStudent);
            }
        }
    }

    return generateResponse(MESSAGES.INVALID, 400);
}

export function getStudentDataByID(studentId) {
    // data check
    if (studentId) {
        const result = getDataFromDB(table_name);

        if (result?.status === 200 && result?.payload?.data?.length > 0) {
            const studentData = result?.payload?.data?.find((st) => st.id === parseInt(studentId));

            if (studentData?.id) {
                return generateResponse(MESSAGES.student.FOUND, 200, studentData);
            }

            return generateResponse(MESSAGES.student.NOT_FOUND, 400);
        }

        return generateResponse(MESSAGES.student.NOT_FOUND, 400);
    }

    return generateResponse(MESSAGES.INVALID, 400);
}

export function getAllStudents() {
    const result = getDataFromDB(table_name);

    if (result?.status === 200) {
        // Return data even if empty array
        return generateResponse(MESSAGES.student.FOUND, 200, result?.payload?.data || []);
    }

    return generateResponse(MESSAGES.student.NOT_FOUND, 400, []);
}

export function updateStudentData(studentId, updatedData) {
    if (studentId && updatedData) {
        const result = getDataFromDB(table_name);

        if (result?.status === 200 && result?.payload?.data?.length > 0) {
            const studentIndex = result?.payload?.data?.findIndex((st) => st.id === parseInt(studentId));

            if (studentIndex !== -1) {
                // Check if email is unique (excluding current student)
                const isEmailUnique = !result?.payload?.data?.find((student, index) => 
                    student?.email_address === updatedData.email_address && index !== studentIndex
                );

                if (isEmailUnique) {
                    // Update student data
                    result.payload.data[studentIndex] = {
                        ...result.payload.data[studentIndex],
                        ...updatedData,
                        id: parseInt(studentId) // Ensure ID remains the same
                    };

                    const updateResult = setDataToDB(table_name, result.payload.data);

                    if (updateResult?.status === 201) {
                        return generateResponse(MESSAGES.student.UPDATED, 200, result.payload.data[studentIndex]);
                    }
                } else {
                    return generateResponse(MESSAGES.student.ALREADY_EXISTS, 400);
                }
            } else {
                return generateResponse(MESSAGES.student.NOT_FOUND, 400);
            }
        }

        return generateResponse(MESSAGES.student.NOT_FOUND, 400);
    }

    return generateResponse(MESSAGES.INVALID, 400);
}

export function deleteStudentData(studentId) {
    if (studentId) {
        const result = getDataFromDB(table_name);

        if (result?.status === 200 && result?.payload?.data?.length > 0) {
            const filteredStudents = result?.payload?.data?.filter((st) => st.id !== parseInt(studentId));

            const deleteResult = setDataToDB(table_name, filteredStudents);

            if (deleteResult?.status === 201) {
                return generateResponse(MESSAGES.student.DELETED, 200);
            }
        }

        return generateResponse(MESSAGES.student.NOT_FOUND, 400);
    }

    return generateResponse(MESSAGES.INVALID, 400);
}
import { TABLE_NAME,MESSAGES } from "../constants.js";
import { getDataFromDB, setDataToDB } from "./storageUtil.js";


export function generateResponse(message, status, data = []) {
    return {
        message: message,
        payload: {
            data: data
        },
        status: status
    }
}

        function getDataFromDB(tableName) {
                try {
                    const data = JSON.parse(localStorage.getItem(tableName)) || [];
                    return {
                        status: 200,
                        payload: { data: data }
                    };
                } catch (error) {
                    console.error('Error reading from storage:', error);
                    return {
                        status: 500,
                        payload: { data: [] }
                    };
                }
            }

        function setDataToDB(tableName, data) {
            try {
                localStorage.setItem(tableName, JSON.stringify(data));
                return {
                    status: 201,
                    payload: { data: data }
                };
            } catch (error) {
                console.error('Error writing to storage:', error);
                return {
                    status: 500,
                    error: error.message
                };
            }
        }

        function generateResponse(message, status, data = []) {
            return {
                message: message,
                payload: { data: data },
                status: status
            };
        }

        // Student Management Functions
        function generateUniqueId() {
            const existingStudents = getDataFromDB(TABLE_NAME.STUDENTS);
            if (existingStudents.payload.data.length === 0) {
                return 1;
            }
            const maxId = Math.max(...existingStudents.payload.data.map(s => s.id || 0));
            return maxId + 1;
        }

        function postStudentData(studentData) {
            try {
                const requiredFields = ['name', 'email_address', 'address', 'father_name', 'mother_name', 'age', 'guardian_number'];
                
                for (const field of requiredFields) {
                    if (!studentData[field] || studentData[field].toString().trim() === '') {
                        return {
                            status: 400,
                            message: `${field.replace('_', ' ')} is required`
                        };
                    }
                }

                const studentsResult = getDataFromDB(TABLE_NAME.STUDENTS);
                const students = studentsResult.payload.data || [];
                
                const existingStudent = students.find(s => s.email_address === studentData.email_address);
                if (existingStudent) {
                    return {
                        status: 409,
                        message: MESSAGES.student.ALREADY_EXISTS
                    };
                }

                const newId = generateUniqueId();
                const newStudent = {
                    id: newId,
                    ...studentData,
                    academic_records: [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                students.push(newStudent);
                const saveResult = setDataToDB(TABLE_NAME.STUDENTS, students);

                if (saveResult.status === 201) {
                    return {
                        status: 201,
                        data: newStudent,
                        message: MESSAGES.student.SAVED
                    };
                }

                return {
                    status: 500,
                    message: 'Error saving student data'
                };
            } catch (error) {
                return {
                    status: 500,
                    message: 'Error creating student: ' + error.message
                };
            }
        }

        function getStudentDataByID(studentId) {
            try {
                if (!studentId) {
                    return {
                        status: 400,
                        message: MESSAGES.student.INVALID_ID
                    };
                }

                const studentsResult = getDataFromDB(TABLE_NAME.STUDENTS);
                const students = studentsResult.payload.data || [];
                const student = students.find(s => s.id === parseInt(studentId));
                
                if (student) {
                    return {
                        status: 200,
                        data: student,
                        message: MESSAGES.student.FOUND
                    };
                } else {
                    return {
                        status: 404,
                        message: MESSAGES.student.NOT_FOUND
                    };
                }
            } catch (error) {
                return {
                    status: 500,
                    message: 'Error retrieving student: ' + error.message
                };
            }
        }

        function updateStudentData(studentId, updateData) {
            try {
                if (!studentId) {
                    return {
                        status: 400,
                        message: MESSAGES.student.INVALID_ID
                    };
                }

                const studentsResult = getDataFromDB(TABLE_NAME.STUDENTS);
                const students = studentsResult.payload.data || [];
                const studentIndex = students.findIndex(s => s.id === parseInt(studentId));
                
                if (studentIndex === -1) {
                    return {
                        status: 404,
                        message: MESSAGES.student.NOT_FOUND
                    };
                }

                if (updateData.email_address && updateData.email_address !== students[studentIndex].email_address) {
                    const existingStudent = students.find(s => s.email_address === updateData.email_address && s.id !== parseInt(studentId));
                    if (existingStudent) {
                        return {
                            status: 409,
                            message: MESSAGES.student.ALREADY_EXISTS
                        };
                    }
                }

                students[studentIndex] = {
                    ...students[studentIndex],
                    ...updateData,
                    updated_at: new Date().toISOString()
                };

                setDataToDB(TABLE_NAME.STUDENTS, students);

                return {
                    status: 200,
                    data: students[studentIndex],
                    message: 'Student updated successfully'
                };
            } catch (error) {
                return {
                    status: 500,
                    message: 'Error updating student: ' + error.message
                };
            }
        }

        function deleteStudentData(studentId) {
            try {
                if (!studentId) {
                    return {
                        status: 400,
                        message: MESSAGES.student.INVALID_ID
                    };
                }

                const studentsResult = getDataFromDB(TABLE_NAME.STUDENTS);
                const students = studentsResult.payload.data || [];
                const studentIndex = students.findIndex(s => s.id === parseInt(studentId));
                
                if (studentIndex === -1) {
                    return {
                        status: 404,
                        message: MESSAGES.student.NOT_FOUND
                    };
                }

                students.splice(studentIndex, 1);
                setDataToDB(TABLE_NAME.STUDENTS, students);

                return {
                    status: 200,
                    message: 'Student deleted successfully'
                };
            } catch (error) {
                return {
                    status: 500,
                    message: 'Error deleting student: ' + error.message
                };
            }
        }

        function getAllStudents() {
            try {
                const studentsResult = getDataFromDB(TABLE_NAME.STUDENTS);
                return {
                    status: 200,
                    data: studentsResult.payload.data || [],
                    message: 'Students retrieved successfully'
                };
            } catch (error) {
                return {
                    status: 500,
                    message: 'Error retrieving students: ' + error.message
                };
            }
        }

        function addStudentAcademicRecord(studentId, academicData) {
            try {
                if (!studentId) {
                    return {
                        status: 400,
                        message: MESSAGES.student.INVALID_ID
                    };
                }

                const requiredFields = ['subject', 'marks', 'status', 'type', 'class'];
                for (const field of requiredFields) {
                    if (!academicData[field] || academicData[field].toString().trim() === '') {
                        return {
                            status: 400,
                            message: `${field.replace('_', ' ')} is required`
                        };
                    }
                }

                const studentsResult = getDataFromDB(TABLE_NAME.STUDENTS);
                const students = studentsResult.payload.data || [];
                const studentIndex = students.findIndex(s => s.id === parseInt(studentId));
                
                if (studentIndex === -1) {
                    return {
                        status: 404,
                        message: MESSAGES.student.NOT_FOUND
                    };
                }

                if (!students[studentIndex].academic_records) {
                    students[studentIndex].academic_records = [];
                }

                const newRecord = {
                    id: Date.now(),
                    ...academicData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                students[studentIndex].academic_records.push(newRecord);
                setDataToDB(TABLE_NAME.STUDENTS, students);
                return {
                    status: 201,
                    data: newRecord,
                    message: MESSAGES.academic.SAVED
                };
            }
            catch (error) {
                return {
                    status: 500,
                    message: 'Error adding academic record: ' + error.message
                };
            }
        }  
        
        function getStudentAcademicRecords(studentId) {
            try {
                if (!studentId) {
                    return {
                        status: 400,
                        message: MESSAGES.student.INVALID_ID
                    };
                }
                const studentsResult = getDataFromDB(TABLE_NAME.STUDENTS);
                const students = studentsResult.payload.data || [];
                const studentIndex = students.findIndex(s => s.id === parseInt(studentId));
                    if (studentIndex === -1) {
                    return {
                        status: 404,
                        message: MESSAGES.student.NOT_FOUND
                    };
                }
                const student = students[studentIndex];
                return {
                    status: 200,
                    data: student.academic_records || [],
                    message: MESSAGES.academic.FOUND
                };
            }
            catch (error) {
                return {
                    status: 500,
                    message: 'Error retrieving academic records: ' + error.message
                };
            }
        }
        


    
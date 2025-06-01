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

        const { payload: allstudents } = getDataFromDB(table_name)
        allstudents


        const isEmailUnique = !allstudents?.data?.find(student => student?.email_address === newStudent.email_address)

        let result;
        if (allstudents?.data?.length > 0) {
            if (isEmailUnique) {
                const newStudentsArray = [...allstudents?.data, newStudent]
                result = setDataToDB(table_name, newStudentsArray);

                if (result?.status === 201) {
                    return generateResponse(MESSAGES.student.SAVED, result?.status, {
                        id: result?.payload?.data?.id || null,
                    });
                }
            }
            return generateResponse(MESSAGES.student.ALREADY_EXISTS, 400);
        } else {
            result = setDataToDB(table_name, [newStudent]);

            if (result?.status === 201) {
                return generateResponse(MESSAGES.student.SAVED, result?.status, {
                    id: result?.payload?.data?.id || null,
                });
            }
        }



    }

    return generateResponse(MESSAGES.INVALID, 400);
}

export function getStudentDataByID(studentId) {
    // data check
    if (studentId) {
        const result = getDataFromDB(table_name);

        if (result?.status === 200 && result?.payload?.data.length > 0) {
            const studentData = result?.payload?.data?.find((st) => st.id === studentId);

            if (studentData?.id) {
                return generateResponse(MESSAGES.student.FOUND, 200, studentData);
            }

            return generateResponse(MESSAGES.student.NOT_FOUND, 400);
        }

        return generateResponse(MESSAGES.student.NOT_FOUND, 400);
    }

    return generateResponse(MESSAGES.INVALID, 400);
}



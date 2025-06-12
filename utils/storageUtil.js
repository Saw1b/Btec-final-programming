import { MESSAGES } from "../constants.js";

export function generateResponse(message, status, data = []) {
    return {
        message: message,
        payload: {
            data: data
        },
        status: status
    };
}

export function setDataToDB(tableName, data) {
    // data check
    if (data) {
        // convert data to json string
        const convertedData = JSON.stringify(data);

        try {
            localStorage.setItem(tableName, convertedData);
            
            // return response
            return generateResponse(MESSAGES.success, 201, data);
        } catch (e) {
            return generateResponse(MESSAGES.INVALID, 400);
        }
    }

    return generateResponse(MESSAGES.INVALID, 400);
}

export function getDataFromDB(tablename) {
    // data check
    if (tablename) {
        const data = localStorage.getItem(tablename);
        
        // Handle case where no data exists yet
        if (data === null || data === undefined) {
            return generateResponse(MESSAGES.success, 200, []);
        }

        try {
            const result = JSON.parse(data);
            return generateResponse(MESSAGES.success, 200, result || []);
        } catch (e) {
            // If JSON parsing fails, return empty array
            return generateResponse(MESSAGES.success, 200, []);
        }
    }

    return generateResponse(MESSAGES.NOT_FOUND, 400, []);
}
// src/api/apiHelpers.js

/**
 * Validates API response structure
 * @param {Object} response - Axios response object
 * @param {string} endpoint - API endpoint for error messages
 * @returns {Object} response.data
 * @throws {Error} if response is invalid
 */
export const validateResponse = (response, endpoint) => {
    if (!response) {
        throw new Error(`No response received from ${endpoint}`);
    }

    if (!response.data) {
        throw new Error(`Invalid response structure from ${endpoint}: missing data`);
    }

    return response.data;
};

/**
 * Validates required parameters
 * @param {Object} params - Object with parameter names and values
 * @throws {Error} if any parameter is missing or invalid
 */
export const validateParams = (params) => {
    const missing = [];

    for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined || value === '') {
            missing.push(key);
        }
    }

    if (missing.length > 0) {
        throw new Error(`Missing required parameters: ${missing.join(', ')}`);
    }
};

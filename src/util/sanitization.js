// src/util/sanitization.js

/**
 * Sanitization utilities to prevent XSS and validate user input
 */

/**
 * Sanitize text by removing potentially dangerous characters
 * @param {string} text - Text to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text, maxLength = 500) => {
    if (!text || typeof text !== 'string') {
        return '';
    }

    // Remove HTML tags
    let sanitized = text.replace(/<[^>]*>/g, '');

    // Remove script tags and their content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove potentially dangerous characters
    sanitized = sanitized.replace(/[<>]/g, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    // Enforce max length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
};

/**
 * Validate text length
 * @param {string} text - Text to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {object} { valid: boolean, error: string }
 */
export const validateLength = (text, min = 1, max = 500) => {
    if (!text || typeof text !== 'string') {
        return { valid: false, error: 'النص مطلوب' };
    }

    const length = text.trim().length;

    if (length < min) {
        return { valid: false, error: `النص يجب أن يكون ${min} حرف على الأقل` };
    }

    if (length > max) {
        return { valid: false, error: `النص يجب ألا يتجاوز ${max} حرف` };
    }

    return { valid: true, error: null };
};

/**
 * Sanitize and validate classroom/course names
 * @param {string} name - Name to sanitize
 * @returns {string} Sanitized name
 */
export const sanitizeName = (name) => {
    return sanitizeText(name, 100);
};

/**
 * Sanitize and validate descriptions
 * @param {string} description - Description to sanitize
 * @returns {string} Sanitized description
 */
export const sanitizeDescription = (description) => {
    return sanitizeText(description, 500);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate PIN format (4-6 digits)
 * @param {string} pin - PIN to validate
 * @returns {object} { valid: boolean, error: string }
 */
export const validatePIN = (pin) => {
    if (!pin) {
        return { valid: false, error: 'الرمز السري مطلوب' };
    }

    if (!/^\d{4,6}$/.test(pin)) {
        return { valid: false, error: 'الرمز السري يجب أن يكون من 4 إلى 6 أرقام' };
    }

    return { valid: true, error: null };
};

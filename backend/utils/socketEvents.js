/**
 * Socket.IO event constants and utilities
 */

// Client to Server Events
export const CLIENT_EVENTS = {
    AUTHENTICATE: 'authenticate',
    PET_UPDATED: 'pet_updated',
    PET_CREATED: 'pet_created',
    PET_DELETED: 'pet_deleted',
    USER_UPDATED: 'user_updated'
};

// Server to Client Events
export const SERVER_EVENTS = {
    AUTHENTICATED: 'authenticated',
    AUTH_ERROR: 'auth_error',
    PET_UPDATED: 'pet_updated',
    PET_CREATED: 'pet_created',
    PET_DELETED: 'pet_deleted',
    USER_UPDATED: 'user_updated',
    NOTIFICATION: 'notification',
    ERROR: 'error'
};

// Notification Types
export const NOTIFICATION_TYPES = {
    PET_ADOPTED: 'pet_adopted',
    PET_ADDED: 'pet_added',
    PET_REMOVED: 'pet_removed',
    USER_REGISTERED: 'user_registered',
    SYSTEM_MAINTENANCE: 'system_maintenance'
};

/**
 * Create authentication payload for socket connection
 * @param {String} token - JWT token
 * @returns {Object} - Authentication payload
 */
export const createAuthPayload = (token) => ({
    token
});

/**
 * Create pet update payload
 * @param {Object} pet - Pet data
 * @returns {Object} - Pet update payload
 */
export const createPetUpdatePayload = (pet) => ({
    pet,
    timestamp: new Date().toISOString()
});

/**
 * Create notification payload
 * @param {String} type - Notification type
 * @param {Object} data - Notification data
 * @param {String} message - Optional message
 * @returns {Object} - Notification payload
 */
export const createNotificationPayload = (type, data, message = null) => ({
    type,
    data,
    message,
    timestamp: new Date().toISOString()
});


import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate JWT token for user
 * @param {Object} user - User object with _id, email, role
 * @returns {String} - JWT token
 */
export const generateToken = (user) => {
    const payload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object|null} - Decoded token or null if invalid
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

/**
 * Extract token from Authorization header
 * @param {String} authHeader - Authorization header value
 * @returns {String|null} - Token or null if not found
 */
export const extractTokenFromHeader = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
};

/**
 * Generate refresh token (longer expiration)
 * @param {Object} user - User object
 * @returns {String} - Refresh token
 */
export const generateRefreshToken = (user) => {
    const payload = {
        userId: user._id.toString(),
        type: 'refresh'
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};


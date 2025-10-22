import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import { getDb } from '../ExampleConnect.js';
import { User } from '../models/User.js';
import { ObjectId } from 'mongodb';

/**
 * Authentication middleware - verifies JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access token required' 
            });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }

        // Get user from database to ensure they still exist and are active
        const db = getDb();
        const user = await db.collection('users').findOne({ 
            _id: new ObjectId(decoded.userId),
            isActive: true 
        });

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not found or inactive' 
            });
        }

        // Add user info to request object
        req.user = {
            _id: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Authentication error' 
        });
    }
};

/**
 * Authorization middleware - checks if user has required role
 * @param {String|Array} allowedRoles - Role(s) allowed to access the route
 * @returns {Function} - Express middleware function
 */
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        const userRole = req.user.role;
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!roles.includes(userRole)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Insufficient permissions' 
            });
        }

        next();
    };
};

/**
 * Admin-only middleware
 */
export const requireAdmin = requireRole('admin');

/**
 * User or Admin middleware
 */
export const requireUser = requireRole(['user', 'admin']);

/**
 * Optional authentication middleware - doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (token) {
            const decoded = verifyToken(token);
            if (decoded) {
                const db = getDb();
                const user = await db.collection('users').findOne({ 
                    _id: new ObjectId(decoded.userId),
                    isActive: true 
                });

                if (user) {
                    req.user = {
                        _id: user._id,
                        email: user.email,
                        role: user.role,
                        firstName: user.firstName,
                        lastName: user.lastName
                    };
                }
            }
        }

        next();
    } catch (error) {
        console.error('Optional authentication error:', error);
        next(); // Continue even if auth fails
    }
};

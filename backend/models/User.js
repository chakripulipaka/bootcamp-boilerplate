import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

/**
 * User Model Schema
 * 
 * Fields:
 * - _id: ObjectId (MongoDB auto-generated)
 * - email: String (required, unique)
 * - password: String (required, hashed)
 * - firstName: String (required)
 * - lastName: String (required)
 * - role: String (required, 'user' or 'admin')
 * - isActive: Boolean (default: true)
 * - dateCreated: Date (auto-generated)
 * - lastLogin: Date (auto-updated)
 */
export class User {
    constructor(data) {
        this._id = data._id || new ObjectId();
        this.email = data.email;
        this.password = data.password;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.role = data.role || 'user';
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.dateCreated = data.dateCreated || new Date();
        this.lastLogin = data.lastLogin || null;
    }

    /**
     * Validate user data before saving
     * @param {Object} userData - The user data to validate
     * @returns {Object} - Validation result with isValid boolean and errors array
     */
    static validate(userData) {
        const errors = [];

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userData.email || typeof userData.email !== 'string' || !emailRegex.test(userData.email)) {
            errors.push('Valid email is required');
        }

        // Password validation
        if (!userData.password || typeof userData.password !== 'string' || userData.password.length < 6) {
            errors.push('Password is required and must be at least 6 characters long');
        }

        // Name validation
        if (!userData.firstName || typeof userData.firstName !== 'string' || userData.firstName.trim().length === 0) {
            errors.push('First name is required and must be a non-empty string');
        }

        if (!userData.lastName || typeof userData.lastName !== 'string' || userData.lastName.trim().length === 0) {
            errors.push('Last name is required and must be a non-empty string');
        }

        // Role validation
        if (!userData.role || !['user', 'admin'].includes(userData.role)) {
            errors.push('Role must be either "user" or "admin"');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Hash password before saving
     * @param {String} plainPassword - Plain text password
     * @returns {Promise<String>} - Hashed password
     */
    static async hashPassword(plainPassword) {
        const saltRounds = 12;
        return await bcrypt.hash(plainPassword, saltRounds);
    }

    /**
     * Compare plain password with hashed password
     * @param {String} plainPassword - Plain text password
     * @param {String} hashedPassword - Hashed password
     * @returns {Promise<Boolean>} - Whether passwords match
     */
    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Convert User instance to MongoDB document
     * @returns {Object} - MongoDB document
     */
    toDocument() {
        return {
            _id: this._id,
            email: this.email,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role,
            isActive: this.isActive,
            dateCreated: this.dateCreated,
            lastLogin: this.lastLogin
        };
    }

    /**
     * Create User instance from MongoDB document
     * @param {Object} doc - MongoDB document
     * @returns {User} - User instance
     */
    static fromDocument(doc) {
        return new User(doc);
    }

    /**
     * Get user's full name
     * @returns {String} - Full name
     */
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    /**
     * Check if user is admin
     * @returns {Boolean} - Whether user is admin
     */
    isAdmin() {
        return this.role === 'admin';
    }

    /**
     * Get safe user data (without password)
     * @returns {Object} - User data without password
     */
    getSafeData() {
        return {
            _id: this._id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role,
            isActive: this.isActive,
            dateCreated: this.dateCreated,
            lastLogin: this.lastLogin
        };
    }
}

export default User;


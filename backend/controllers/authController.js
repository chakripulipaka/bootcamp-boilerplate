import { getDb } from '../ExampleConnect.js';
import { User } from '../models/User.js';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role = 'user' } = req.body;

        // Validate input data
        const userData = { email, password, firstName, lastName, role };
        const validation = User.validate(userData);
        
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Check if user already exists
        const db = getDb();
        const existingUser = await db.collection('users').findOne({ email });
        
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password and create user
        const hashedPassword = await User.hashPassword(password);
        const newUser = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role
        });

        // Save user to database
        const result = await db.collection('users').insertOne(newUser.toDocument());
        
        if (!result.insertedId) {
            throw new Error('Failed to create user');
        }

        // Generate tokens
        const userForToken = {
            _id: result.insertedId,
            email,
            role,
            firstName,
            lastName
        };
        
        const accessToken = generateToken(userForToken);
        const refreshToken = generateRefreshToken(userForToken);

        // Update last login
        await db.collection('users').updateOne(
            { _id: result.insertedId },
            { $set: { lastLogin: new Date() } }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    _id: result.insertedId,
                    email,
                    firstName,
                    lastName,
                    role
                },
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user in database
        const db = getDb();
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Verify password
        const isPasswordValid = await User.comparePassword(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate tokens
        const userForToken = {
            _id: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        };
        
        const accessToken = generateToken(userForToken);
        const refreshToken = generateRefreshToken(userForToken);

        // Update last login
        await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date() } }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                },
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

/**
 * Refresh access token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const decoded = verifyToken(refreshToken);
        
        if (!decoded || decoded.type !== 'refresh') {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Get user from database
        const db = getDb();
        const user = await db.collection('users').findOne({ 
            _id: decoded.userId,
            isActive: true 
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        // Generate new access token
        const userForToken = {
            _id: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        };
        
        const newAccessToken = generateToken(userForToken);

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken: newAccessToken
            }
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({
            success: false,
            message: 'Token refresh failed',
            error: error.message
        });
    }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProfile = async (req, res) => {
    try {
        const db = getDb();
        const user = await db.collection('users').findOne({ 
            _id: req.user._id 
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isActive: user.isActive,
                    dateCreated: user.dateCreated,
                    lastLogin: user.lastLogin
                }
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error.message
        });
    }
};

/**
 * Logout user (client-side token invalidation)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const logout = async (req, res) => {
    try {
        // In a more sophisticated implementation, you might maintain a blacklist of tokens
        // For now, we'll just return success as token invalidation is handled client-side
        
        res.json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
};


import { getDb } from '../ExampleConnect.js';
import { User } from '../models/User.js';
import { socketService } from '../services/socketService.js';
import { ObjectId } from 'mongodb';

/**
 * Get all users (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllUsers = async (req, res) => {
    try {
        const db = getDb();
        const { page = 1, limit = 10, role } = req.query;

        // Build filter object
        const filter = {};
        if (role) {
            filter.role = role;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get users with pagination
        const users = await db.collection('users')
            .find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        // Remove passwords from response
        const safeUsers = users.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });

        // Get total count for pagination
        const totalUsers = await db.collection('users').countDocuments(filter);
        const totalPages = Math.ceil(totalUsers / parseInt(limit));

        res.json({
            success: true,
            data: {
                users: safeUsers,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalUsers,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve users',
            error: error.message
        });
    }
};

/**
 * Get user by ID (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        const db = getDb();
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove password from response
        const { password, ...safeUser } = user;

        res.json({
            success: true,
            data: { user: safeUser }
        });

    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve user',
            error: error.message
        });
    }
};

/**
 * Update user (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        // Check if user exists
        const db = getDb();
        const existingUser = await db.collection('users').findOne({ _id: new ObjectId(id) });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Don't allow password updates through this endpoint
        if (updateData.password) {
            delete updateData.password;
        }

        // Validate role if provided
        if (updateData.role && !['user', 'admin'].includes(updateData.role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be "user" or "admin"'
            });
        }

        // Update user
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get updated user
        const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(id) });
        
        // Remove password from response
        const { password, ...safeUser } = updatedUser;

        // Broadcast to admin room
        socketService.broadcastUserUpdate(safeUser);

        res.json({
            success: true,
            message: 'User updated successfully',
            data: { user: safeUser }
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
};

/**
 * Delete user (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        // Prevent admin from deleting themselves
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        const db = getDb();
        
        // Check if user exists
        const existingUser = await db.collection('users').findOne({ _id: new ObjectId(id) });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete user
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    }
};

/**
 * Toggle user active status (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        // Prevent admin from deactivating themselves
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot deactivate your own account'
            });
        }

        const db = getDb();
        
        // Check if user exists
        const existingUser = await db.collection('users').findOne({ _id: new ObjectId(id) });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Toggle user status
        const newStatus = !existingUser.isActive;
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: { isActive: newStatus } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get updated user
        const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(id) });
        
        // Remove password from response
        const { password, ...safeUser } = updatedUser;

        // Broadcast to admin room
        socketService.broadcastUserUpdate(safeUser);

        res.json({
            success: true,
            message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
            data: { user: safeUser }
        });

    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status',
            error: error.message
        });
    }
};

import express from 'express';
import { 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser,
    toggleUserStatus
} from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination and filtering
 * @access  Private (Admin only)
 * @query   page, limit, role
 */
router.get('/', authenticateToken, requireAdmin, getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by ID
 * @access  Private (Admin only)
 */
router.get('/:id', authenticateToken, requireAdmin, getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user
 * @access  Private (Admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

/**
 * @route   PATCH /api/users/:id/toggle-status
 * @desc    Toggle user active status
 * @access  Private (Admin only)
 */
router.patch('/:id/toggle-status', authenticateToken, requireAdmin, toggleUserStatus);

export default router;


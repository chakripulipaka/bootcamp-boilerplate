import express from 'express';
import { 
    getAllPets, 
    getPetById, 
    createPet, 
    updatePet, 
    deletePet,
    getFilterOptions
} from '../controllers/petController.js';
import { authenticateToken, optionalAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/pets
 * @desc    Get all pets with optional filtering and pagination
 * @access  Public (optional auth for personalized results)
 * @query   name, breed, ageRange, costRange, isAdopted, page, limit, sortBy, sortOrder
 */
router.get('/', optionalAuth, getAllPets);

/**
 * @route   GET /api/pets/filters
 * @desc    Get available filter options for pets
 * @access  Public
 */
router.get('/filters', getFilterOptions);

/**
 * @route   GET /api/pets/:id
 * @desc    Get a single pet by ID
 * @access  Public
 */
router.get('/:id', getPetById);

/**
 * @route   POST /api/pets
 * @desc    Create a new pet
 * @access  Private (Admin only)
 */
router.post('/', authenticateToken, requireAdmin, createPet);

/**
 * @route   PUT /api/pets/:id
 * @desc    Update a pet
 * @access  Private (Admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, updatePet);

/**
 * @route   DELETE /api/pets/:id
 * @desc    Delete a pet
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, deletePet);

export default router;


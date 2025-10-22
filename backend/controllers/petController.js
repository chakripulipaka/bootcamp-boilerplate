import { getDb } from '../ExampleConnect.js';
import { Pet } from '../models/Pet.js';
import { socketService } from '../services/socketService.js';
import { ObjectId } from 'mongodb';

/**
 * Get all pets with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllPets = async (req, res) => {
    try {
        const db = getDb();
        const { 
            name, 
            breed, 
            ageRange, 
            costRange, 
            isAdopted,
            page = 1, 
            limit = 10,
            sortBy = 'dateAdded',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = {};

        // Name filter (case-insensitive partial match)
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        // Breed filter
        if (breed) {
            filter.breed = breed;
        }

        // Age range filter
        if (ageRange) {
            switch (ageRange) {
                case 'puppy':
                    filter.age = { $lt: 1 };
                    break;
                case 'young':
                    filter.age = { $gte: 1, $lt: 3 };
                    break;
                case 'adult':
                    filter.age = { $gte: 3, $lt: 7 };
                    break;
                case 'senior':
                    filter.age = { $gte: 7 };
                    break;
            }
        }

        // Cost range filter
        if (costRange) {
            switch (costRange) {
                case 'under100':
                    filter.costRange = { $lt: 100 };
                    break;
                case '100-300':
                    filter.costRange = { $gte: 100, $lt: 300 };
                    break;
                case '300-500':
                    filter.costRange = { $gte: 300, $lt: 500 };
                    break;
                case 'over500':
                    filter.costRange = { $gte: 500 };
                    break;
            }
        }

        // Adoption status filter
        if (isAdopted !== undefined) {
            filter.isAdopted = isAdopted === 'true';
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get pets with pagination
        const pets = await db.collection('pets')
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        // Get total count for pagination
        const totalPets = await db.collection('pets').countDocuments(filter);
        const totalPages = Math.ceil(totalPets / parseInt(limit));

        res.json({
            success: true,
            data: {
                pets,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalPets,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Get all pets error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve pets',
            error: error.message
        });
    }
};

/**
 * Get a single pet by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPetById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pet ID'
            });
        }

        const db = getDb();
        const pet = await db.collection('pets').findOne({ _id: new ObjectId(id) });

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found'
            });
        }

        res.json({
            success: true,
            data: { pet }
        });

    } catch (error) {
        console.error('Get pet by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve pet',
            error: error.message
        });
    }
};

/**
 * Create a new pet (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createPet = async (req, res) => {
    try {
        const petData = req.body;

        // Validate pet data
        const validation = Pet.validate(petData);
        
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Create new pet instance
        const newPet = new Pet(petData);
        
        // Save to database
        const db = getDb();
        const result = await db.collection('pets').insertOne(newPet.toDocument());

        if (!result.insertedId) {
            throw new Error('Failed to create pet');
        }

        // Get the created pet
        const createdPet = await db.collection('pets').findOne({ _id: result.insertedId });

        // Broadcast to all connected users
        socketService.broadcastPetCreated(createdPet);

        res.status(201).json({
            success: true,
            message: 'Pet created successfully',
            data: { pet: createdPet }
        });

    } catch (error) {
        console.error('Create pet error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create pet',
            error: error.message
        });
    }
};

/**
 * Update a pet (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pet ID'
            });
        }

        // Check if pet exists
        const db = getDb();
        const existingPet = await db.collection('pets').findOne({ _id: new ObjectId(id) });

        if (!existingPet) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found'
            });
        }

        // Validate update data
        const validation = Pet.validate({ ...existingPet, ...updateData });
        
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Prepare update object
        const updateObject = {
            $set: {
                ...updateData,
                lastUpdated: new Date()
            }
        };

        // Update pet
        const result = await db.collection('pets').updateOne(
            { _id: new ObjectId(id) },
            updateObject
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found'
            });
        }

        // Get updated pet
        const updatedPet = await db.collection('pets').findOne({ _id: new ObjectId(id) });

        // Broadcast to all connected users
        socketService.broadcastPetUpdate(updatedPet);

        res.json({
            success: true,
            message: 'Pet updated successfully',
            data: { pet: updatedPet }
        });

    } catch (error) {
        console.error('Update pet error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update pet',
            error: error.message
        });
    }
};

/**
 * Delete a pet (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deletePet = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pet ID'
            });
        }

        const db = getDb();
        
        // Check if pet exists
        const existingPet = await db.collection('pets').findOne({ _id: new ObjectId(id) });

        if (!existingPet) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found'
            });
        }

        // Delete pet
        const result = await db.collection('pets').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found'
            });
        }

        // Broadcast to all connected users
        socketService.broadcastPetDeleted(id);

        res.json({
            success: true,
            message: 'Pet deleted successfully'
        });

    } catch (error) {
        console.error('Delete pet error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete pet',
            error: error.message
        });
    }
};

/**
 * Get filter options for pets
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getFilterOptions = async (req, res) => {
    try {
        const db = getDb();

        // Get unique breeds
        const breeds = await db.collection('pets').distinct('breed');

        // Get age ranges
        const ageRanges = [
            { value: 'puppy', label: 'Puppy/Kitten (0-1 years)' },
            { value: 'young', label: 'Young (1-3 years)' },
            { value: 'adult', label: 'Adult (3-7 years)' },
            { value: 'senior', label: 'Senior (7+ years)' }
        ];

        // Get cost ranges
        const costRanges = [
            { value: 'under100', label: 'Under $100' },
            { value: '100-300', label: '$100-$300' },
            { value: '300-500', label: '$300-$500' },
            { value: 'over500', label: 'Over $500' }
        ];

        res.json({
            success: true,
            data: {
                breeds,
                ageRanges,
                costRanges
            }
        });

    } catch (error) {
        console.error('Get filter options error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get filter options',
            error: error.message
        });
    }
};

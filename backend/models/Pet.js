import { ObjectId } from 'mongodb';

/**
 * Pet Model Schema
 * 
 * Fields:
 * - _id: ObjectId (MongoDB auto-generated)
 * - name: String (required)
 * - breed: String (required)
 * - age: Number (required, integer)
 * - image: String (required, URL or file path)
 * - costRange: Number (required, integer, cost in dollars)
 * - personalityCharacteristics: String (required)
 * - isAdopted: Boolean (default: false)
 * - dateAdded: Date (auto-generated)
 * - lastUpdated: Date (auto-updated)
 */
export class Pet {
    constructor(data) {
        this._id = data._id || new ObjectId();
        this.name = data.name;
        this.breed = data.breed;
        this.age = data.age;
        this.image = data.image;
        this.costRange = data.costRange;
        this.personalityCharacteristics = data.personalityCharacteristics;
        this.isAdopted = data.isAdopted || false;
        this.dateAdded = data.dateAdded || new Date();
        this.lastUpdated = data.lastUpdated || new Date();
    }

    /**
     * Validate pet data before saving
     * @param {Object} petData - The pet data to validate
     * @returns {Object} - Validation result with isValid boolean and errors array
     */
    static validate(petData) {
        const errors = [];

        // Required field validations
        if (!petData.name || typeof petData.name !== 'string' || petData.name.trim().length === 0) {
            errors.push('Name is required and must be a non-empty string');
        }

        if (!petData.breed || typeof petData.breed !== 'string' || petData.breed.trim().length === 0) {
            errors.push('Breed is required and must be a non-empty string');
        }

        if (!petData.age || typeof petData.age !== 'number' || petData.age < 0 || !Number.isInteger(petData.age)) {
            errors.push('Age is required and must be a non-negative integer');
        }

        if (!petData.image || typeof petData.image !== 'string' || petData.image.trim().length === 0) {
            errors.push('Image is required and must be a non-empty string');
        }

        if (!petData.costRange || typeof petData.costRange !== 'number' || petData.costRange < 0 || !Number.isInteger(petData.costRange)) {
            errors.push('Cost range is required and must be a non-negative integer');
        }

        if (!petData.personalityCharacteristics || typeof petData.personalityCharacteristics !== 'string' || petData.personalityCharacteristics.trim().length === 0) {
            errors.push('Personality characteristics are required and must be a non-empty string');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Convert Pet instance to MongoDB document
     * @returns {Object} - MongoDB document
     */
    toDocument() {
        return {
            _id: this._id,
            name: this.name,
            breed: this.breed,
            age: this.age,
            image: this.image,
            costRange: this.costRange,
            personalityCharacteristics: this.personalityCharacteristics,
            isAdopted: this.isAdopted,
            dateAdded: this.dateAdded,
            lastUpdated: this.lastUpdated
        };
    }

    /**
     * Create Pet instance from MongoDB document
     * @param {Object} doc - MongoDB document
     * @returns {Pet} - Pet instance
     */
    static fromDocument(doc) {
        return new Pet(doc);
    }

    /**
     * Get pet age range category for filtering
     * @returns {String} - Age range category
     */
    getAgeRange() {
        if (this.age < 1) return 'Puppy/Kitten (0-1 years)';
        if (this.age < 3) return 'Young (1-3 years)';
        if (this.age < 7) return 'Adult (3-7 years)';
        return 'Senior (7+ years)';
    }

    /**
     * Get cost range category for filtering
     * @returns {String} - Cost range category
     */
    getCostRange() {
        if (this.costRange < 100) return 'Under $100';
        if (this.costRange < 300) return '$100-$300';
        if (this.costRange < 500) return '$300-$500';
        return 'Over $500';
    }
}

export default Pet;


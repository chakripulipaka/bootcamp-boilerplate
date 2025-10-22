import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Pet } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface PetCardProps {
  pet: Pet;
  onViewDetails?: (pet: Pet) => void;
  onEdit?: (pet: Pet) => void;
  onDelete?: (petId: string) => void;
  showAdminActions?: boolean;
}

const PetCard: React.FC<PetCardProps> = ({
  pet,
  onViewDetails,
  onEdit,
  onDelete,
  showAdminActions = false,
}) => {
  const { user } = useAuth();

  const getAgeRange = (age: number): string => {
    if (age < 1) return 'Puppy/Kitten (0-1 years)';
    if (age < 3) return 'Young (1-3 years)';
    if (age < 7) return 'Adult (3-7 years)';
    return 'Senior (7+ years)';
  };

  const getCostRange = (cost: number): string => {
    if (cost < 100) return 'Under $100';
    if (cost < 300) return '$100-$300';
    if (cost < 500) return '$300-$500';
    return 'Over $500';
  };

  const isAdmin = user?.role === 'admin';

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={pet.image}
        alt={pet.name}
        sx={{
          objectFit: 'cover',
          cursor: 'pointer',
        }}
        onClick={() => onViewDetails?.(pet)}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography gutterBottom variant="h6" component="h2" noWrap>
            {pet.name}
          </Typography>
          {isAdmin && showAdminActions && (
            <Box>
              <Tooltip title="Edit Pet">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(pet);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Pet">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(pet._id);
                  }}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {pet.breed}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`${pet.age} year${pet.age !== 1 ? 's' : ''} old`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={getCostRange(pet.costRange)}
            size="small"
            variant="outlined"
            color="primary"
          />
          {pet.isAdopted && (
            <Chip
              label="Adopted"
              size="small"
              color="success"
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {pet.personalityCharacteristics.length > 100
            ? `${pet.personalityCharacteristics.substring(0, 100)}...`
            : pet.personalityCharacteristics}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          <Tooltip title="Add to Favorites">
            <IconButton size="small">
              <FavoriteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton size="small">
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Button
          size="small"
          variant="contained"
          startIcon={<InfoIcon />}
          onClick={() => onViewDetails?.(pet)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default PetCard;


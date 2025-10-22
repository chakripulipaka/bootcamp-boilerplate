import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Pagination,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Fab,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { Pet, PetFilters, FilterOptions } from '../types';
import { petService } from '../services/api';
import PetCard from '../components/PetCard';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<PetFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch filter options
  const { data: filterOptions } = useQuery<FilterOptions>({
    queryKey: ['filterOptions'],
    queryFn: () => petService.getFilterOptions().then(res => res.data.data),
  });

  // Fetch pets with filters
  const { data: petsData, isLoading, error, refetch } = useQuery({
    queryKey: ['pets', filters, currentPage],
    queryFn: () => petService.getPets({
      ...filters,
      page: currentPage,
      limit: 12,
    }).then(res => res.data.data),
  });

  const handleFilterChange = (key: keyof PetFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleViewDetails = (pet: Pet) => {
    // TODO: Implement pet details modal/page
    console.log('View pet details:', pet);
  };

  const handleEditPet = (pet: Pet) => {
    // TODO: Implement edit pet modal
    console.log('Edit pet:', pet);
  };

  const handleDeletePet = (petId: string) => {
    // TODO: Implement delete confirmation
    console.log('Delete pet:', petId);
  };

  const handleAddPet = () => {
    // TODO: Implement add pet modal
    console.log('Add new pet');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Pet Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        {showFilters && (
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Filters</Typography>
                <Tooltip title="Clear all filters">
                  <IconButton onClick={clearFilters} size="small">
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Name Search */}
                <TextField
                  label="Search by name"
                  value={filters.name || ''}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  size="small"
                  fullWidth
                />

                {/* Breed Filter */}
                <FormControl size="small" fullWidth>
                  <InputLabel>Breed</InputLabel>
                  <Select
                    value={filters.breed || ''}
                    label="Breed"
                    onChange={(e) => handleFilterChange('breed', e.target.value)}
                  >
                    <MenuItem value="">All Breeds</MenuItem>
                    {filterOptions?.breeds.map((breed) => (
                      <MenuItem key={breed} value={breed}>
                        {breed}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Age Range Filter */}
                <FormControl size="small" fullWidth>
                  <InputLabel>Age Range</InputLabel>
                  <Select
                    value={filters.ageRange || ''}
                    label="Age Range"
                    onChange={(e) => handleFilterChange('ageRange', e.target.value)}
                  >
                    <MenuItem value="">All Ages</MenuItem>
                    {filterOptions?.ageRanges.map((range) => (
                      <MenuItem key={range.value} value={range.value}>
                        {range.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Cost Range Filter */}
                <FormControl size="small" fullWidth>
                  <InputLabel>Cost Range</InputLabel>
                  <Select
                    value={filters.costRange || ''}
                    label="Cost Range"
                    onChange={(e) => handleFilterChange('costRange', e.target.value)}
                  >
                    <MenuItem value="">All Costs</MenuItem>
                    {filterOptions?.costRanges.map((range) => (
                      <MenuItem key={range.value} value={range.value}>
                        {range.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Adoption Status Filter */}
                <FormControl size="small" fullWidth>
                  <InputLabel>Adoption Status</InputLabel>
                  <Select
                    value={filters.isAdopted === undefined ? '' : filters.isAdopted.toString()}
                    label="Adoption Status"
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange('isAdopted', value === '' ? undefined : value === 'true');
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="false">Available</MenuItem>
                    <MenuItem value="true">Adopted</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Pets Grid */}
        <Grid item xs={12} md={showFilters ? 9 : 12}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load pets. Please try again.
            </Alert>
          )}

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : petsData?.pets.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No pets found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your filters or check back later for new pets.
              </Typography>
            </Paper>
          ) : (
            <>
              {/* Pets Grid */}
              <Grid container spacing={3}>
                {petsData?.pets.map((pet) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={pet._id}>
                    <PetCard
                      pet={pet}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEditPet}
                      onDelete={handleDeletePet}
                      showAdminActions={isAdmin}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {petsData?.pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={petsData.pagination.totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}

              {/* Results Summary */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {petsData?.pets.length || 0} of {petsData?.pagination.totalPets || 0} pets
                </Typography>
              </Box>
            </>
          )}
        </Grid>
      </Grid>

      {/* Floating Action Button for Admin */}
      {isAdmin && (
        <Fab
          color="primary"
          aria-label="add pet"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleAddPet}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
};

export default UserDashboard;


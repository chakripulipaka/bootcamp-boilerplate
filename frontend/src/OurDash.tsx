import './ExampleDashboard.css'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { Stack } from '@mui/material';

import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import { useState, useEffect } from "react";
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import AdbIcon from '@mui/icons-material/Adb'
import { useMemo } from 'react';
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { getPets } from './ExampleApi'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import LoginIcon from '@mui/icons-material/Login'
import PetsIcon from '@mui/icons-material/Pets'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

function OurDash() {
  const [searchEntry, setSearchEntry] = useState<string>('')
  const [age, setAge] = useState("");
  const [breedChoice, setBreed] = useState("");
  const [priceRange, setPriceRange] = useState<string>('');
  const [pets, setPets] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)
  const [loginOpen, setLoginOpen] = useState<boolean>(false)
  const [registerOpen, setRegisterOpen] = useState<boolean>(false)
  
  // Pet management states
  const [addPetOpen, setAddPetOpen] = useState<boolean>(false)
  const [editPetOpen, setEditPetOpen] = useState<boolean>(false)
  const [selectedPet, setSelectedPet] = useState<any>(null)
  const [petDetailsOpen, setPetDetailsOpen] = useState<boolean>(false)
  
  // Add/Edit pet form states
  const [newPetData, setNewPetData] = useState({
    name: '',
    breed: '',
    age: '',
    image: '',
    costRange: '',
    personalityCharacteristics: ''
  })
  const [submitting, setSubmitting] = useState<boolean>(false)
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState<string>('')
  const [loginPassword, setLoginPassword] = useState<string>('')
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user'
  })

  const refreshPets = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getPets()
      if (data) {
        setPets(data)
      } else {
        setError('Failed to load pets')
      }
    } catch (e: any) {
      setError('Error: ' + e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshPets();
    // Check if user is already logged in
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, [])

  // Authentication functions
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setIsAuthenticated(true);
        setUser(data.data.user);
        setLoginOpen(false);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      alert('Login error: ' + error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setIsAuthenticated(true);
        setUser(data.data.user);
        setRegisterOpen(false);
        setRegisterData({ email: '', password: '', firstName: '', lastName: '', role: 'user' });
      } else {
        alert('Registration failed: ' + data.message);
      }
    } catch (error) {
      alert('Registration error: ' + error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Pet management functions
  const handleEditPet = (pet: any) => {
    setSelectedPet(pet);
    // Populate form with existing pet data
    setNewPetData({
      name: pet.name,
      breed: pet.breed,
      age: pet.age.toString(),
      image: pet.image || pet.url || '',
      costRange: pet.costRange.toString(),
      personalityCharacteristics: pet.personalityCharacteristics || ''
    });
    setEditPetOpen(true);
  };

  const handleDeletePet = async (petId: string) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:3000/api/pets/${petId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          await refreshPets();
        } else {
          alert('Failed to delete pet');
        }
      } catch (error) {
        alert('Error deleting pet: ' + error);
      }
    }
  };

  const handleViewPetDetails = (pet: any) => {
    setSelectedPet(pet);
    setPetDetailsOpen(true);
  };

  const handleCreatePet = async () => {
    // Validate form
    if (!newPetData.name || !newPetData.breed || !newPetData.age || !newPetData.image || !newPetData.costRange || !newPetData.personalityCharacteristics) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('http://localhost:3000/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newPetData.name,
          breed: newPetData.breed,
          age: parseInt(newPetData.age),
          image: newPetData.image,
          costRange: parseInt(newPetData.costRange),
          personalityCharacteristics: newPetData.personalityCharacteristics,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Reset form
        setNewPetData({
          name: '',
          breed: '',
          age: '',
          image: '',
          costRange: '',
          personalityCharacteristics: ''
        });
        setAddPetOpen(false);
        // Refresh the pet list
        await refreshPets();
        alert('Pet added successfully!');
      } else {
        alert('Failed to add pet: ' + data.message);
      }
    } catch (error) {
      alert('Error adding pet: ' + error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePet = async () => {
    if (!selectedPet) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`http://localhost:3000/api/pets/${selectedPet._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newPetData.name,
          breed: newPetData.breed,
          age: parseInt(newPetData.age),
          image: newPetData.image,
          costRange: parseInt(newPetData.costRange),
          personalityCharacteristics: newPetData.personalityCharacteristics,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setEditPetOpen(false);
        setSelectedPet(null);
        // Refresh the pet list
        await refreshPets();
        alert('Pet updated successfully!');
      } else {
        alert('Failed to update pet: ' + data.message);
      }
    } catch (error) {
      alert('Error updating pet: ' + error);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    const q = searchEntry.trim().toLowerCase();
  
    return pets.filter((pet: any) => {
      const name = String(pet.name || "").toLowerCase();
      const breed = String(pet.breed || "");
      const petAge = parseInt(pet.age);
      const cost = parseInt(pet.costRange);
  
      const matchesBreed = !breedChoice || breed === breedChoice;
      const intAgeChoice = parseInt(age);
      const matchesAge =
        !age ||
        petAge === intAgeChoice ||
        petAge === intAgeChoice + 1 ||
        petAge === intAgeChoice + 2;
  
      // New price filtering logic
      const matchesPrice =
        !priceRange ||
        (priceRange === 'low' && cost < 250) ||
        (priceRange === 'mid' && cost >= 250 && cost <= 750) ||
        (priceRange === 'high' && cost > 750);
  
      return name.includes(q) && matchesBreed && matchesAge && matchesPrice;
    });
  }, [pets, searchEntry, breedChoice, age, priceRange]);
  
 //const handleChange = (event: SelectChangeEvent) => {
   // setAge(event.target.value as string);
  //};

  const petCards = filtered.map((pet: any) => {
    const imageUrl = pet.image || pet.url;
    const isAdmin = user?.role === 'admin';
    
    return (
      <div key={pet._id} className="pet-grid-item">
        <Card 
          className="pet-card" 
          sx={{height: '100%', position: 'relative', cursor: 'pointer'}}
          onClick={() => handleViewPetDetails(pet)}
        >
          {imageUrl ? (
            <CardMedia sx={{height: 220}} image={imageUrl} />
          ) : (
            <Box sx={{ height: 220, display: 'flex', alignItems: 'center', 
                justifyContent: 'center', backgroundColor: '#f3f4f6'}}>
              <Typography variant="subtitle1" color="text.secondary">
                No pet picture 
              </Typography>
            </Box>
          )}
          
          {isAdmin && (
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
              <Tooltip title="Edit Pet">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPet(pet);
                  }}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Pet">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePet(pet._id);
                  }}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          
          <CardContent>
            <Typography gutterBottom variant="h6">
              {pet.name}
            </Typography>
            <Typography gutterBottom variant="body2" color="text.secondary">
              {pet.breed}{pet.age ? `, ${pet.age} yrs` : ''}
            </Typography>
            {pet.costRange && (
              <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                ${pet.costRange}
              </Typography>
            )}
            {pet.personalityCharacteristics && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.75rem' }}>
                {pet.personalityCharacteristics.length > 50 
                  ? `${pet.personalityCharacteristics.substring(0, 50)}...`
                  : pet.personalityCharacteristics}
              </Typography>
            )}
          </CardContent>
        </Card>
      </div>
    )
  })

  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 4 }}>
            <PetsIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Pawgrammers
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Welcome, {user?.firstName} {user?.lastName}
                </Typography>
                {user?.role === 'admin' && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      // Reset form when opening
                      setNewPetData({
                        name: '',
                        breed: '',
                        age: '',
                        image: '',
                        costRange: '',
                        personalityCharacteristics: ''
                      });
                      setAddPetOpen(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Add Pet
                  </Button>
                )}
                <Button
                  color="inherit"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  startIcon={<LoginIcon />}
                  onClick={() => setLoginOpen(true)}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  onClick={() => setRegisterOpen(true)}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>

        

        <Stack
          direction={'row'}
          spacing={3}

        >


        <Box
          sx={{
            width: { sm: 280 }, 
            //position: { sm: 'sticky' },
            top: { sm: 16 },    
          }}
        >
          <Button 
            variant="outlined" 
            onClick={refreshPets} 
            disabled={loading}
            sx={{ mb: 2, width: '100%' }}
          >
            {loading ? 'Loading...' : 'Refresh Pets'}
          </Button>

          <TextField
            fullWidth
            value={searchEntry}
            onChange={(e) => setSearchEntry(e.target.value)}
            id="search"
            label="Search"
            variant="outlined"
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="age-label">Age</InputLabel>
            <Select
              labelId="age-label"
              id="age-selection"
              value={age}
              label="Age"
              onChange={(e) => setAge(e.target.value)}
              
            >
              <MenuItem value=""> None </MenuItem>
              <MenuItem value="0">0-3</MenuItem>
              <MenuItem value="4">4-6</MenuItem>
              <MenuItem value="7">7+</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="breed-label">Breed</InputLabel>
            <Select
              labelId="breed-label"
              id="breed-selection"
              value={breedChoice}
              label="Breed"
              onChange={(e) => setBreed(e.target.value)}
            >
              <MenuItem value=""> None </MenuItem>
              <MenuItem value="Poodle">Poodle</MenuItem>
              <MenuItem value="Golden Retriever">Golden Retriever</MenuItem>
              <MenuItem value="Labrador Retriever">Labrador Retriever</MenuItem>
              <MenuItem value="Chihuahua">Chihuahua</MenuItem>
              <MenuItem value="Pomeranian">Pomeranian</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="price-label">Price Range</InputLabel>
            <Select
              labelId="price-label"
              id="price-selection"
              value={priceRange}
              label="Price Range"
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="low">Under $250</MenuItem>
              <MenuItem value="mid">$250 - $750</MenuItem>
              <MenuItem value="high">Over $750</MenuItem>
            </Select>
          </FormControl>


        </Box>
            
          
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>

          <Typography >Best Matches</Typography>

          <Box sx={{ height: 20 }} />

          {loading && (
            <Box sx={{display: 'flex', justifyContent: 'center', py: 8}}>
              <CircularProgress />
            </Box>
          )}

          {!loading && error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}

          {!loading && !error && (
            <div className="pet-grid">
              {petCards}
            </div>
          )}

        </Box>

        </Stack>
      </Container>

      {/* Login Dialog */}
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Login to Pawgrammers</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginOpen(false)}>Cancel</Button>
          <Button onClick={handleLogin} variant="contained">Login</Button>
        </DialogActions>
      </Dialog>

      {/* Register Dialog */}
      <Dialog open={registerOpen} onClose={() => setRegisterOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Join Pawgrammers</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="First Name"
              value={registerData.firstName}
              onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={registerData.lastName}
              onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegisterOpen(false)}>Cancel</Button>
          <Button onClick={handleRegister} variant="contained">Register</Button>
        </DialogActions>
      </Dialog>

      {/* Pet Details Dialog */}
      <Dialog open={petDetailsOpen} onClose={() => setPetDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedPet?.name} - Pet Details</DialogTitle>
        <DialogContent>
          {selectedPet && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {selectedPet.image || selectedPet.url ? (
                  <Box sx={{ width: 200, height: 200, flexShrink: 0 }}>
                    <img 
                      src={selectedPet.image || selectedPet.url} 
                      alt={selectedPet.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">No image</Typography>
                  </Box>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" gutterBottom>{selectedPet.name}</Typography>
                  <Typography variant="h6" color="primary" gutterBottom>${selectedPet.costRange}</Typography>
                  <Typography variant="body1" gutterBottom><strong>Breed:</strong> {selectedPet.breed}</Typography>
                  <Typography variant="body1" gutterBottom><strong>Age:</strong> {selectedPet.age} years old</Typography>
                </Box>
              </Box>
              <Typography variant="h6" gutterBottom>Personality Characteristics</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedPet.personalityCharacteristics}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPetDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Pet Dialog */}
      <Dialog open={addPetOpen} onClose={() => !submitting && setAddPetOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Pet</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Pet Name"
              value={newPetData.name}
              onChange={(e) => setNewPetData({...newPetData, name: e.target.value})}
              required
              fullWidth
            />
            <TextField
              label="Breed"
              value={newPetData.breed}
              onChange={(e) => setNewPetData({...newPetData, breed: e.target.value})}
              required
              fullWidth
            />
            <TextField
              label="Age (years)"
              type="number"
              value={newPetData.age}
              onChange={(e) => setNewPetData({...newPetData, age: e.target.value})}
              required
              fullWidth
            />
            <TextField
              label="Image URL"
              value={newPetData.image}
              onChange={(e) => setNewPetData({...newPetData, image: e.target.value})}
              required
              fullWidth
              placeholder="https://example.com/pet-image.jpg"
            />
            <TextField
              label="Cost Range ($)"
              type="number"
              value={newPetData.costRange}
              onChange={(e) => setNewPetData({...newPetData, costRange: e.target.value})}
              required
              fullWidth
            />
            <TextField
              label="Personality Characteristics"
              value={newPetData.personalityCharacteristics}
              onChange={(e) => setNewPetData({...newPetData, personalityCharacteristics: e.target.value})}
              required
              fullWidth
              multiline
              rows={3}
              placeholder="Friendly, energetic, good with kids..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPetOpen(false)} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleCreatePet} 
            variant="contained"
            disabled={submitting || !newPetData.name || !newPetData.breed || !newPetData.age || !newPetData.image || !newPetData.costRange || !newPetData.personalityCharacteristics}
          >
            {submitting ? 'Adding...' : 'Add Pet'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Pet Dialog */}
      <Dialog open={editPetOpen} onClose={() => !submitting && setEditPetOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Pet: {selectedPet?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Pet Name"
              value={newPetData.name}
              onChange={(e) => setNewPetData({...newPetData, name: e.target.value})}
              required
              fullWidth
            />
            <TextField
              label="Breed"
              value={newPetData.breed}
              onChange={(e) => setNewPetData({...newPetData, breed: e.target.value})}
              required
              fullWidth
            />
            <TextField
              label="Age (years)"
              type="number"
              value={newPetData.age}
              onChange={(e) => setNewPetData({...newPetData, age: e.target.value})}
              required
              fullWidth
            />
            <TextField
              label="Image URL"
              value={newPetData.image}
              onChange={(e) => setNewPetData({...newPetData, image: e.target.value})}
              required
              fullWidth
              placeholder="https://example.com/pet-image.jpg"
            />
            <TextField
              label="Cost Range ($)"
              type="number"
              value={newPetData.costRange}
              onChange={(e) => setNewPetData({...newPetData, costRange: e.target.value})}
              required
              fullWidth
            />
            <TextField
              label="Personality Characteristics"
              value={newPetData.personalityCharacteristics}
              onChange={(e) => setNewPetData({...newPetData, personalityCharacteristics: e.target.value})}
              required
              fullWidth
              multiline
              rows={3}
              placeholder="Friendly, energetic, good with kids..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPetOpen(false)} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleUpdatePet} 
            variant="contained"
            disabled={submitting || !newPetData.name || !newPetData.breed || !newPetData.age || !newPetData.image || !newPetData.costRange || !newPetData.personalityCharacteristics}
          >
            {submitting ? 'Updating...' : 'Update Pet'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}


export default OurDash

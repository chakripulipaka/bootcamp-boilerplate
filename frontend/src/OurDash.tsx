import './ExampleDashboard.css'
import pets from './examplepets.json' 
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { Stack } from '@mui/material';

import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import { useState } from "react";
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

function OurDash() {
  const [searchEntry, setSearchEntry] = useState<string>('')
  const [age, setAge] = useState("");
  const [breedChoice, setBreed] = useState("");

  //const petsFilte = useMemo(calculateValue, dependencies)

  const filtered = useMemo(() => {
  const q = searchEntry.trim().toLowerCase();

  return pets.filter((pet: any) => {
    const name = String(pet.name || "").toLowerCase();
    const breed = String(pet.breed || "");
    const petAge = parseInt(pet.age);

    const matchesBreed = !breedChoice || breed === breedChoice;
    const intAgeChoice = parseInt(age);
    const matchesAge =
      !age ||
      petAge === intAgeChoice ||
      petAge === intAgeChoice + 1 ||
      petAge === intAgeChoice + 2;

    return name.includes(q) && matchesBreed && matchesAge;
  });
}, [searchEntry, breedChoice, age]);

 //const handleChange = (event: SelectChangeEvent) => {
   // setAge(event.target.value as string);
  //};

  const petCards = filtered.map((pet: any) => { //for local json file: change "data" to "pets" and uncomment the json import line 
    //const petsFilter = pets.filter((pet) => pet.name.includes(searchEntry))
    return (
      <div key={pet._id} className="pet-grid-item">
        <Card className="pet-card" sx={{height: '100%', position: 'relative'}}>
          {pet.url ? (
            <CardMedia sx={{height: 220}} image={pet.url} />
          ) : (
            <Box sx={{ height: 220, display: 'flex', alignItems: 'center', 
                justifyContent: 'center', backgroundColor: '#f3f4f6'}}>
              <Typography variant="subtitle1" color="text.secondary">
                No pet picture 
              </Typography>
            </Box>
          )}
          <CardContent>
            <Typography gutterBottom variant="h6">
              {pet.name}
            </Typography>
            <Typography gutterBottom variant="body2" color="text.secondary">
              {pet.breed}{pet.age ? `, ${pet.age} yrs` : ''}
            </Typography>
          </CardContent>
        </Card>
      </div>
    )
  })

  return (
    <>
      <Container maxWidth="lg">
        

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
              <MenuItem value="7+">7+</MenuItem>
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
            </Select>
          </FormControl>

        </Box>
            
          
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>

          <Typography >Best Matches</Typography>

          <Box sx={{ height: 20 }} />

          <div className="pet-grid">
            {petCards}
          </div>

        </Box>

        </Stack>
      </Container>
    </>
  )
  
    // const pages = ['Products', 'Pricing', 'Blog'];
    // const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

    // function ResponsiveAppBar() {
    // const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    // const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    // const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    //     setAnchorElNav(event.currentTarget);
    // };
    // const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    //     setAnchorElUser(event.currentTarget);
    // };

    // const handleCloseNavMenu = () => {
    //     setAnchorElNav(null);
    // };

    // const handleCloseUserMenu = () => {
    //     setAnchorElUser(null);
    // };

    // return (
    //     <AppBar position="static">
    //     <Container maxWidth="xl">
    //         <Toolbar disableGutters>
    //         <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
    //         <Typography
    //             variant="h6"
    //             noWrap
    //             component="a"
    //             href="#app-bar-with-responsive-menu"
    //             sx={{
    //             mr: 2,
    //             display: { xs: 'none', md: 'flex' },
    //             fontFamily: 'monospace',
    //             fontWeight: 700,
    //             letterSpacing: '.3rem',
    //             color: 'inherit',
    //             textDecoration: 'none',
    //             }}
    //         >
    //             LOGO
    //         </Typography>

    //         <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
    //             <IconButton
    //             size="large"
    //             aria-label="account of current user"
    //             aria-controls="menu-appbar"
    //             aria-haspopup="true"
    //             onClick={handleOpenNavMenu}
    //             color="inherit"
    //             >
    //             <MenuIcon />
    //             </IconButton>
    //             <Menu
    //             id="menu-appbar"
    //             anchorEl={anchorElNav}
    //             anchorOrigin={{
    //                 vertical: 'bottom',
    //                 horizontal: 'left',
    //             }}
    //             keepMounted
    //             transformOrigin={{
    //                 vertical: 'top',
    //                 horizontal: 'left',
    //             }}
    //             open={Boolean(anchorElNav)}
    //             onClose={handleCloseNavMenu}
    //             sx={{ display: { xs: 'block', md: 'none' } }}
    //             >
    //             {pages.map((page) => (
    //                 <MenuItem key={page} onClick={handleCloseNavMenu}>
    //                 <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
    //                 </MenuItem>
    //             ))}
    //             </Menu>
    //         </Box>
    //         <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
    //         <Typography
    //             variant="h5"
    //             noWrap
    //             component="a"
    //             href="#app-bar-with-responsive-menu"
    //             sx={{
    //             mr: 2,
    //             display: { xs: 'flex', md: 'none' },
    //             flexGrow: 1,
    //             fontFamily: 'monospace',
    //             fontWeight: 700,
    //             letterSpacing: '.3rem',
    //             color: 'inherit',
    //             textDecoration: 'none',
    //             }}
    //         >
    //             LOGO
    //         </Typography>
    //         <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
    //             {pages.map((page) => (
    //             <Button
    //                 key={page}
    //                 onClick={handleCloseNavMenu}
    //                 sx={{ my: 2, color: 'white', display: 'block' }}
    //             >
    //                 {page}
    //             </Button>
    //             ))}
    //         </Box>
    //         <Box sx={{ flexGrow: 0 }}>
    //             <Tooltip title="Open settings">
    //             <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
    //                 <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
    //             </IconButton>
    //             </Tooltip>
    //             <Menu
    //             sx={{ mt: '45px' }}
    //             id="menu-appbar"
    //             anchorEl={anchorElUser}
    //             anchorOrigin={{
    //                 vertical: 'top',
    //                 horizontal: 'right',
    //             }}
    //             keepMounted
    //             transformOrigin={{
    //                 vertical: 'top',
    //                 horizontal: 'right',
    //             }}
    //             open={Boolean(anchorElUser)}
    //             onClose={handleCloseUserMenu}
    //             >
    //             {settings.map((setting) => (
    //                 <MenuItem key={setting} onClick={handleCloseUserMenu}>
    //                 <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
    //                 </MenuItem>
    //             ))}
    //             </Menu>
    //         </Box>
    //         </Toolbar>
    //     </Container>
    //     </AppBar>
    // );
    // }


}


export default OurDash

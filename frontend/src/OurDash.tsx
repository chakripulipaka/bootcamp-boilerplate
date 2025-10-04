import './ExampleDashboard.css'
import pets from './examplepets.json' 
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

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
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  //const petsFilte = useMemo(calculateValue, dependencies)

  const filtered = useMemo(() => {
    const q = searchEntry.trim()
    if (!q) return pets
    return pets.filter((pet: any) => {
      const name = String(pet.name || '')
      const breed = String(pet.breed || '')

      return name.toLowerCase().includes(q) || breed.includes(q)
    })
  }, [pets, searchEntry])

 const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

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
        <Box className="dashboard" sx={{py: 4}}>
          <TextField 
            value = {searchEntry} 
            onChange={(event) => setSearchEntry(event.target.value)}
            id="outlined-basic"
            label="Search" 
            variant="outlined" 
            />
          <div className="pet-grid">
            {petCards}
          </div>
        </Box>
        <FormControl fullWidth>
            <InputLabel id="age">Age</InputLabel>
            <Select
                labelId="Age"
                id="age-selection"
                value={age}
                label="Age"
                onChange={handleChange}
            >
                <option value="0-3">0-3</option>
                <option value="4-6">4-6</option>
                <option value="7+">5-7</option>
            </Select>
        </FormControl>
        <FormControl fullWidth>
            <InputLabel id="breed">Breed</InputLabel>
            <Select
                labelId="Breed"
                id="breed-selection"
                value={breed}
                label="Breed"
                onChange={handleChange}
            >
                <option value="Poodle">Poodle</option>
                <option value="Golden Retriever">Golden Retriever</option>
            </Select>
        </FormControl>
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

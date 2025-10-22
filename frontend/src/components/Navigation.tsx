import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Pets as PetsIcon,
  Login as LoginIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        {/* Logo and Brand */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            mr: 4,
          }}
          onClick={() => handleNavigation('/')}
        >
          <PetsIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Pawgrammers
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Pet Dashboard - Always visible */}
          <Button
            color="inherit"
            onClick={() => handleNavigation('/dashboard')}
            sx={{
              bgcolor: isActive('/dashboard') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Pet Dashboard
          </Button>

          {isAuthenticated ? (
            <>
              {/* User Menu */}
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>

              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {user?.firstName} {user?.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={() => {
                    handleNavigation('/profile');
                    handleMenuClose();
                  }}
                >
                  <PersonIcon sx={{ mr: 1 }} fontSize="small" />
                  Profile
                </MenuItem>

                {user?.role === 'admin' && (
                  <MenuItem
                    onClick={() => {
                      handleNavigation('/admin');
                      handleMenuClose();
                    }}
                  >
                    <AdminIcon sx={{ mr: 1 }} fontSize="small" />
                    Admin Panel
                  </MenuItem>
                )}

                <Divider />

                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            /* Login Button */
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={() => handleNavigation('/login')}
              sx={{
                bgcolor: isActive('/login') ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;


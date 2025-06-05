'use client'
import React, { useState } from 'react';
import {
  TextField,
  IconButton,
  InputAdornment,
  Box,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { Button } from '@mui/joy';
import toast from 'react-hot-toast';

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [changingPassword, setChangingPassword] = useState(false) 

  const handleTogglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setChangingPassword(true)

    try {
    const formData = new FormData();
    formData.append('currentPassword', currentPassword);
    formData.append('newPassword', newPassword);

    const response = await fetch('/api/change-password', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to change password');
    }

    const result = await response.json();
    console.log('Password changed successfully:', result);
    if(result.success == true ){
        toast("Password changed successfully")
        return 
    }
    throw new Error("Error") 
    } catch (error) {
        toast(error.message)
    console.error('Error changing password:', error);
    } finally {
    setChangingPassword(false);
    }


  };

  return (
    
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, background:'white', mx: 'auto', p: 3 }}
    >
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>

      <TextField
        label="Current Password"
        name="currentPassword"
        type={showPassword.current ? 'text' : 'password'}
        value={formData.currentPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => handleTogglePassword('current')} edge="end">
                {showPassword.current ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="New Password"
        name="newPassword"
        type={showPassword.new ? 'text' : 'password'}
        value={formData.newPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => handleTogglePassword('new')} edge="end">
                {showPassword.new ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Confirm New Password"
        name="confirmPassword"
        type={showPassword.confirm ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={!!error}
        helperText={error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => handleTogglePassword('confirm')} edge="end">
                {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button loading={changingPassword} type="submit" variant="solid" fullWidth sx={{ mt: 2 }}>
        Change Password
      </Button>
    </Box>
  );
};

export default ChangePasswordForm;

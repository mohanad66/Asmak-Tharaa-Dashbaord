import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar
} from '@mui/material';
import { Warning, Delete, Info } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const ConfirmAlert = ({
  open = false,
  onClose,
  onConfirm,
  title = "confirmation",
  message = "are_you_sure",
  confirmText = "yes",
  cancelText = "no",
  confirmColor = "error",
  type = "warning" // warning, delete, info
}) => {
  const { t } = useTranslation();

  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <Delete color="error" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <Warning color="warning" />;
    }
  };

  const handleConfirm = () => {
    onConfirm && onConfirm();
    onClose();
    
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="confirmation-dialog-title"
      maxWidth="sm"
      fullWidth
      // style={{background:'transparent'}}
    >
      <DialogTitle id="confirmation-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'transparent' }}>
            {getIcon()}
          </Avatar>
          <Typography variant="h6">{t(title)}</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {t(message)}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleCancel}
          color="inherit"
          variant="outlined"
          size="large"
        >
          {t(cancelText)}
        </Button>
        <Button 
          onClick={handleConfirm}
          color={confirmColor}
          variant="contained"
          size="large"
          autoFocus
          startIcon={<Delete />}
        >
          {t(confirmText)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmAlert;
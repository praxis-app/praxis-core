import { Close } from '@mui/icons-material';
import { Alert, IconButton, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';

const AUTO_HIDE_DURATION = 6000;

const Toast = () => {
  const { toast, setToast } = useAppStore((state) => state);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (toast) {
      setOpen(true);
    }
  }, [toast]);

  useEffect(
    () => () => {
      setToast(null);
      setOpen(false);
    },
    [setToast],
  );

  if (!toast) {
    return null;
  }

  return (
    <Snackbar
      sx={{
        bottom: 80,
        transition: 'bottom 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      }}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      autoHideDuration={AUTO_HIDE_DURATION}
      onClose={() => setOpen(false)}
      open={open}
    >
      <Alert
        action={
          <IconButton size="small" onClick={() => setOpen(false)}>
            <Close fontSize="small" sx={{ color: GRAY['50'] }} />
          </IconButton>
        }
        severity={toast.status}
        sx={{ color: GRAY['50'] }}
        variant="filled"
      >
        {toast.title}
      </Alert>
    </Snackbar>
  );
};

export default Toast;

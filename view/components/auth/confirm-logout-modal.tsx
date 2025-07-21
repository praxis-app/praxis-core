import { Box, Button, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAppStore } from '../../store/app.store';
import Modal from '../shared/modal';

interface Props {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
}

const ConfirmLogoutModal = ({ isOpen, setIsOpen }: Props) => {
  const { setIsNavDrawerOpen, setIsLoggedIn } = useAppStore((state) => state);

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logOut, isPending } = useMutation({
    mutationFn: api.logOut,
    onSuccess: async () => {
      await navigate(NavigationPaths.Home);
      setIsOpen(false);
      setIsNavDrawerOpen(false);
      setIsLoggedIn(false);
      queryClient.clear();
    },
  });

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Typography marginBottom={3}>{t('users.prompts.logOut')}</Typography>
      <Box display="flex" gap={1}>
        <Button
          variant="text"
          sx={{ color: 'text.primary' }}
          onClick={() => setIsOpen(false)}
          disabled={isPending}
        >
          {t('actions.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => logOut()}
          disabled={isPending}
        >
          {t('users.actions.logOut')}
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmLogoutModal;

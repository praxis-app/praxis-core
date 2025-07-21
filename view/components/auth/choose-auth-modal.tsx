import { Box, Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import { LocalStorageKeys } from '../../constants/shared.constants';
import { useSignUpData } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';
import Modal from '../shared/modal';

interface Props {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  sendMessage(): Promise<void>;
}

const ChooseAuthModal = ({ isOpen, setIsOpen, sendMessage }: Props) => {
  const { inviteToken, setIsLoggedIn } = useAppStore((state) => state);

  const { mutate: createAnonSession } = useMutation({
    mutationFn: async () => {
      const { access_token } = await api.createAnonSession(inviteToken);
      localStorage.setItem(LocalStorageKeys.AccessToken, access_token);
      setIsLoggedIn(true);
      sendMessage();
    },
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUpPath } = useSignUpData();

  const handleSendAnonMsgBtnClick = () => {
    createAnonSession();
    setIsOpen(false);
  };

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Typography marginBottom={3}>
        {t('users.prompts.chooseAuthFlow')}
      </Typography>

      <Box display="flex" gap={1}>
        <Button onClick={handleSendAnonMsgBtnClick} variant="contained">
          {t('messages.actions.sendAnonymous')}
        </Button>
        <Button onClick={() => navigate(signUpPath)} variant="contained">
          {t('users.actions.signUp')}
        </Button>
      </Box>
    </Modal>
  );
};

export default ChooseAuthModal;

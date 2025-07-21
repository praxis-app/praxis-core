import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  LocalStorageKeys,
  NavigationPaths,
} from '../../constants/shared.constants';
import { useSignUpData } from '../../hooks/user.hooks';
import BotMessage from '../messages/bot-message';

interface Props {
  onDismiss: () => void;
}

const WelcomeMessage = ({ onDismiss }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { signUpPath, showSignUp } = useSignUpData();

  const handleDismiss = () => {
    localStorage.setItem(LocalStorageKeys.HideWelcomeMessage, 'true');
    onDismiss();
  };

  return (
    <BotMessage
      bodySx={{ paddingTop: 0.9 }}
      onDismiss={handleDismiss}
      currentUserOnly
    >
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        {t('prompts.welcomeToPraxis')}
      </Typography>

      <Typography sx={{ marginBottom: 1.5 }}>
        {t('welcome.messages.projectDescription1')}
      </Typography>

      <Typography sx={{ marginBottom: 1.5 }}>
        {t('welcome.messages.projectDescription2')}
      </Typography>

      <Typography sx={{ marginBottom: 1.5 }}>
        {t('welcome.messages.inDev')}
      </Typography>

      {showSignUp && (
        <Button
          variant="contained"
          onClick={() => navigate(signUpPath)}
          sx={{ textTransform: 'uppercase', marginRight: '12px' }}
        >
          {t('users.actions.signUp')}
        </Button>
      )}

      <Button
        variant="contained"
        onClick={() => navigate(NavigationPaths.Login)}
        sx={{ textTransform: 'uppercase' }}
      >
        {t('users.actions.logIn')}
      </Button>
    </BotMessage>
  );
};

export default WelcomeMessage;

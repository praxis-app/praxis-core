import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  LocalStorageKeys,
  NavigationPaths,
} from '@/constants/shared.constants';
import { BotMessage } from '../messages/bot-message';
import { useSignUpData } from '@/hooks/use-sign-up-data';
import { Button } from '../ui/button';

interface Props {
  onDismiss: () => void;
}

export const WelcomeMessage = ({ onDismiss }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { signUpPath, showSignUp, isAnon, isLoggedIn } = useSignUpData();

  const handleDismiss = () => {
    localStorage.setItem(LocalStorageKeys.HideWelcomeMessage, 'true');
    onDismiss();
  };

  return (
    <BotMessage
      bodyClassName="pt-2.25"
      onDismiss={handleDismiss}
      currentUserOnly
    >
      <p className="mb-2 text-xl">{t('prompts.welcomeToPraxis')}</p>

      <p className="mb-2.5">{t('welcome.messages.projectDescription1')}</p>

      <p className="mb-2.5">{t('welcome.messages.projectDescription2')}</p>

      <p className="mb-3">{t('welcome.messages.inDev')}</p>

      {showSignUp && (
        <Button
          onClick={() => navigate(signUpPath)}
          className="mr-3 uppercase"
          variant="secondary"
        >
          {t('auth.actions.signUp')}
        </Button>
      )}

      {!isAnon && !isLoggedIn && (
        <Button
          onClick={() => navigate(NavigationPaths.Login)}
          className="uppercase"
          variant="secondary"
        >
          {t('auth.actions.logIn')}
        </Button>
      )}
    </BotMessage>
  );
};

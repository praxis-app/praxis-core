import { useTranslation } from 'react-i18next';
import { BotMessage } from '../messages/bot-message';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { NavigationPaths } from '@/constants/shared.constants';

export const AuthMessage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <BotMessage>
      <div className="pt-2 pb-2.5 text-[1.2rem]">
        {t('prompts.welcomeToPraxis')}
      </div>
      <div className="pb-2.5">{t('welcome.messages.projectDescription1')}</div>
      <div className="pb-2.5">{t('welcome.messages.projectDescription2')}</div>
      <div className="pb-2.5">{t('welcome.messages.inDev')}</div>

      <Button
        variant="secondary"
        className="mb-1 uppercase"
        onClick={() => navigate(NavigationPaths.Login)}
      >
        {t('auth.actions.logIn')}
      </Button>
    </BotMessage>
  );
};

import { timeAgo } from '@/lib/time.utils';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import appIconImg from '../../assets/images/app-icon.png';
import { UserAvatar } from '../users/user-avatar';

interface Props {
  children: ReactNode;
}

export const BotMessage = ({ children }: Props) => {
  const { t } = useTranslation();
  const formattedDate = timeAgo(Date());

  return (
    <div className="flex gap-4 pt-4">
      <UserAvatar
        name={t('messages.names.praxisBot')}
        imageSrc={appIconImg}
        className="mt-0.5"
      />

      <div>
        <div className="flex items-center gap-1.5">
          <div className="font-medium">{t('messages.names.praxisBot')}</div>
          <div className="text-muted-foreground text-sm">{formattedDate}</div>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

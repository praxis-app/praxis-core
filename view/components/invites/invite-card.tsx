import { Invite } from '@/types/invite.types';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { timeFromNow } from '@/lib/time.utils';
import { useTranslation } from 'react-i18next';
import { copyInviteLink } from '@/lib/invite.utils';
import { toast } from 'sonner';
import { UserAvatar } from '../users/user-avatar';

interface Props {
  invite: Invite;
}

export const InviteCard = ({
  invite: { token, uses, maxUses, expiresAt, user },
}: Props) => {
  const { t } = useTranslation();

  const usesText = `${t('invites.labels.usesWithColon')} ${
    uses + (maxUses ? `/${maxUses}` : '')
  }`;

  const handleCopyLink = async () => {
    await copyInviteLink(token);
    toast(t('invites.prompts.copiedToClipboard'));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex gap-2 font-normal">
          <div onClick={handleCopyLink} className="cursor-pointer">
            {token}
          </div>
          <div className="text-positive">
            {expiresAt ? timeFromNow(expiresAt) : t('time.never')}
          </div>
        </CardTitle>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <UserAvatar
            name={user.name}
            userId={user.id}
            className="size-7"
            fallbackClassName="text-[0.8rem]"
          />
          <div>{user.name}</div>
        </div>
        <div>{usesText}</div>
      </CardContent>
    </Card>
  );
};

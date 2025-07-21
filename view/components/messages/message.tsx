import { timeAgo } from '@/lib/time.utils';
import FormattedText from '../shared/formatted-text';
import { UserAvatar } from '../users/user-avatar';

interface Props {
  message: any;
}

export const Message = ({ message }: Props) => {
  const { body } = message.getContent();

  const userId = message.getSender() ?? '';

  const createdAt = message.getDate()?.toString() ?? '';
  const formattedDate = timeAgo(createdAt);

  if (!body) {
    return null;
  }

  return (
    <div className="flex gap-4 pt-4">
      <UserAvatar name={'TODO: name'} userId={userId} className="mt-0.5" />

      <div>
        <div className="flex items-center gap-1.5">
          <div className="font-medium">{'TODO: name'}</div>
          <div className="text-muted-foreground text-sm">{formattedDate}</div>
        </div>

        <FormattedText text={body} />
      </div>
    </div>
  );
};

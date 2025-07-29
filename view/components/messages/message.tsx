// TODO: Add images

import { timeAgo } from '@/lib/time.utils';
import { Message as MessageType } from '@/types/message.types';
import { FormattedText } from '../shared/formatted-text';
import { UserAvatar } from '../users/user-avatar';

interface Props {
  message: MessageType;
}

export const Message = ({ message: { body, user, createdAt } }: Props) => {
  const formattedDate = timeAgo(createdAt);

  if (!body) {
    return null;
  }

  return (
    <div className="flex gap-4 pt-4">
      <UserAvatar name={user.name} userId={user.id} className="mt-0.5" />

      <div>
        <div className="flex items-center gap-1.5">
          <div className="font-medium">{user.name}</div>
          <div className="text-muted-foreground text-sm">{formattedDate}</div>
        </div>

        <FormattedText text={body} />
      </div>
    </div>
  );
};

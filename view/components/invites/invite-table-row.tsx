import { NavigationPaths } from '@/constants/shared.constants';
import { useAbility } from '@/hooks/use-ability';
import { copyInviteLink } from '@/lib/invite.utils';
import { truncate } from '@/lib/text.utils';
import { timeFromNow } from '@/lib/time.utils';
import { Invite } from '@/types/invite.types';
import { useTranslation } from 'react-i18next';
import { MdAssignment } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ItemMenu from '../shared/item-menu';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { TableCell, TableRow } from '../ui/table';
import { UserAvatar } from '../users/user-avatar';

interface Props {
  invite: Invite;
}

export const InviteTableRow = ({
  invite: { user, token, uses, maxUses, expiresAt },
}: Props) => {
  const { t } = useTranslation();
  const ability = useAbility();

  const handleCopyLink = async () => {
    await copyInviteLink(token);
    toast(t('invites.prompts.copiedToClipboard'));
  };

  const truncatedUsername = truncate(user.name, 18);

  const deleteInvitePrompt = t('prompts.deleteItem', {
    itemType: 'invite link',
  });

  return (
    <TableRow>
      <TableCell>
        <Link to={NavigationPaths.Home} className="flex items-center gap-3">
          <UserAvatar
            userId={user.id}
            name={user.name}
            className="size-6"
            fallbackClassName="text-[0.7rem]"
          />
          <div>{truncatedUsername}</div>
        </Link>
      </TableCell>

      <TableCell>{token}</TableCell>

      <TableCell>{uses + (maxUses ? `/${maxUses}` : '')}</TableCell>

      <TableCell>
        {expiresAt ? timeFromNow(expiresAt) : t('time.infinity')}
      </TableCell>

      <TableCell>
        <ItemMenu
          canDelete={ability.can('manage', 'Invite')}
          deletePrompt={deleteInvitePrompt}
          prependChildren
        >
          <DropdownMenuItem onClick={handleCopyLink}>
            <MdAssignment className="mr-2" />
            {t('actions.copy')}
          </DropdownMenuItem>
        </ItemMenu>
      </TableCell>
    </TableRow>
  );
};

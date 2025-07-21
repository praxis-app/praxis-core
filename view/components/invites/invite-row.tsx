import { Assignment } from '@mui/icons-material';
import { Box, MenuItem, SxProps, TableCell, TableRow } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationPaths } from '../../constants/shared.constants';
import { useDeleteInviteMutation } from '../../hooks/invite.hooks';
import { useAbility } from '../../hooks/role.hooks';
import { useAppStore } from '../../store/app.store';
import { Invite } from '../../types/invite.types';
import { copyInviteLink } from '../../utils/invite.utils';
import { truncate } from '../../utils/text.utils';
import { timeFromNow } from '../../utils/time.utils';
import ItemMenu from '../shared/item-menu';
import { Link } from '../shared/link';
import UserAvatar from '../users/user-avatar';

interface Props {
  invite: Invite;
}

const InviteRow = ({
  invite: { id, user, token, uses, maxUses, expiresAt },
}: Props) => {
  const { setToast } = useAppStore((state) => state);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const { mutate: deleteInvite, isPending: isDeletePending } =
    useDeleteInviteMutation(id);

  const { t } = useTranslation();
  const ability = useAbility();

  const deleteInvitePrompt = t('prompts.deleteItem', {
    itemType: 'invite link',
  });

  const tableRowStyles: SxProps = {
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  };

  const handleCopyLink = async () => {
    await copyInviteLink(token);
    setToast({
      title: t('invites.prompts.copiedToClipboard'),
      status: 'success',
    });
    setMenuAnchorEl(null);
  };

  const truncatedUsername = truncate(user.name, 18);

  return (
    <TableRow sx={tableRowStyles}>
      <TableCell>
        <Link to={NavigationPaths.Home} sx={{ display: 'flex' }}>
          <UserAvatar
            userId={user.id}
            userName={user.name}
            size={24}
            sx={{ marginRight: 1.5 }}
          />
          <Box marginTop={0.25}>{truncatedUsername}</Box>
        </Link>
      </TableCell>

      <TableCell onClick={handleCopyLink} sx={{ cursor: 'pointer' }}>
        {token}
      </TableCell>

      <TableCell>{uses + (maxUses ? `/${maxUses}` : '')}</TableCell>

      <TableCell>
        {expiresAt ? timeFromNow(expiresAt) : t('time.infinity')}
      </TableCell>

      <TableCell>
        <ItemMenu
          anchorEl={menuAnchorEl}
          canDelete={ability.can('manage', 'Invite')}
          deletePrompt={deleteInvitePrompt}
          deleteItem={deleteInvite}
          setAnchorEl={setMenuAnchorEl}
          loading={isDeletePending}
          prependChildren
        >
          <MenuItem onClick={handleCopyLink}>
            <Assignment fontSize="small" sx={{ marginRight: 1 }} />
            {t('actions.copy')}
          </MenuItem>
        </ItemMenu>
      </TableCell>
    </TableRow>
  );
};

export default InviteRow;

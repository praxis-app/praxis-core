import { Assignment } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Link,
  MenuItem,
  CardContent as MuiCardContent,
  Typography,
  styled,
} from '@mui/material';
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
import UserAvatar from '../users/user-avatar';

const CardContent = styled(MuiCardContent)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  '&:last-child': {
    paddingBottom: 16,
    paddingTop: 4,
  },
}));

const CompactButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  minWidth: 'initial',
  padding: 0,
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
}));

interface Props {
  invite: Invite;
}

const InviteCard = ({
  invite: { id, user, token, uses, maxUses, expiresAt },
}: Props) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const { setToast } = useAppStore((state) => state);

  const { mutate: deleteInvite, isPending: isDeletePending } =
    useDeleteInviteMutation(id);

  const { t } = useTranslation();
  const ability = useAbility();

  const truncatedUsername = truncate(user.name, 25);

  const usesText = `${t('invites.labels.usesWithColon')} ${
    uses + (maxUses ? `/${maxUses}` : '')
  }`;
  const deleteInvitePrompt = t('prompts.deleteItem', {
    itemType: 'invite link',
  });

  const handleCopyLink = async () => {
    await copyInviteLink(token);
    setToast({
      title: t('invites.prompts.copiedToClipboard'),
      status: 'success',
    });
    setMenuAnchorEl(null);
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex">
            <CompactButton
              onClick={handleCopyLink}
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                lineHeight: 1.5,
                marginRight: 1,
              }}
            >
              {token}
            </CompactButton>

            <Typography sx={{ color: '#62c57a' }}>
              {expiresAt ? timeFromNow(expiresAt) : t('time.never')}
            </Typography>
          </Box>
        }
        action={
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
        }
      />
      <CardContent>
        <Link
          href={NavigationPaths.Home}
          sx={{ display: 'flex', textDecoration: 'none' }}
        >
          <UserAvatar
            userId={user.id}
            userName={truncatedUsername}
            size={24}
            sx={{ marginRight: 1.5, marginBottom: 0.25 }}
          />
          <Box>{truncatedUsername}</Box>
        </Link>

        <Typography>{usesText}</Typography>
      </CardContent>
    </Card>
  );
};

export default InviteCard;

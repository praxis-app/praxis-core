import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';
import { Message as MessageType } from '../../types/message.types';
import { timeAgo } from '../../utils/time.utils';
import AttachedImageList from '../images/attached-image-list';
import FormattedText from '../shared/formatted-text';
import UserAvatar from '../users/user-avatar';

interface Props {
  message: MessageType;
}

const Message = ({ message: { body, images, user, createdAt } }: Props) => {
  const { t } = useTranslation();
  const isLarge = useAboveBreakpoint('sm');

  const formattedDate = timeAgo(createdAt);
  const showImages = !!images?.length;

  return (
    <Box display="flex" gap={2} paddingBottom={2}>
      <UserAvatar
        userId={user.id}
        userName={user.name}
        sx={{ marginTop: 0.5 }}
      />

      <Box>
        <Box display="flex" gap={0.9}>
          <Typography fontFamily="Inter" fontWeight={600}>
            {user.name}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ cursor: 'default', fontSize: '14px', marginTop: 0.15 }}
            title={formattedDate}
          >
            {formattedDate}
          </Typography>
        </Box>

        {/* TODO: Truncate message body if it exceeds a certain length */}
        {body && (
          <FormattedText text={body} lineHeight={1.2} paddingBottom={0.4} />
        )}

        {/* TODO: Enable navigation between images in modal */}
        {showImages && (
          <AttachedImageList
            images={images}
            imageSx={{ borderRadius: 2 }}
            width={isLarge ? 350 : '100%'}
            paddingTop={0.7}
          />
        )}

        {!body && !showImages && (
          <Typography color="text.secondary" fontSize="15px">
            {t('prompts.noContent')}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Message;

import { Visibility } from '@mui/icons-material';
import { Box, BoxProps, ButtonBase, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import appIconImg from '../../assets/images/app-icon.png';
import { MIDDOT_WITH_SPACES } from '../../constants/shared.constants';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { BLURPLE } from '../../styles/theme';
import { timeAgo } from '../../utils/time.utils';
import UserAvatar from '../users/user-avatar';

interface Props extends BoxProps {
  children: ReactNode;
  bodySx?: BoxProps['sx'];
  currentUserOnly?: boolean;
  onDismiss?: () => void;
}

const BotMessage = ({
  children,
  bodySx,
  currentUserOnly,
  onDismiss,
  ...boxProps
}: Props) => {
  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();

  const formattedDate = timeAgo(Date());

  return (
    <Box display="flex" gap={2} paddingBottom={2} {...boxProps}>
      <UserAvatar imageSrc={appIconImg} sx={{ marginTop: 0.5 }} />

      <Box>
        <Box display="flex" gap={0.9}>
          <Typography fontFamily="Inter" fontWeight={600}>
            {t('messages.names.praxisBot')}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ cursor: 'default', fontSize: '14px', marginTop: 0.15 }}
            title={formattedDate}
          >
            {formattedDate}
          </Typography>
        </Box>

        <Box sx={bodySx}>{children}</Box>

        {(currentUserOnly || onDismiss) && (
          <Box display="flex" gap="4px" paddingTop={1}>
            {currentUserOnly && (
              <Box display="flex" gap="4px" alignItems="center">
                <Visibility
                  sx={{ fontSize: '13px', color: 'text.secondary' }}
                />
                <Typography fontSize="13px" color="text.secondary">
                  {t('messages.prompts.onlyVisibleToYou')}
                </Typography>
              </Box>
            )}
            {currentUserOnly && onDismiss && (
              <Box color="text.secondary" marginTop="1px">
                {MIDDOT_WITH_SPACES}
              </Box>
            )}
            {onDismiss && (
              <ButtonBase
                onClick={onDismiss}
                sx={{
                  color: isDarkMode ? BLURPLE['300'] : BLURPLE['500'],
                  marginTop: '1px',
                }}
              >
                {t('messages.actions.dismissMessage')}
              </ButtonBase>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BotMessage;

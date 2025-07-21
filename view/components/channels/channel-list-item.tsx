import { Settings, Tag } from '@mui/icons-material';
import {
  Box,
  Fade,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SxProps,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAbility } from '../../hooks/role.hooks';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { Channel } from '../../types/channel.types';

interface Props {
  channel: Channel;
  isActive: boolean;
  isGeneralChannel?: boolean;
}

/**
 * Channel list item component for the left navigation panel on desktop
 */
const ChannelListItem = ({ channel, isActive, isGeneralChannel }: Props) => {
  const [isHovering, setIsHovering] = useState(false);

  const isDarkMode = useIsDarkMode();
  const navigate = useNavigate();
  const ability = useAbility();

  const canManageChannels = ability.can('manage', 'Channel');
  const showSettingsBtn = canManageChannels && (isHovering || isActive);
  const channelPath = `${NavigationPaths.Channels}/${channel.id}`;

  const listItemBtnSx: SxProps = {
    color: 'text.secondary',
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
    '&:not(:last-child)': { marginBottom: '2px' },
    borderRadius: '4px',
    marginRight: '6px',
    marginLeft: '8px',
    paddingRight: '10px',
    paddingLeft: '8px',
    height: '30px',
  };
  const settingsIconSx: SxProps = {
    fontSize: '17px',
    marginTop: '3px',
    marginLeft: '2px',
    color: 'text.secondary',
    transition: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': { color: 'text.primary' },
  };

  const getChannelNameTextProps = () => {
    const selectedColor = isDarkMode ? 'white' : 'black';
    return {
      sx: {
        color: isActive ? selectedColor : 'text.secondary',
        fontWeight: 500,
        fontSize: '15px',
      },
    };
  };

  return (
    <ListItemButton
      key={channel.id}
      onClick={() =>
        navigate(isGeneralChannel ? NavigationPaths.Home : channelPath)
      }
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={listItemBtnSx}
    >
      <ListItemIcon sx={{ minWidth: '33px' }}>
        <Tag sx={{ color: 'text.secondary' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Box display="flex" justifyContent="space-between">
            <Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
              {channel.name}
            </Box>
            {showSettingsBtn && (
              <Fade easing="cubic-bezier(0.4, 0, 0.2, 1)" timeout={150} in>
                <Settings
                  sx={settingsIconSx}
                  onClick={(e) => {
                    navigate(`${NavigationPaths.Channels}/${channel.id}/edit`);
                    e.stopPropagation();
                  }}
                />
              </Fade>
            )}
          </Box>
        }
        primaryTypographyProps={getChannelNameTextProps()}
      />
    </ListItemButton>
  );
};

export default ChannelListItem;

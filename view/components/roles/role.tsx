import { ArrowForwardIos, Person } from '@mui/icons-material';
import {
  Avatar,
  Box,
  CardActionArea,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';
import { Role as RoleType } from '../../types/role.types';
import { Link } from '../shared/link';

interface Props {
  role: RoleType;
}

const Role = ({ role: { id, color, name, memberCount } }: Props) => {
  const { t } = useTranslation();

  const theme = useTheme();
  const isAboveMd = useAboveBreakpoint('md');

  const editRolePath = `${NavigationPaths.Roles}/${id}/edit`;

  const actionAreaStyles = {
    borderRadius: 2,
    paddingLeft: 0.75,
    paddingRight: 0.25,
    paddingY: 0.75,
  };
  const avatarStyes = {
    '.MuiSvgIcon-root': { color: 'black' },
    backgroundColor: color,
    marginRight: 1.5,
  };
  const memberIconStyles = {
    color: theme.palette.text.secondary,
    marginBottom: -0.5,
    marginRight: 0.35,
    fontSize: 18,
  };

  return (
    <Link to={editRolePath}>
      <CardActionArea sx={actionAreaStyles}>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex">
            <Avatar sx={avatarStyes} />

            <Box marginTop={-0.35}>
              <Typography
                display="inline-block"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                width={isAboveMd ? '500px' : '250px'}
                marginBottom={-0.2}
              >
                {name}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: 12,
                }}
              >
                <Person sx={memberIconStyles} />
                {t('roles.labels.membersCount', { count: memberCount })}
              </Typography>
            </Box>
          </Box>

          <ArrowForwardIos sx={{ alignSelf: 'center' }} />
        </Box>
      </CardActionArea>
    </Link>
  );
};

export default Role;

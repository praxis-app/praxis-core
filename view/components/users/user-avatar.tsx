// TODO: Add remaining layout and functionality - below is a WIP

import { Avatar, AvatarProps } from '@mui/material';
import chroma from 'chroma-js';
import ColorHash from 'color-hash';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import LazyLoadImage from '../images/lazy-load-image';
import { Link } from '../shared/link';

// TODO: Update to take `user` as a prop

interface Props extends AvatarProps {
  imageFile?: File;
  imageSrc?: string;
  userName?: string;
  userId?: string;
  linkStyles?: CSSProperties;
  size?: number;
  href?: string;
}

const UserAvatar = ({
  imageFile,
  imageSrc,
  linkStyles,
  userId,
  size,
  userName,
  sx,
  href,
  ...avatarProps
}: Props) => {
  const { t } = useTranslation();

  const avatarSx: AvatarProps['sx'] = {
    fontSize: '17px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    width: 38,
    height: 38,
    ...sx,
    ...(size ? { width: size, height: size } : {}),
  };

  const getImageFileSrc = () => {
    if (imageSrc) {
      return imageSrc;
    }
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
  };

  const getNameAcronym = (name: string) => {
    const [firstName, lastName] = name.split('-');
    if (lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return `${firstName[0]}`.toUpperCase();
  };

  const getStringAvatarProps = (): AvatarProps => {
    if (!userId || !userName) {
      return { sx: avatarSx, children: null };
    }
    const colorHash = new ColorHash();
    const baseColor = colorHash.hex(userId);
    const color = chroma(baseColor).darken(1.25).hex();
    const bgcolor = chroma(baseColor).brighten(2).hex();

    return {
      sx: { ...avatarSx, color, bgcolor },
      children: getNameAcronym(userName),
    };
  };

  const renderAvatar = () => {
    if (!imageFile && !imageSrc) {
      return <Avatar title={userName} {...getStringAvatarProps()} />;
    }
    return (
      <Avatar title={userName} sx={avatarSx} {...avatarProps}>
        <LazyLoadImage
          alt={t('images.labels.profilePicture')}
          src={getImageFileSrc()}
          borderRadius="50%"
          minWidth="100%"
          minHeight="100%"
        />
      </Avatar>
    );
  };

  if (href) {
    return (
      <Link to={href} sx={linkStyles}>
        {renderAvatar()}
      </Link>
    );
  }

  return renderAvatar();
};

export default UserAvatar;

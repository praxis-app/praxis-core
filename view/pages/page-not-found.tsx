import { useTranslation } from 'react-i18next';
import pageNotFoundGif from '../assets/images/404.gif';
import { Box } from '@mui/material';
import LazyLoadImage from '../components/images/lazy-load-image';
import { useAboveBreakpoint } from '../hooks/shared.hooks';

export const PageNotFound = () => {
  const isLarge = useAboveBreakpoint('md');
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      justifyContent="center"
      marginTop={isLarge ? 0 : '100px'}
    >
      <LazyLoadImage
        src={pageNotFoundGif}
        alt={t('errors.pageNotFound')}
        width="55%"
        display="block"
        margin="0 auto"
      />
    </Box>
  );
};

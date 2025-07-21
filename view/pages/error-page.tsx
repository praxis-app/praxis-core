import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import errorGif from '../assets/images/error.gif';
import LazyLoadImage from '../components/images/lazy-load-image';
import { useAboveBreakpoint } from '../hooks/shared.hooks';
import { Layout } from '../components/app/layout';

const ErrorPageContent = () => {
  const isLarge = useAboveBreakpoint('md');
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <LazyLoadImage
        src={errorGif}
        alt={t('errors.somethingWentWrong')}
        width={isLarge ? '40%' : '80%'}
        marginBottom={isLarge ? 0 : 15}
        borderRadius="9999px"
        alignSelf="center"
        display="block"
      />
    </Box>
  );
};

export const ErrorPage = () => (
  <Layout>
    <ErrorPageContent />
  </Layout>
);

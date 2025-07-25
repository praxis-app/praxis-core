import { TopNav } from '@/components/nav/top-nav';
import { NavigationPaths } from '@/constants/shared.constants';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const ServerRoles = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <TopNav
        header={t('navigation.labels.roles')}
        onBackClick={() => navigate(NavigationPaths.Settings)}
      />
    </>
  );
};

import { TopNav } from '@/components/nav/top-nav';
import { NavigationPaths } from '@/constants/shared.constants';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useAppStore } from '@/store/app.store';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export const ServerSettings = () => {
  const { setIsNavSheetOpen } = useAppStore();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const handleBackClick = () => {
    if (isDesktop) {
      navigate(NavigationPaths.Home);
      return;
    }
    setIsNavSheetOpen(true);
  };

  return (
    <>
      <TopNav
        header={t('navigation.headers.serverSettings')}
        onBackClick={handleBackClick}
        backBtnIcon={<MdClose className="size-6" />}
      />
    </>
  );
};

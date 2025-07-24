import { api } from '@/client/api-client';
import { InviteForm } from '@/components/invites/invite-form';
import { InvitesTable } from '@/components/invites/invites-table';
import { TopNav } from '@/components/nav/top-nav';
import { Card, CardContent } from '@/components/ui/card';
import { NavigationPaths } from '@/constants/shared.constants';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useAppStore } from '@/store/app.store';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const InvitesPage = () => {
  const { isLoggedIn } = useAppStore();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const { data: invitesData } = useQuery({
    queryKey: ['invites'],
    queryFn: api.getInvites,
    enabled: isLoggedIn,
  });

  // TODO: Remove when no longer needed for testing
  console.log(invitesData);

  return (
    <>
      <TopNav
        header={t('navigation.labels.invites')}
        onBackClick={() => navigate(NavigationPaths.Settings)}
      />

      <div className="flex h-full flex-col items-center justify-center gap-3.5 p-3 pt-4 md:p-16">
        <Card className="w-full max-w-md">
          <CardContent className="px-3 md:px-6">
            <InviteForm />
          </CardContent>
        </Card>

        {isDesktop && <InvitesTable />}
      </div>
    </>
  );
};

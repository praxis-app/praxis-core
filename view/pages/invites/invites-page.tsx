import { InviteForm } from '@/components/invites/invite-form';
import { TopNav } from '@/components/nav/top-nav';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NavigationPaths } from '@/constants/shared.constants';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const InvitesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

        <Card className="w-full max-w-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('invites.columnNames.code')}</TableHead>
                <TableHead>{t('invites.columnNames.expires')}</TableHead>
                <TableHead>{t('invites.columnNames.inviter')}</TableHead>
                <TableHead>{t('invites.columnNames.uses')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="pt-8 text-center">
                  {t('invites.prompts.noInvites')}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
};

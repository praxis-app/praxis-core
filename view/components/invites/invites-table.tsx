import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslation } from 'react-i18next';

export const InvitesTable = () => {
  const { t } = useTranslation();

  return (
    <Card className="w-full max-w-md">
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

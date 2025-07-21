// TODO: Add support for Knock and Restricted join rule options

import { GuestAccess, JoinRule, Visibility } from 'matrix-js-sdk';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '../../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Switch } from '../../ui/switch';
import { Textarea } from '../../ui/textarea';
import { RoomSettingsFormValues } from './use-room-settings-form';

interface Props {
  form: UseFormReturn<RoomSettingsFormValues>;
  handleSubmit: (values: RoomSettingsFormValues) => void;
  hasUnsupportedJoinRule: boolean;
}

export const RoomSettingsForm = ({
  form,
  handleSubmit,
  hasUnsupportedJoinRule,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 px-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('rooms.labels.name')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('rooms.placeholders.name')}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('rooms.descriptions.roomName')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('rooms.labels.topic')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('rooms.placeholders.topic')}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>{t('rooms.prompts.roomTopic')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {!hasUnsupportedJoinRule && (
          <FormField
            control={form.control}
            name="joinRule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('rooms.labels.access')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t('rooms.placeholders.access')}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={JoinRule.Invite}>
                      {t('rooms.options.inviteOnly')}
                    </SelectItem>
                    <SelectItem value={JoinRule.Public}>
                      {t('rooms.options.anyoneCanJoin')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  {t('rooms.descriptions.roomAccess')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('rooms.labels.discoverability')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t('rooms.placeholders.visibility')}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={Visibility.Private}>
                    {t('rooms.options.private')}
                  </SelectItem>
                  <SelectItem value={Visibility.Public}>
                    {t('rooms.options.public')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t('rooms.descriptions.discoverability')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guestAccess"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-6">
              <div className="space-y-0.5">
                <FormLabel className="pb-0.5">
                  {t('rooms.labels.guestAccess')}
                </FormLabel>
                <FormDescription>
                  {t('rooms.descriptions.guestAccess')}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === GuestAccess.CanJoin}
                  onCheckedChange={(checked) => {
                    field.onChange(
                      checked ? GuestAccess.CanJoin : GuestAccess.Forbidden,
                    );
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            className="w-22"
            type="submit"
          >
            {t('actions.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

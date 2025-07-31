import { api } from '@/client/api-client';
import { NavigationPaths } from '@/constants/shared.constants';
import { Channel, CreateChannelReq } from '@/types/channel.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as zod from 'zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

interface CreateChannelFormSubmitButtonProps {
  isSubmitting: boolean;
}

interface CreateChannelFormProps {
  submitButton: (props: CreateChannelFormSubmitButtonProps) => ReactNode;
  onSubmit?(): void;
}

const createChannelFormSchema = zod.object({
  name: zod.string(),
  description: zod.string(),
});

export const CreateChannelFormSubmitButton = ({
  isSubmitting,
}: CreateChannelFormSubmitButtonProps) => {
  const { t } = useTranslation();
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting
        ? t('channels.prompts.creatingChannel')
        : t('channels.actions.create')}
    </Button>
  );
};

export const CreateChannelForm = ({
  submitButton,
  onSubmit,
}: CreateChannelFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<zod.infer<typeof createChannelFormSchema>>({
    resolver: zodResolver(createChannelFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { mutate: createChannel, isPending } = useMutation({
    mutationFn: async (values: CreateChannelReq) => {
      const { channel } = await api.createChannel(values);

      queryClient.setQueryData<{ channels: Channel[] }>(
        ['channels'],
        (oldData) => {
          if (!oldData) {
            return { channels: [] };
          }
          return { channels: [...oldData.channels, channel] };
        },
      );

      onSubmit?.();

      navigate(`${NavigationPaths.Channels}/${channel.id}`);
    },
    onError(error: AxiosError) {
      const errorMessage =
        (error.response?.data as string) || t('errors.somethingWentWrong');
      toast(errorMessage);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((fv) => createChannel(fv))}
        className="space-y-4 pb-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('channels.form.name')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('channels.form.name')}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('channels.form.description')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('channels.form.description')}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitButton({ isSubmitting: isPending })}
      </form>
    </Form>
  );
};

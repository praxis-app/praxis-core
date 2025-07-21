// TODO: Add remaining layout and functionality - below is a WIP

import { PROPOSAL_ANSWER_LABELS } from '@/constants/proposal.constants';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { ProposalStartEvent } from '@/lib/events/proposal-start-event';
import { t } from '@/lib/shared.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { TimelineEvents } from 'matrix-js-sdk';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
import { Textarea } from '../ui/textarea';

const PROPOSAL_BODY_MAX = 6000;

interface ProposalFormSubmitButtonProps {
  isSubmitting: boolean;
}

interface CreateProposalFormProps {
  roomId: string;
  submitButton: (props: ProposalFormSubmitButtonProps) => ReactNode;
  onSuccess: () => void;
}

const createProposalFormSchema = zod.object({
  body: zod.string().max(PROPOSAL_BODY_MAX, {
    message: t('proposals.errors.longBody'),
  }),
});

export const ProposalFormSubmitButton = ({
  isSubmitting,
}: ProposalFormSubmitButtonProps) => {
  const { t } = useTranslation();
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting
        ? t('proposals.prompts.creatingProposal')
        : t('proposals.actions.create')}
    </Button>
  );
};

export const CreateProposalForm = ({
  roomId,
  submitButton,
  onSuccess,
}: CreateProposalFormProps) => {
  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const form = useForm<zod.infer<typeof createProposalFormSchema>>({
    resolver: zodResolver(createProposalFormSchema),
    defaultValues: {
      body: '',
    },
  });

  const onSubmit = async (
    values: zod.infer<typeof createProposalFormSchema>,
  ) => {
    if (!matrixClient || !values.body.trim()) {
      return;
    }

    const answers = Object.entries(PROPOSAL_ANSWER_LABELS).map(
      ([position, label]) => ({
        text: label,
        position,
      }),
    );
    const proposalStart = ProposalStartEvent.from(
      values.body.trim(),
      answers,
    ).serialize();

    try {
      await matrixClient.sendEvent(
        roomId,
        proposalStart.type as keyof TimelineEvents,
        proposalStart.content as TimelineEvents[keyof TimelineEvents],
      );

      form.reset();
      onSuccess();
    } catch (error) {
      toast(t('proposals.errors.errorCreatingProposal'), {
        description: t('prompts.tryAgain'),
      });
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('proposals.labels.body')}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={t('proposals.placeholders.body')}
                  className="w-full resize-none md:min-w-md"
                  rows={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitButton({ isSubmitting: form.formState.isSubmitting })}
      </form>
    </Form>
  );
};

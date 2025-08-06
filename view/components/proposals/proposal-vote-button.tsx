// TODO: Convert from Matrix-JS-SDK to standard web app setup

import {
  ANSWER_POSITION,
  PROPOSAL_ANSWER_LABELS,
  ProposalAnswerPosition,
} from '@/constants/proposal.constants';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { cn } from '@/lib/shared.utils';
import { ProposalAnswer, ProposalVote } from '@/types/proposal.types';
import { TimelineEvents } from 'matrix-js-sdk';
import { PollResponseEvent } from 'matrix-js-sdk/src/extensible_events_v1/PollResponseEvent';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface Props {
  answer: ProposalAnswer;
  myVote?: ProposalVote;
  roomId: string;
  proposalId: string;
  setVotes: Dispatch<SetStateAction<Record<string, ProposalVote>>>;
}

export const ProposalVoteButton = ({
  answer,
  myVote,
  roomId,
  proposalId,
  setVotes,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const currentUserId = matrixClient.getUserId();
  const isSelected = myVote?.answers.includes(answer.id);

  const position = answer[ANSWER_POSITION];
  const label = PROPOSAL_ANSWER_LABELS[position as ProposalAnswerPosition];

  const handleClick = async () => {
    if (!currentUserId || isLoading) {
      return;
    }
    setIsLoading(true);

    // Update state optimistically
    let prevVotes = {};
    setVotes((prev) => {
      prevVotes = prev;
      return {
        ...prev,
        [currentUserId]: {
          sender: currentUserId,
          answers: [answer.id],
          ts: Date.now(),
        },
      };
    });

    const response = PollResponseEvent.from(
      [answer.id],
      proposalId,
    ).serialize();

    try {
      await matrixClient.sendEvent(
        roomId,
        null,
        response.type as keyof TimelineEvents,
        response.content as TimelineEvents[keyof TimelineEvents],
      );
    } catch (error) {
      // Revert state if error occurs
      setVotes(prevVotes);

      toast(t('errors.somethingWentWrong'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn('flex-1', isSelected && '!bg-primary/15')}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

import { api } from '@/client/api-client';
import { VOTE_TYPE } from '@/constants/proposal.constants';
import { cn } from '@/lib/shared.utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface Props {
  proposalId: string;
  myVoteId?: string;
  myVoteType?: (typeof VOTE_TYPE)[number];
  onVoted?: (params: {
    voteId: string;
    voteType: (typeof VOTE_TYPE)[number];
  }) => void;
}

export const ProposalVoteButtons = ({
  proposalId,
  myVoteId,
  myVoteType,
  onVoted,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const castVote = async (voteType: (typeof VOTE_TYPE)[number]) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (!myVoteId) {
        const { vote } = await api.createVote(proposalId, { voteType });
        onVoted?.({ voteId: vote.id, voteType });
      } else if (myVoteType !== voteType) {
        await api.updateVote(proposalId, myVoteId, { voteType });
        onVoted?.({ voteId: myVoteId, voteType });
      }
    } catch (error) {
      toast(t('errors.somethingWentWrong'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-wrap gap-2">
      {VOTE_TYPE.map((vote) => (
        <Button
          key={vote}
          variant="outline"
          size="sm"
          className={cn('flex-1', myVoteType === vote && '!bg-primary/15')}
          onClick={() => castVote(vote)}
          disabled={isLoading}
        >
          {vote}
        </Button>
      ))}
    </div>
  );
};

import { useMatrixClient } from '@/hooks/use-matrix-client';
import { timeAgo } from '@/lib/time.utils';
import { ProposalAnswer, ProposalVote } from '@/types/proposal.types';
import {
  M_POLL_RESPONSE,
  M_POLL_START,
  MatrixEvent,
  PollResponseSubtype,
  PollStartSubtype,
  Room,
} from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaClipboard } from 'react-icons/fa';
import FormattedText from '../shared/formatted-text';
import { Badge } from '../ui/badge';
import { Card, CardAction } from '../ui/card';
import { Separator } from '../ui/separator';
import { UserAvatar } from '../users/user-avatar';
import { ProposalVoteButton } from './proposal-vote-button';

interface InlineProposalProps {
  proposal: MatrixEvent;
  room: Room;
}

const collectUserVotes = (
  userResponses: ProposalVote[],
  userId?: string,
  selected?: string,
) => {
  const userVotes: Record<string, ProposalVote> = {};

  for (const response of userResponses) {
    const otherResponse = userVotes[response.sender];
    if (!otherResponse || otherResponse.ts < response.ts) {
      userVotes[response.sender] = response;
    }
  }

  if (selected && userId) {
    userVotes[userId] = {
      sender: userId,
      ts: Date.now(),
      answers: [selected],
    };
  }

  return userVotes;
};

export const InlineProposal = ({ proposal, room }: InlineProposalProps) => {
  const [votes, setVotes] = useState<Record<string, ProposalVote>>({});

  const matrixClient = useMatrixClient();
  const currentUserId = matrixClient.getUserId();
  const myVote = currentUserId ? votes[currentUserId] : undefined;

  const { [M_POLL_START.name]: pollStart } = proposal.getContent();
  const { answers } = pollStart as PollStartSubtype;
  const { body } = pollStart.question;

  const userId = proposal.getSender() ?? '';
  const member = room?.getMember(userId);
  const name = member?.name ?? userId;

  const createdAt = proposal.getDate()?.toString() ?? '';
  const formattedDate = timeAgo(createdAt);

  const { t } = useTranslation();

  useEffect(() => {
    if (Object.keys(votes).length) {
      return;
    }

    const getResponses = async () => {
      const poll = room.polls.get(proposal.getId()!);
      const responses = await poll?.getResponses();
      const relations = responses?.getRelations();
      if (!relations) {
        return;
      }

      const userVotes = relations.reduce<ProposalVote[]>((result, relation) => {
        // Filter out redacted relations
        if (relation.isRedacted()) {
          return result;
        }
        const { [M_POLL_RESPONSE.name]: pollResponse } = relation.getContent();
        const { answers } = pollResponse as PollResponseSubtype;

        return result.concat({
          sender: relation.getSender()!,
          ts: relation.getTs(),
          answers,
        });
      }, []);

      const collectedVotes = collectUserVotes(userVotes);
      setVotes(collectedVotes);
    };

    getResponses();
  }, [proposal, room, votes]);

  if (!body) {
    return null;
  }

  return (
    <div className="flex gap-4 pt-4">
      <UserAvatar name={name} userId={userId} className="mt-0.5" />

      <div className="w-full">
        <div className="flex items-center gap-1.5 pb-1">
          <div className="font-medium">{name}</div>
          <div className="text-muted-foreground text-sm">{formattedDate}</div>
        </div>

        <Card className="before:border-l-border relative w-full gap-3.5 rounded-md px-3 py-3.5 before:absolute before:top-0 before:bottom-0 before:left-0 before:mt-[-0.025rem] before:mb-[-0.025rem] before:w-3 before:rounded-l-md before:border-l-3">
          <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
            <FaClipboard className="mb-0.5" />
            {t('proposals.labels.consensusProposal')}
          </div>

          <FormattedText text={body} className="pt-1 pb-2" />

          <CardAction className="flex flex-wrap gap-2">
            {answers.map((answer) => (
              <ProposalVoteButton
                key={answer.id}
                answer={answer as ProposalAnswer}
                myVote={myVote}
                proposalId={proposal.getId()!}
                roomId={room.roomId}
                setVotes={setVotes}
              />
            ))}
          </CardAction>

          <Separator className="my-1" />

          {/* TODO: Replace with actual proposal data */}
          <div className="flex justify-between">
            <div className="text-muted-foreground flex gap-3.5 text-sm">
              <div>10/12 voted</div>
              <div>Ends in 2 days</div>
            </div>
            <Badge variant="outline">{t('proposals.labels.active')}</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
};

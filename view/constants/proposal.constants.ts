import { t } from '@/lib/shared.utils';

export enum ProposalAnswerPosition {
  Agree = 'agree',
  Disagree = 'disagree',
  Abstain = 'abstain',
  Block = 'block',
}

export const PROPOSAL_ANSWER_LABELS: Record<ProposalAnswerPosition, string> = {
  [ProposalAnswerPosition.Agree]: t('proposals.actions.agree'),
  [ProposalAnswerPosition.Disagree]: t('proposals.actions.disagree'),
  [ProposalAnswerPosition.Abstain]: t('proposals.actions.abstain'),
  [ProposalAnswerPosition.Block]: t('proposals.actions.block'),
};

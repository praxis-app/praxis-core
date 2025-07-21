import { t } from '@/lib/shared.utils';

export const PROPOSAL_KIND = 'com.praxis-app.proposal.kind';
export const ANSWER_POSITION = 'com.praxis-app.proposal.answer.position';

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

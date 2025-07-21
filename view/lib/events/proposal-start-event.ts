// Ref: https://github.com/matrix-org/matrix-js-sdk/blob/develop/src/extensible_events_v1/PollStartEvent.ts

import { PROPOSAL_KIND } from '@/constants/proposal.constants';
import { ProposalAnswer } from '@/types/proposal.types';
import {
  IPartialEvent,
  KnownPollKind,
  M_POLL_KIND_DISCLOSED,
  M_POLL_KIND_UNDISCLOSED,
  M_POLL_START,
  M_TEXT,
  PollStartEventContent,
  PollStartSubtype,
} from 'matrix-js-sdk';
import { NamespacedValue } from 'matrix-js-sdk/lib/NamespacedValue';
import { InvalidEventError } from 'matrix-js-sdk/src/extensible_events_v1/InvalidEventError';
import { MessageEvent } from 'matrix-js-sdk/src/extensible_events_v1/MessageEvent';
import { PollStartEvent } from 'matrix-js-sdk/src/extensible_events_v1/PollStartEvent';
import { ProposalAnswerSubevent } from './proposal-answer-subevent';

enum MatrixSDKEventTypes {
  PollAnswer = 'org.matrix.sdk.poll.answer',
  PollQuestion = 'org.matrix.sdk.poll.question',
}

export class ProposalStartEvent extends PollStartEvent {
  public readonly answers: ProposalAnswerSubevent[];
  public readonly kind: KnownPollKind;
  public readonly maxSelections: number;
  public readonly question: MessageEvent;
  public readonly rawKind: string;

  public constructor(wireFormat: IPartialEvent<PollStartEventContent>) {
    super(wireFormat);

    const poll = M_POLL_START.findIn<PollStartSubtype>(this.wireContent);

    if (!poll?.question) {
      throw new InvalidEventError('A question is required');
    }

    this.question = new MessageEvent({
      type: MatrixSDKEventTypes.PollQuestion,
      content: poll.question,
    });

    this.rawKind = poll.kind;
    if (M_POLL_KIND_DISCLOSED.matches(this.rawKind)) {
      this.kind = M_POLL_KIND_DISCLOSED;
    } else {
      this.kind = M_POLL_KIND_UNDISCLOSED; // default & assumed value
    }

    this.maxSelections =
      Number.isFinite(poll.max_selections) && poll.max_selections! > 0
        ? poll.max_selections!
        : 1;

    if (!Array.isArray(poll.answers)) {
      throw new InvalidEventError('Proposal answers must be an array');
    }
    const answers = poll.answers.slice(0, 20).map(
      (a) =>
        new ProposalAnswerSubevent({
          type: MatrixSDKEventTypes.PollAnswer,
          content: a as ProposalAnswer,
        }),
    );
    if (answers.length <= 0) {
      throw new InvalidEventError('No answers available');
    }
    this.answers = answers;
  }

  public static from(
    question: string,
    answers: { text: string; position: string }[] | string[],
    kind: KnownPollKind | string = PROPOSAL_KIND,
    maxSelections = 1,
  ): ProposalStartEvent {
    const processedAnswers = answers.map((a) => ({
      id: this.getAnswerId(),
      [M_TEXT.name]: typeof a === 'string' ? a : a.text,
      position: typeof a === 'string' ? undefined : a.position,
    }));

    return new ProposalStartEvent({
      type: M_POLL_START.name,
      content: {
        [M_TEXT.name]: question,
        [M_POLL_START.name]: {
          question: { [M_TEXT.name]: question },
          kind: kind instanceof NamespacedValue ? kind.name : kind,
          max_selections: maxSelections,
          answers: processedAnswers,
        },
      },
    });
  }

  private static getAnswerId = () => {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return [...Array(16)]
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join('');
  };
}

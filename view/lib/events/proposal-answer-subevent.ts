// Ref: https://github.com/matrix-org/matrix-js-sdk/blob/develop/src/extensible_events_v1/PollStartEvent.ts

import { ANSWER_POSITION } from '@/constants/proposal.constants';
import { ProposalAnswer } from '@/types/proposal.types';
import { IPartialEvent } from 'matrix-js-sdk';
import { InvalidEventError } from 'matrix-js-sdk/src/extensible_events_v1/InvalidEventError';
import { PollAnswerSubevent } from 'matrix-js-sdk/src/extensible_events_v1/PollStartEvent';

export class ProposalAnswerSubevent extends PollAnswerSubevent {
  public readonly id: string;
  public readonly position: string;

  public constructor(wireFormat: IPartialEvent<ProposalAnswer>) {
    super(wireFormat);

    const id = wireFormat.content.id;
    if (!id || typeof id !== 'string') {
      throw new InvalidEventError('Answer ID must be a non-empty string');
    }
    this.id = id;

    const position = wireFormat.content.position;
    if (!position || typeof position !== 'string') {
      throw new InvalidEventError('Answer position must be a non-empty string');
    }
    this.position = position;
  }

  public serialize(): IPartialEvent<object> {
    return {
      type: 'org.matrix.sdk.poll.answer',
      content: {
        id: this.id,
        [ANSWER_POSITION]: this.position,
        ...this.serializeMMessageOnly(),
      },
    };
  }
}

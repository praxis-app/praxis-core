import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DECISION_MAKING_MODEL } from '../../proposals/proposal.constants';
import { DecisionMakingModel } from '../../proposals/proposal.types';
import { VotingTimeLimit } from '../../votes/vote.constants';

@Entity()
export class ServerConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: DECISION_MAKING_MODEL, default: 'consensus' })
  decisionMakingModel: DecisionMakingModel;

  @Column({ default: 2 })
  standAsidesLimit: number;

  @Column({ default: 2 })
  reservationsLimit: number;

  @Column({ default: 51 })
  ratificationThreshold: number;

  @Column({ default: 51 })
  verificationThreshold: number;

  @Column({ default: VotingTimeLimit.Unlimited })
  votingTimeLimit: number;

  /**
   * The base URL for the Discord bot's API endpoints
   */
  @Column({ type: 'varchar', nullable: true })
  botApiUrl: string | null;

  /**
   * The client ID for the Discord bot
   */
  @Column({ type: 'varchar', nullable: true })
  botClientId: string | null;

  /**
   * API key used by the bot to authenticate its calls to the Praxis instance (self)
   */
  @Column({ type: 'varchar', nullable: true })
  botApiKey: string | null;

  /**
   * API key used by the Praxis instance (self) to authenticate its calls to the bot
   */
  @Column({ type: 'varchar', nullable: true })
  apiKey: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

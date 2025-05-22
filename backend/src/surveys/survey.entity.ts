import { Question } from 'questions/question.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vote } from 'votes/vote.entity';

export enum SurveyStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

@Entity('surveys')
export class Survey {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  city!: string;

  @Column({
    type: 'enum',
    enum: SurveyStatus,
    default: SurveyStatus.ACTIVE,
  })
  status!: SurveyStatus;

  @Column()
  questionId!: string;

  @OneToOne(() => Question, (question) => question.survey)
  question!: Question;

  @OneToMany(() => Vote, (vote) => vote.survey)
  votes!: Vote[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}

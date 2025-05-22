import { BusinessEntity } from 'business/business.entity';
import { Survey } from 'surveys/survey.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'user/users.entity';

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  surveyId!: string;

  @Column()
  userId!: string;

  @Column()
  businessId!: string;

  @ManyToOne(() => Survey, (survey) => survey.votes)
  survey!: Survey;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => BusinessEntity)
  business!: BusinessEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}

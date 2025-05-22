import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Question } from '../question.entity';
import { BusinessEntity } from '../../business/business.entity';

@Entity('question_businesses')
export class QuestionBusiness {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  questionId!: string;

  @Column()
  businessId!: string;

  @ManyToOne(() => Question, question => question.questionBusinesses)
  question!: Question;

  @ManyToOne(() => BusinessEntity)
  business!: BusinessEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
} 
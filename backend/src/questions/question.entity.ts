import { BusinessEntity } from 'business/business.entity';
import { Survey } from 'surveys/survey.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { QuestionBusiness } from './entities/question-business.entity';

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    question!: string;

    @Column()
    city!: string;

    @Column('text', { nullable: true })
    answer!: string;

    @OneToMany(() => QuestionBusiness, questionBusiness => questionBusiness.question)
    questionBusinesses!: QuestionBusiness[];

    @Column({ nullable: true })
    businessId!: string;

    @ManyToOne(() => BusinessEntity, (business: BusinessEntity) => business.questions)
    business?: BusinessEntity;

    @OneToOne(() => Survey, survey => survey.question)
    survey!: Survey;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
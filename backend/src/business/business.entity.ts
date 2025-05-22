import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('businesses')
export class BusinessEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name?: string; //  name

  @Column({ type: 'varchar' })
  city?: string;

  @Column({ nullable: true, type: 'varchar' })
  description?: string;

  @Column({ nullable: true, type: 'varchar' })
  full_address?: string;

  @Column({ nullable: true, type: 'varchar' })
  street_address?: string;

  @Column({ nullable: true, type: 'varchar' })
  category?: string;

  @Column({ nullable: true, type: 'varchar' })
  hours?: string;

  @Column({ nullable: true, type: 'varchar' })
  website?: string;

  @Column({ nullable: true, type: 'varchar' })
  closed_status?: string;

  @Column({ nullable: true, type: 'varchar' })
  google_maps_url?: string;

  @Column({ nullable: true })
  place_id?: string;

  @Column('text', { array: true, nullable: true })
  photos?: string[];

  @Column({ nullable: true })
  greater_city_area?: string;

  @Column({ type: 'float', nullable: true })
  rating?: number;

  @Column({ nullable: true })
  review_count?: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
    questions: any;
}

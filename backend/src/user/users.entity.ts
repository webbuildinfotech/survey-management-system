import { RoleEntity } from 'roles/roles.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name?: string; //  name

  @Column({ nullable: true, type: 'varchar' })
  mobile?: string; //  phone number

  @Column({ type: 'varchar' }) // Ensure email is unique
  email!: string; //  email address

  @Column()
  password!: string;

  @Column({ type: 'varchar' })
  city!: string; //  city

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;

  @Column({ default: false })
  isDeleted!: boolean;

  @Column({ nullable: true, type: 'varchar' })
  otp?: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  otpExpires?: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}

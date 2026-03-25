import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Workspace } from '../../workspace/entities/workspace.entity';

export enum PropertyType {
  HOTEL = 'hotel',
  RESORT = 'resort',
  HOSTEL = 'hostel',
  GLAMPING = 'glamping',
  APARTMENT = 'apartment',
  GUESTHOUSE = 'guesthouse',
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'enum', enum: PropertyType, default: PropertyType.HOTEL })
  type: PropertyType;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  contacts: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  settings: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column()
  workspaceId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

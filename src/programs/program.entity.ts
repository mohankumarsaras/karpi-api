import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ProgramType {
  ONLINE_LIVE = 'Online Live Classes',
  OFFLINE_COACHING = 'Offline Technical Coaching',
  WEBINAR = 'Webinars',
  COLLEGE_SEMINAR = 'Technical Seminars',
  HANDS_ON_WORKSHOP = 'Hands-on Workshops',
  CAREER_GUIDANCE = 'Career Guidance'
}

@Entity('programs')
export class Program {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'enum', enum: ProgramType })
  type: ProgramType;

  @Column({ type: 'text' })
  shortDescription: string;

  @Column({ type: 'text' })
  detailedDescription: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column('simple-json', { nullable: true })
  keyHighlights: string[];

  @Column('simple-json', { nullable: true })
  targetAudience: string[];

  @Column('simple-json', { nullable: true })
  learningOutcomes: string[];

  @Column({ default: 'Flexible' })
  deliveryFormat: string; // e.g. "Interactive Virtual Sessions", "In-person College Labs"

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


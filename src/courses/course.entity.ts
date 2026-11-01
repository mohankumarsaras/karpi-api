import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

export enum SkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  ALL_LEVELS = 'All Levels'
}

export enum LearningMode {
  ONLINE = 'Online Live',
  OFFLINE = 'Offline Classroom',
  HYBRID = 'Hybrid'
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  shortDescription: string;

  @Column({ type: 'text' })
  overview: string;

  @Column({ type: 'enum', enum: SkillLevel, default: SkillLevel.BEGINNER })
  level: SkillLevel;

  @Column({ type: 'enum', enum: LearningMode, default: LearningMode.HYBRID })
  mode: LearningMode;

  @Column()
  duration: string; // e.g. "8 Weeks", "40 Hours"

  @Column({ nullable: true })
  schedule: string; // e.g. "Weekend & Weekday Batches"

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column('simple-json', { nullable: true })
  learningObjectives: string[];

  @Column('simple-json', { nullable: true })
  skillsCovered: string[];

  @Column('simple-json', { nullable: true })
  curriculum: { module: string; topics: string[]; handsOn: string }[];

  @Column('simple-json', { nullable: true })
  prerequisites: string[];

  @Column('simple-json', { nullable: true })
  whoShouldAttend: string[];

  @Column('simple-json', { nullable: true })
  practicalActivities: string[];

  @Column({ default: true })
  isFeatured: boolean;

  @Column({ default: true })
  isPublished: boolean;

  @ManyToOne(() => Category, (category) => category.courses, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


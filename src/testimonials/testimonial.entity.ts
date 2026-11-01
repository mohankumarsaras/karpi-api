import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentName: string;

  @Column({ nullable: true })
  collegeOrRole: string; // e.g. "BE CS Graduate, Batch 2024"

  @Column({ nullable: true })
  currentCompany: string; // e.g. "Junior Cloud Engineer @ CloudTech"

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'text' })
  quote: string;

  @Column({ nullable: true })
  courseTaken: string; // e.g. "Full-Stack Web Development"

  @Column({ default: 5 })
  rating: number;

  @Column({ default: true })
  isFeatured: boolean;

  @CreateDateColumn()
  createdAt: Date;
}


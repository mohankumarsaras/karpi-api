import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum GalleryCategory {
  SEMINARS = 'Seminars',
  WORKSHOPS = 'Workshops',
  TRAINING = 'Training Sessions',
  STUDENTS = 'Student Participation',
  CAMPUS = 'Campus Visits',
  CERTIFICATIONS = 'Certifications'
}

@Entity('gallery_items')
export class GalleryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: GalleryCategory, default: GalleryCategory.WORKSHOPS })
  category: GalleryCategory;

  @Column()
  imageUrl: string;

  @Column({ nullable: true, type: 'text' })
  caption: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'date', nullable: true })
  eventDate: Date;

  @Column({ default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;
}


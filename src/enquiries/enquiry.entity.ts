import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EnquiryStatus {
  PENDING = 'Pending',
  CONTACTED = 'Contacted',
  RESOLVED = 'Resolved',
  ARCHIVED = 'Archived'
}

@Entity('enquiries')
export class Enquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  collegeOrInstitution: string;

  @Column({ nullable: true })
  interestedCourse: string;

  @Column({ default: 'Online Live' })
  preferredLearningMode: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'enum', enum: EnquiryStatus, default: EnquiryStatus.PENDING })
  status: EnquiryStatus;

  @Column({ nullable: true, type: 'text' })
  adminNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


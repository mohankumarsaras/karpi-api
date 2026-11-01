import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('partner_reviews')
export class PartnerReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  partnerName: string;

  @Column({ nullable: true, length: 500 })
  partnerLogo?: string;

  @Column()
  reviewerName: string;

  @Column()
  reviewerDesignation: string;

  @Column({ type: 'text' })
  reviewContent: string;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ default: 0 })
  displayOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EventType {
  WEBINAR = 'Webinar',
  SEMINAR = 'Seminar',
  WORKSHOP = 'Workshop',
  BOOTCAMP = 'Bootcamp'
}

export enum EventMode {
  ONLINE = 'Online',
  OFFLINE = 'Offline',
  HYBRID = 'Hybrid'
}

export enum EventStatus {
  UPCOMING = 'Upcoming',
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed'
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'enum', enum: EventType })
  type: EventType;

  @Column({ type: 'enum', enum: EventMode, default: EventMode.ONLINE })
  mode: EventMode;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.UPCOMING })
  status: EventStatus;

  @Column({ type: 'datetime' })
  eventDate: Date;

  @Column({ nullable: true })
  duration: string; // e.g. "2 Hours", "2 Days"

  @Column({ nullable: true })
  locationOrPlatform: string; // e.g. "Google Meet / Zoom" or "Auditorium Hall, City Campus"

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  speakerName: string;

  @Column({ nullable: true })
  speakerRole: string;

  @Column({ nullable: true })
  speakerOrg: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column({ default: 'Open' })
  registrationStatus: string; // 'Open', 'Filling Fast', 'Closed', 'Completed'

  @Column({ nullable: true })
  registrationLink: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


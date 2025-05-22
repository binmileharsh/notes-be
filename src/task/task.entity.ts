import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('Task')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taskId: string;

  @Column()
  badge: string;

  @Column('text', { name: 'Description', nullable: true })
  description: string;

  @Column({ default: 'In Progress' })
  status: string;

  @Column({ default: 'High' })
  priority: string;
}

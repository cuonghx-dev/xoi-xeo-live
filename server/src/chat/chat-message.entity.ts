import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  username: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}

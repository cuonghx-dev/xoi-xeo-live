import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

const TZ = 'Asia/Ho_Chi_Minh';

function getTodayStart(): Date {
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  return new Date(`${dateStr}T00:00:00+07:00`);
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private repo: Repository<ChatMessage>,
  ) {}

  async getHistory(): Promise<ChatMessage[]> {
    return this.repo.find({
      where: { createdAt: MoreThanOrEqual(getTodayStart()) },
      order: { createdAt: 'ASC' },
      take: 200,
    });
  }

  async saveMessage(
    userId: string,
    username: string,
    content: string,
  ): Promise<ChatMessage> {
    const msg = this.repo.create({ userId, username, content });
    return this.repo.save(msg);
  }

  @Cron('0 0 * * *', { timeZone: TZ })
  async purgeOldMessages(): Promise<void> {
    await this.repo.delete({ createdAt: LessThan(getTodayStart()) });
  }
}

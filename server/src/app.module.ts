import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ChatMessage } from './chat/chat-message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [ChatMessage],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    ChatModule,
  ],
})
export class AppModule {}

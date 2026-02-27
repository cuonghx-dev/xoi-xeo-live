import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token: string = client.handshake.auth?.token;
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const payload = this.jwtService.verify<{
        sub: string;
        displayName: string;
      }>(token, { secret: process.env.JWT_SECRET });
      client.data.user = { userId: payload.sub, username: payload.displayName };
    } catch {
      client.disconnect();
      return;
    }
    const history = await this.chatService.getHistory();
    client.emit('history', history);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, content: string): Promise<void> {
    if (!client.data.user) return;
    if (typeof content !== 'string') return;
    const trimmed = content.trim();
    if (!trimmed || trimmed.length > 500) return;

    const { userId, username } = client.data.user as {
      userId: string;
      username: string;
    };
    const saved = await this.chatService.saveMessage(userId, username, trimmed);
    client.broadcast.emit('message', saved);
    client.emit('message', saved);
  }
}

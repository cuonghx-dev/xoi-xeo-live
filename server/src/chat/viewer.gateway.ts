import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/viewer', cors: { origin: '*' } })
export class ViewerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private viewers = new Set<string>();

  handleConnection(client: Socket) {
    this.viewers.add(client.id);
    this.server.emit('viewerCount', this.viewers.size);
  }

  handleDisconnect(client: Socket) {
    this.viewers.delete(client.id);
    this.server.emit('viewerCount', this.viewers.size);
  }
}

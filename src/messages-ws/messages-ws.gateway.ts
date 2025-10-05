import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({
  cors: true,
})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  


   @WebSocketServer() wss: Server;

  constructor(
      private readonly messagesWsService: MessagesWsService,
      private readonly jwtService: JwtService
    ) {}


  async handleConnection(client: Socket, ...args: any[]) {
    
    const token = client.handshake.headers.authentication as string;
    let payload : JwtPayload;
    if (!token) {
      client.disconnect();
      return;
    }
    try {
     payload = this.jwtService.verify<JwtPayload>(token, { secret: process.env.JWT_SECRET });
    await this.messagesWsService.addClient(client, payload.id);
    } catch (error) {
      console.log('Invalid token', error);
      client.disconnect();
      return;
    }
    

    
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients() );
  }


  handleDisconnect(client: Socket) {
 
    this.messagesWsService.removeClient(client.id);   
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients() );

  }

  @SubscribeMessage('message-from-client')
    handleMessage(client: Socket, payload:NewMessageDto) {
      
      

      this.wss.emit('message-from-server', {fullName: this.messagesWsService.getUserBySocketId(client.id), message: payload.message} );
      
    }
  
}

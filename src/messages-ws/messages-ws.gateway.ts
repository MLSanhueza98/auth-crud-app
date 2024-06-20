import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message-fto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/strategies/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection( client: Socket ) {
    
    const token = client.handshake.headers.auth as string
    let payload: JwtPayload
    try {
      payload = this.jwtService.verify(token)
      await this.messagesWsService.registerClient( client, payload.id )
    } catch (error) {
      client.disconnect()
      return
    }
    // console.log({ payload })

    // console.log( 'Client connected', client.id )
    // console.log({ conectados: this.messagesWsService.getConnectedClients() })
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients() )
  }

  handleDisconnect( client: Socket ) {
    // console.log( 'Client has disconnected', client.id )
    this.messagesWsService.removeClient( client.id )
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients() )
  }

  @SubscribeMessage('message-from-client')
  handleMessagrFromClient( client: Socket, payload: NewMessageDto ) {
    
    // Emitir unicamente al cliente
    client.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName( client.id ),
      message: payload.message || 'no-message'
    })


    // Emitir a todos menos al cliente
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'mini boo',
    //   message: payload.message || 'no-message'
    // })
  }



}

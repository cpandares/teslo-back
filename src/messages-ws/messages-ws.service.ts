import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';


interface ConnectedClients {
    [id:string]: {
        socket: Socket;
        user?: User;
    },

}

@Injectable()
export class MessagesWsService {

    constructor( 
        @InjectRepository(User)
        private readonly userRepository: Repository<User> 
    ){

    }

    private connectedClient: ConnectedClients = {

    }


    public async addClient(client: Socket, id: string) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            client.disconnect();
            return;
        }
        if(user.isActive === false) {
            return new Error('User is not active');
        }
        this.checkUserConnection(user);
        this.connectedClient[client.id] = {
            socket: client,
            user,
        };
    }

    public removeClient(clientId: string) {
        delete this.connectedClient[clientId];
    }

    public getConnectedClients():string[] {
        return Object.keys(this.connectedClient);
    }

    public getUserBySocketId(socketId: string) {
        return  this.connectedClient[socketId].user?.fullName;
    }

    private checkUserConnection( user:User ){
        for (const clientId of Object.keys(this.connectedClient)) {
            const connectedClient = this.connectedClient[clientId];
            if (connectedClient.user?.id === user.id) {
                connectedClient.socket.disconnect();
                delete this.connectedClient[clientId];
            }
        }
        return null;
    }

}

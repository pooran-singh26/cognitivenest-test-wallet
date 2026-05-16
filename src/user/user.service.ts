import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './dto/create-user-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User?.name) private readonly user: Model<User>) {}

  async createUser(user: User) {
    return this.user.create(user);
  }

  async addMoney(userId: string, userData: User) {

    if(!userData.balance) {
      throw new BadRequestException('Amount is required');
    }

    if(userData.balance <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const existingUser = await this.user.findOne({ _id: userId });

    if(!existingUser) {
      throw new BadRequestException('User not found');
    }

    existingUser.balance += userData.balance;

    return existingUser.save();
  }

  async transferMoney(senderId: string, receiverId: string, amount: number) {
    
    if(!amount) {
      throw new BadRequestException('Amount is required');
    }
    
    if(amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }
    
    const sender = await this.user.findOne({ _id: senderId });
    const receiver = await this.user.findOne({ _id: receiverId });
    
    if(!sender || !receiver) {
      throw new BadRequestException('Sender or receiver not found');
    }
    
    if(sender.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    sender.balance -= amount;
    receiver.balance += amount;

    return await Promise.all([sender.save(), receiver.save()]);
  }
}

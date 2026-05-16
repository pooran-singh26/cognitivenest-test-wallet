import { Body, Controller, Param, Post } from '@nestjs/common';
import { User } from './dto/create-user-dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    async createuser(@Body() user: User) {
        await this.userService.createUser(user);
        return { message: 'User created successfully' };
    }

    @Post(":userId/addmoney")
    async addMoney(@Param('userId') userId: string, @Body() userData: User) {
        await this.userService.addMoney(userId, userData);
        return { message: 'Money added successfully' };
    }

    @Post(":senderId/transfer/:receiverId")
    async transferMoney(@Param('senderId') senderId: string, @Param('receiverId') receiverId: string, @Body() { amount }: { amount: number } ) {
        await this.userService.transferMoney(senderId, receiverId, amount);
        return { message: 'Money transferred successfully' };
    }

}
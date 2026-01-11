import { Controller, Post, Body } from '@nestjs/common';
import { CreateAccountService } from './create-account/create-account.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly createAccountService: CreateAccountService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.createAccountService.execute(createUserDto);
    }
}

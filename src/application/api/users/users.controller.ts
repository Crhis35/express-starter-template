import { validationMiddleware } from '@/config/middlewares/validation.middleware';
import { Body, Controller, Get, HttpCode, Post, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CreateUserInput } from './dto/create-user.dto';

@Controller()
export class UsersController {
  @Get('/users')
  @OpenAPI({ summary: 'Return a list of users' })
  async getUsers() {
    return { data: [], message: 'findAll' };
  }

  @Post('/users')
  @HttpCode(201)
  @UseBefore(validationMiddleware(CreateUserInput, 'body'))
  async createUser(@Body() input: CreateUserInput) {
    return input;
  }
}

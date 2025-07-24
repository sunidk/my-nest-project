import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';


@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/user')
  async getUser(@Query('id') id: number): Promise<any> {
    try {
      const user = await this.userService.getUserById(id);

      if (!user) {
        return {
          status: 404,
          message: 'User not found',
        };
      }

      return {
        status: 200,
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/user')
  async createUser(@Body() CreateUserDto: CreateUserDto): Promise<any> {
    try {
      const { name, email } = CreateUserDto;

      const oldUser = await this.userService.getUserByEmail(email);

      if (oldUser) {
        return {
          status: 409,
          message: 'User already Exists',
        };
      }

      const createdUser = await this.userService.createUser(name, email);

      return {
        status: 200,
        message: 'User created Successfully',
        data: createdUser,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('/user/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() UpdateUserDto: UpdateUserDto,
  ): Promise<any> {
    const { name, email } = UpdateUserDto;

    const user = await this.userService.getUserById(id);

    if (!user) {
      return {
        status: 404,
        message: 'User not found',
      };
    }

    const updatedUser = await this.userService.updateUser(id, name, email);

    return {
      status: 200,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  @Delete('/user/:id')
  async deleteUser(@Param('id') id: number): Promise<any> {
    try {
      const user = await this.userService.getUserById(id);

      if (!user) {
        return {
          status: 404,
          message: 'User not found',
        };
      }

      await this.userService.deleteUser(id);

      return {
        status: 200,
        message: 'User deleted Successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}

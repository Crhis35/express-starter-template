import { IsString } from 'class-validator';

export class CreateUserInput {
  @IsString()
  name: string;
}

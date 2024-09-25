import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsStrongPassword()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty()
  @IsStrongPassword()
  @IsNotEmpty()
  confirmPassword: string;
}

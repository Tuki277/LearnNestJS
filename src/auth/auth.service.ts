import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/users/schema/users.schema';
import * as bcrypt from "bcrypt";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor (
    @InjectModel(User.name) 
    private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}
  
  async validatePassword (candidatePassword: string, users: UserDocument) {

    const user: UserDocument = await this.userModel.findOne({ UserName: users.UserName });

    if (!user) {
      return false;
    }
    const isValid = await bcrypt.compare(candidatePassword, user.Password);

    if (!isValid) {
      return false;
    }

    return true;
  }

  async decodeToken (token: string) {
    try {
      const decode = this.jwtService.verify(token);
      return decode;
    } catch (error) {
      return null
    }
  }
}

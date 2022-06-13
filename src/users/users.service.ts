import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DocumentDefinition, FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { User, UserDocument } from "./schema/users.schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor (@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find({});
  }

  async createUsers(input: DocumentDefinition<UserDocument>): Promise<User> {
    try {
      return await this.userModel.create(input);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteUsers (id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id);
  }

  async filterQuery(query: FilterQuery<UserDocument>, options: QueryOptions = {lean: true}) {
    return this.userModel.findOne(query, {}, options);
  }

  async updateUser (query: FilterQuery<UserDocument>, update: UpdateQuery<UserDocument>, options: QueryOptions) {
    return this.userModel.findOneAndUpdate(query, update, options);
  }

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
}
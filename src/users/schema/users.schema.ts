import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  FullName: string

  @Prop({ required: true })
  UserName: string

  @Prop({ required: true })
  Age: number

  @Prop({ required: true })
  Email: string

  @Prop({ required: true })
  Password: string

  @Prop({ required: true })
  PhoneNumber: string

  @Prop({ default: null })
  AccessToken: string

  @Prop({ default: 1 })
  Role: number // 1: user, 2: admin
}

export const UserSchema = SchemaFactory.createForClass(User);
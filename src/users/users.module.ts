import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { jwtConstants } from "./contants";
import { User, UserSchema } from "./schema/users.schema";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { UsersController } from "./users.controller";
import { UserService } from "./users.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m'}
    }),
    PassportModule
  ],
  controllers: [UsersController],
  providers: [UserService, JwtStrategy]
})

export class UsersModule {}
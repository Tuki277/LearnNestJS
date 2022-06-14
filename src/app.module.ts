import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GetAccessToken } from './middlewares/getAccessToken.middleware';
import { AuthRole } from './middlewares/authRole.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    CatsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetAccessToken).forRoutes({ path: "/api/*", method: RequestMethod.ALL})
    consumer.apply(AuthRole).forRoutes("/api/users");
  }
}
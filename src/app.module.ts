import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    CatsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

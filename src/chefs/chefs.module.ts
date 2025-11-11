import { Module } from '@nestjs/common';
import { ChefsController } from './chefs.controller';
import { ChefsService } from './chefs.service';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [UsersModule],
  controllers: [ChefsController],
  providers: [ChefsService],
  exports: [ChefsService],
})
export class ChefsModule {}

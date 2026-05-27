import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './common/prisma/prisma.module'
import { WorkLogModule } from './modules/work-log/work-log.module'
import { WorkTypesModule } from './modules/work-types/work-types.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    WorkLogModule,
    WorkTypesModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig: TypeOrmModuleOptions = {
          type: 'mysql',
          host: configService.get('HOST'),
          port: +configService.get('PORT'),
          username: configService.get('USERNAME'),
          password: configService.get('PASSWORD'),
          database: configService.get('DATABASE'),
          synchronize: true,
          autoLoadEntities: true,
          keepConnectionAlive: true,
        };

        return databaseConfig;
      },
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

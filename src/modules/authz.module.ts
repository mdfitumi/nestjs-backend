import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../providers/authz-jwt-passport.service';
import { DefaultConfigModule } from './default-config.module';

@Module({
  imports: [
    DefaultConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthzModule {}

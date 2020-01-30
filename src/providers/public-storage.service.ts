import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyEntity, ServerEntity, PublicUserEntity } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto';
import { IcLogger } from './logger';

@Injectable()
export class PublicStorageService {
  constructor(
    @InjectRepository(CurrencyEntity)
    private currencyRepo: Repository<CurrencyEntity>,
    @InjectRepository(ServerEntity)
    private serverRepo: Repository<ServerEntity>,
    @InjectRepository(PublicUserEntity)
    private usersRepo: Repository<PublicUserEntity>,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('PublicStorageService');
  }

  async addAccount(account: CreateUserDto) {
    this.logger.debug(`addAccount ${JSON.stringify(account)}`);
    account.roles = [];
    const entity = this.usersRepo.create(account);
    return this.usersRepo.save(entity);
  }

  async deleteAccount(account: Partial<PublicUserEntity>) {
    this.logger.debug(`deleteAccount ${JSON.stringify(account)}`);
    return this.usersRepo.delete(account);
  }

  async getAccount(account: Partial<PublicUserEntity>) {
    this.logger.debug(`getAccount ${JSON.stringify(account)}`);
    return this.usersRepo.findOne(account);
  }

  async getAccountByAuthzId(authzId: string) {
    this.logger.debug(`getAccountByAuthzId ${authzId}`);
    return this.usersRepo.findOne({ auth0id: authzId }, { cache: true });
  }
}

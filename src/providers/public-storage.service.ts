import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyEntity, ServerEntity, UserEntity } from 'src/entities';
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
    @InjectRepository(UserEntity)
    private usersRepo: Repository<UserEntity>,
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

  async deleteAccount(account: Partial<UserEntity>) {
    this.logger.debug(`deleteAccount ${JSON.stringify(account)}`);
    return this.usersRepo.delete(account);
  }

  async getAccount(account: Partial<UserEntity>) {
    this.logger.debug(`getAccount ${JSON.stringify(account)}`);
    return this.usersRepo.findOne(account);
  }
}

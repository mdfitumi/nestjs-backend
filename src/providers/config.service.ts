import { Injectable, Inject } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { EnvConfig } from '../interfaces';
import { ConfigModuleOptions } from '../modules';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(@Inject('CONFIG_OPTIONS') private options: ConfigModuleOptions) {
    const filePath = `.${process.env.NODE_ENV || 'development'}.env`;
    const envFile = path.resolve(__dirname, '../../', options.folder, filePath);
    this.envConfig = (dotenv.parse(
      fs.readFileSync(envFile),
    ) as unknown) as EnvConfig;
  }

  getByKey(key: string): string {
    if (!this.envConfig.hasOwnProperty(key)) {
      throw new Error(`config does not have ${key} key`);
    }
    return (this.envConfig as any)[key];
  }

  get env() {
    return this.envConfig;
  }
}

import { Injectable, Inject } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { EnvConfig } from '../interfaces';
import { ConfigModuleOptions } from '../modules';
import { CONFIG_OPTIONS } from '../modules/config.module';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(@Inject(CONFIG_OPTIONS) private options: ConfigModuleOptions) {
    this.envConfig = ConfigService.readConfig(
      options.folder,
      ConfigService.envFileName,
    );
  }

  public static get envFileName() {
    return `.${process.env.NODE_ENV || 'development'}.env`;
  }

  public static readConfig(folder: string, filePath: string) {
    const envFile = path.resolve(__dirname, '../../', folder, filePath);
    return (dotenv.parse(fs.readFileSync(envFile)) as unknown) as EnvConfig;
  }

  public static readConfigDefault() {
    return ConfigService.readConfig('../', ConfigService.envFileName);
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

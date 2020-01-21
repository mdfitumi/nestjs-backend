import { RedisOptions } from 'ioredis';
import { parse } from 'url';

export abstract class RedisService {
  public static parseOptions(options: string): RedisOptions {
    const redisOptions = parse(options);
    let redisPass: string = '';
    if (redisOptions.auth) {
      redisPass = redisOptions.auth.split(':')[1];
    }

    return {
      host: redisOptions.hostname!!,
      port: Number(redisOptions.port),
      password: redisPass,
    };
  }
}

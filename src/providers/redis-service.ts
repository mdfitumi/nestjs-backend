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

export function subscribeToEvents<T>(
  factory: RedisFactoryService,
  redisKey: string,
): Observable<T> {
  const redis = factory.create();
  return concat(
    defer(() => redis.subscribe(redisKey)).pipe(ignoreElements()),
    fromEvent<T>(redis, 'message'),
  );
}

export function subscribeToEventsPattern<T>(
  redis: Redis,
  redisKeyPattern: string,
): Observable<T> {
  return concat(
    defer(() => redis.psubscribe(redisKeyPattern)).pipe(ignoreElements()),
    fromEvent<T>(redis, 'message'),
  );
}

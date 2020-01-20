export interface AuthzJwtPayload {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  azp: string;
  gty: string;
}

/*
{
  "iss": "https://smmtool.eu.auth0.com/",
  "sub": "rZ0kZBvuKVUix3OpYG3Qtp3HLTVCSFsZ@clients",
  "aud": "http://localhost:3000",
  "iat": 1579510598,
  "exp": 1579596998,
  "azp": "rZ0kZBvuKVUix3OpYG3Qtp3HLTVCSFsZ",
  "gty": "client-credentials"
}
*/

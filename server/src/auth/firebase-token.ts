import { createPublicKey, verify as verifySignature } from 'node:crypto';
import { z } from 'zod';
import { config } from '../config.ts';
import { HttpError } from '../errors.ts';

const certificateUrl =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

const headerSchema = z.object({
  alg: z.literal('RS256'),
  kid: z.string().min(1),
  typ: z.literal('JWT').optional(),
});

const claimsSchema = z.object({
  aud: z.string(),
  auth_time: z.number().int().nonnegative(),
  exp: z.number().int().positive(),
  iat: z.number().int().positive(),
  iss: z.string(),
  sub: z.string().min(1).max(128),
  email: z.string().optional(),
  name: z.string().optional(),
});

const certificateSchema = z.record(z.string(), z.string());

export interface FirebaseIdentity {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface CertificateCache {
  certificates: Record<string, string>;
  expiresAt: number;
}

let certificateCache: CertificateCache | undefined;

const decodeJsonSegment = (segment: string): unknown => {
  try {
    return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8')) as unknown;
  } catch {
    throw new HttpError(401, 'Invalid authentication token.');
  }
};

const getCertificates = async (refresh = false): Promise<Record<string, string>> => {
  if (!refresh && certificateCache && certificateCache.expiresAt > Date.now()) {
    return certificateCache.certificates;
  }

  let response: Response;
  try {
    response = await fetch(certificateUrl, { signal: AbortSignal.timeout(5_000) });
  } catch {
    throw new HttpError(503, 'Authentication service is temporarily unavailable.');
  }

  if (!response.ok) {
    throw new HttpError(503, 'Authentication service is temporarily unavailable.');
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new HttpError(503, 'Authentication service is temporarily unavailable.');
  }
  const parsedCertificates = certificateSchema.safeParse(payload);
  if (!parsedCertificates.success) {
    throw new HttpError(503, 'Authentication service is temporarily unavailable.');
  }

  const maxAge = response.headers
    .get('cache-control')
    ?.match(/max-age=(\d+)/i)?.[1];
  const cacheLifetimeSeconds = Math.min(Number(maxAge) || (maxAge === '0' ? 0 : 300), 3_600);
  certificateCache = {
    certificates: parsedCertificates.data,
    expiresAt: Date.now() + cacheLifetimeSeconds * 1_000,
  };

  return certificateCache.certificates;
};

export const verifyFirebaseIdToken = async (token: string): Promise<FirebaseIdentity> => {
  if (token.length > 12_000) {
    throw new HttpError(401, 'Invalid authentication token.');
  }

  const segments = token.split('.');
  if (segments.length !== 3) {
    throw new HttpError(401, 'Invalid authentication token.');
  }

  const [encodedHeader, encodedClaims, encodedSignature] = segments;
  const parsedHeader = headerSchema.safeParse(decodeJsonSegment(encodedHeader));
  const parsedClaims = claimsSchema.safeParse(decodeJsonSegment(encodedClaims));
  if (!parsedHeader.success || !parsedClaims.success) {
    throw new HttpError(401, 'Invalid authentication token.');
  }

  const header = parsedHeader.data;
  const claims = parsedClaims.data;
  const currentTime = Math.floor(Date.now() / 1_000);
  if (
    claims.aud !== config.firebaseProjectId ||
    claims.iss !== `https://securetoken.google.com/${config.firebaseProjectId}` ||
    claims.exp <= currentTime ||
    claims.iat > currentTime ||
    claims.auth_time > currentTime ||
    claims.auth_time > claims.iat
  ) {
    throw new HttpError(401, 'Invalid authentication token.');
  }

  let certificates = await getCertificates();
  let certificate = certificates[header.kid];
  if (!certificate) {
    certificates = await getCertificates(true);
    certificate = certificates[header.kid];
  }
  if (!certificate) {
    throw new HttpError(401, 'Invalid authentication token.');
  }

  const signedContent = Buffer.from(`${encodedHeader}.${encodedClaims}`);
  const signature = Buffer.from(encodedSignature, 'base64url');
  let signatureIsValid = false;
  try {
    signatureIsValid = verifySignature(
      'RSA-SHA256',
      signedContent,
      createPublicKey(certificate),
      signature,
    );
  } catch {
    throw new HttpError(401, 'Invalid authentication token.');
  }

  if (!signatureIsValid) {
    throw new HttpError(401, 'Invalid authentication token.');
  }

  return {
    uid: claims.sub,
    email: claims.email ?? null,
    displayName: claims.name ?? null,
  };
};

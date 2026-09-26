import helmet from 'helmet';

/** Standard security headers. Cross-origin resource policy is relaxed: this is a public JSON API. */
export const securityHeaders = helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } });

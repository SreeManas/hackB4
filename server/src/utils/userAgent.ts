/**
 * Coarse browser / OS family from a User-Agent string - names only, no versions - so a subscription
 * records "Chrome on Android" without storing anything that identifies an individual device.
 * Order matters: many browsers also claim to be Chrome or Safari, and iOS/Android claim to be macOS/Linux.
 */

export interface DeviceInfo {
  browser: string | undefined;
  os: string | undefined;
}

const BROWSERS: ReadonlyArray<readonly [RegExp, string]> = [
  [/Edg(e|A|iOS)?\//, 'Edge'],
  [/OPR\/|Opera/, 'Opera'],
  [/SamsungBrowser\//, 'Samsung Internet'],
  [/Firefox\/|FxiOS\//, 'Firefox'],
  [/Chrome\/|CriOS\//, 'Chrome'],
  [/Safari\//, 'Safari'],
];

const SYSTEMS: ReadonlyArray<readonly [RegExp, string]> = [
  [/iPhone|iPad|iPod/, 'iOS'],
  [/Android/, 'Android'],
  [/Windows/, 'Windows'],
  [/CrOS/, 'ChromeOS'],
  [/Mac OS X|Macintosh/, 'macOS'],
  [/Linux|X11/, 'Linux'],
];

const match = (table: ReadonlyArray<readonly [RegExp, string]>, ua: string) => table.find(([re]) => re.test(ua))?.[1];

export function deviceFromUserAgent(userAgent: string | undefined): DeviceInfo {
  if (!userAgent) return { browser: undefined, os: undefined };
  return { browser: match(BROWSERS, userAgent), os: match(SYSTEMS, userAgent) };
}

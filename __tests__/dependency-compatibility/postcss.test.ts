import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type PackageManifest = {
  dependencies?: Record<string, string>;
  overrides?: Record<string, string>;
};

function readPackageManifest(path: string): PackageManifest {
  return JSON.parse(readFileSync(path, 'utf8')) as PackageManifest;
}

describe('PostCSS dependency compatibility', () => {
  test('root override matches the exact PostCSS version required by Next', () => {
    const rootManifest = readPackageManifest(join(process.cwd(), 'package.json'));
    const nextManifest = readPackageManifest(join(process.cwd(), 'node_modules/next/package.json'));

    expect(rootManifest.overrides?.postcss).toBe(nextManifest.dependencies?.postcss);
  });
});

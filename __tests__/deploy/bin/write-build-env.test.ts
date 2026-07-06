import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

describe('write-build-env.sh', () => {
  const scriptPath = path.join(process.cwd(), 'deploy/bin/write-build-env.sh');
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'write-build-env-'));
  });

  afterEach(() => {
    rmSync(tempDir, { force: true, recursive: true });
  });

  test('removes the legacy request increase modal flag from development builds', () => {
    const outputPath = path.join(tempDir, 'app.env');

    execFileSync('bash', [scriptPath, outputPath], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        APP_VERSION: 'abc123',
        DEPLOY_TIER: 'development',
        NEXT_PUBLIC_MARKET_API_URL: 'https://market.example.test',
      },
      input: JSON.stringify({
        EXISTING_SECRET: 'present',
        NEXT_PUBLIC_BORROWER_REQUEST_INCREASE_MODAL_ENABLED: 'false',
      }),
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    expect(readFileSync(outputPath, 'utf8')).toBe(
      [
        'EXISTING_SECRET=present',
        'NEXT_PUBLIC_MARKET_API_URL=https://market.example.test',
        'APP_VERSION=abc123',
        '',
      ].join('\n'),
    );
  });

  test('removes the legacy request increase modal flag from staging builds', () => {
    const outputPath = path.join(tempDir, 'app.env');

    execFileSync('bash', [scriptPath, outputPath], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        APP_VERSION: 'def456',
        DEPLOY_TIER: 'staging',
        NEXT_PUBLIC_MARKET_API_URL: 'https://market.example.test',
      },
      input: JSON.stringify({
        EXISTING_SECRET: 'present',
        NEXT_PUBLIC_BORROWER_REQUEST_INCREASE_MODAL_ENABLED: 'false',
      }),
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    expect(readFileSync(outputPath, 'utf8')).toBe(
      [
        'EXISTING_SECRET=present',
        'NEXT_PUBLIC_MARKET_API_URL=https://market.example.test',
        'APP_VERSION=def456',
        '',
      ].join('\n'),
    );
  });

  test('removes the legacy request increase modal flag from production builds', () => {
    const outputPath = path.join(tempDir, 'app.env');

    execFileSync('bash', [scriptPath, outputPath], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        APP_VERSION: 'ghi789',
        DEPLOY_TIER: 'production',
        NEXT_PUBLIC_MARKET_API_URL: 'https://market.example.test',
      },
      input: JSON.stringify({
        EXISTING_SECRET: 'present',
        NEXT_PUBLIC_BORROWER_REQUEST_INCREASE_MODAL_ENABLED: 'true',
      }),
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    expect(readFileSync(outputPath, 'utf8')).toBe(
      [
        'EXISTING_SECRET=present',
        'NEXT_PUBLIC_MARKET_API_URL=https://market.example.test',
        'APP_VERSION=ghi789',
        '',
      ].join('\n'),
    );
  });
});

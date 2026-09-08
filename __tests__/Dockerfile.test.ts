/** @jest-environment node */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const yaml = require('js-yaml') as { load: (input: string) => unknown };

type WorkflowStep = {
  env?: Record<string, string | number>;
  name?: string;
  run?: string;
};

type TestWorkflowJob = {
  env?: Record<string, string | number>;
  steps: WorkflowStep[];
};

const runDockerSmokeTest = process.env.DOCKER_SMOKE_TEST === '1';
const imageTag = `ck-frontends-docker-smoke:${process.pid}`;
let imageWasBuilt = false;

const docker = (args: string[]) =>
  execFileSync('docker', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'pipe',
  });

describe('Docker build configuration', () => {
  test('removes build-only npm tooling from the runner stage', () => {
    const dockerfile = readFileSync(join(process.cwd(), 'Dockerfile'), 'utf8');
    const runnerStage = dockerfile.slice(dockerfile.indexOf('FROM base AS runner'));
    const nodeModulesCopy = runnerStage.indexOf(
      'COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules',
    );
    const cleanup = runnerStage.indexOf('RUN npm cache clean --force');

    expect(nodeModulesCopy).toBeGreaterThanOrEqual(0);
    expect(cleanup).toBeGreaterThan(nodeModulesCopy);
    expect(runnerStage).toContain('rm -rf /root/.npm /usr/local/lib/node_modules/npm');
    expect(runnerStage).toContain('rm -f /usr/local/bin/npm /usr/local/bin/npx');
    expect(runnerStage).toContain('CMD ["dumb-init","node","server.js"]');
  });

  test('runs deploy image tests using the test-capable image', () => {
    const deployScript = readFileSync(join(process.cwd(), 'deploy/ck-ecs.sh'), 'utf8');
    const testImage = deployScript.slice(
      deployScript.indexOf('test_image () {'),
      deployScript.indexOf('\nautodeploy () {'),
    );

    expect(testImage).toContain('docker run "$IMAGE_NAME:test" npm run test');
    expect(testImage).not.toContain('docker run "$IMAGE_NAME:$TARGET" npm run test');
    expect(testImage).toContain('--target dev');
  });

  test('keeps the dev image test-ready without adding test files to the runner', () => {
    const dockerfile = readFileSync(join(process.cwd(), 'Dockerfile'), 'utf8');
    const builderStage = dockerfile.slice(
      dockerfile.indexOf('FROM base AS builder'),
      dockerfile.indexOf('\nFROM builder AS dev'),
    );
    const devStage = dockerfile.slice(
      dockerfile.indexOf('FROM builder AS dev'),
      dockerfile.indexOf('\nFROM base AS runner'),
    );
    const runnerStage = dockerfile.slice(dockerfile.indexOf('FROM base AS runner'));

    expect(dockerfile).toContain('FROM builder AS dev');
    expect(runnerStage).toContain('FROM base AS runner');
    expect(builderStage).toContain('COPY ./__tests__ ./__tests__');
    expect(builderStage).toContain('COPY jest.config.ts jest.setup.ts ./');
    expect(builderStage).toContain('COPY Dockerfile compose.yml ./');
    expect(builderStage).toContain(
      'COPY ./.github/workflows/deploy.yml ./.github/workflows/deploy.yml',
    );
    expect(builderStage).toContain(
      'COPY ./.github/workflows/format-lint-test.yml ./.github/workflows/format-lint-test.yml',
    );
    expect(builderStage).toContain('COPY ./deploy ./deploy');
    expect(devStage).toContain('ENV NODE_ENV=development');
    expect(runnerStage).not.toContain('/app/__tests__');
    expect(runnerStage).not.toContain('/app/jest.config.ts');
    expect(runnerStage).not.toContain('/app/jest.setup.ts');
    expect(runnerStage).not.toContain('/app/Dockerfile');
    expect(runnerStage).not.toContain('/app/compose.yml');
    expect(runnerStage).not.toContain('/app/.github/workflows/deploy.yml');
    expect(runnerStage).not.toContain('/app/.github/workflows/format-lint-test.yml');
    expect(runnerStage).not.toContain('/app/deploy');
  });

  test('runs the Sharp smoke test in the pull-request test job with BuildKit secret access', () => {
    const workflow = yaml.load(
      readFileSync(join(process.cwd(), '.github/workflows/format-lint-test.yml'), 'utf8'),
    ) as { jobs: { test: TestWorkflowJob } };
    const testJob = workflow.jobs.test;
    const installDependenciesStep = testJob.steps.find(
      ({ name }) => name === 'Install dependencies',
    );
    const dockerSmokeTestStep = testJob.steps.find(
      ({ name }) => name === 'Run Docker image smoke test',
    );
    const tokenSteps = testJob.steps.filter(
      ({ env }) => env?.FONTAWESOME_NPM_AUTH_TOKEN !== undefined,
    );
    const fontAwesomeToken = '${{ secrets.FONTAWESOME_NPM_AUTH_TOKEN }}';

    expect(testJob.env ?? {}).not.toHaveProperty('FONTAWESOME_NPM_AUTH_TOKEN');
    expect(installDependenciesStep).toMatchObject({
      env: { FONTAWESOME_NPM_AUTH_TOKEN: fontAwesomeToken },
      run: 'npm ci',
    });
    expect(dockerSmokeTestStep).toMatchObject({
      env: {
        DOCKER_SMOKE_TEST: 1,
        FONTAWESOME_NPM_AUTH_TOKEN: fontAwesomeToken,
      },
      run: 'npx jest __tests__/Dockerfile.test.ts --runInBand --verbose',
    });
    expect(tokenSteps.map(({ name }) => name)).toEqual([
      'Install dependencies',
      'Run Docker image smoke test',
    ]);
  });

  test('uses BuildKit secrets for both deploy image build functions', () => {
    const deployScript = readFileSync(join(process.cwd(), 'deploy/ck-ecs.sh'), 'utf8');
    const buildImage = deployScript.slice(
      deployScript.indexOf('build_image () {'),
      deployScript.indexOf('\npush_image () {'),
    );
    const testImage = deployScript.slice(
      deployScript.indexOf('test_image () {'),
      deployScript.indexOf('\nautodeploy () {'),
    );
    const secretFlag = '--secret id=fontawesome-npm-auth-token,env=FONTAWESOME_NPM_AUTH_TOKEN';

    expect(testImage).toContain('DOCKER_BUILDKIT=1 docker build');
    expect(testImage).toContain(secretFlag);
    expect(buildImage).toContain('DOCKER_BUILDKIT=1 docker build');
    expect(buildImage).toContain(secretFlag);
    expect(buildImage).not.toContain('--build-arg FONTAWESOME_NPM_AUTH_TOKEN');
    expect(testImage).not.toContain('--build-arg FONTAWESOME_NPM_AUTH_TOKEN');
  });

  test('uses locked build dependencies and keeps the Font Awesome token out of build arguments', () => {
    const dockerfile = readFileSync(join(process.cwd(), 'Dockerfile'), 'utf8');
    const compose = readFileSync(join(process.cwd(), 'compose.yml'), 'utf8');
    const deployWorkflow = readFileSync(
      join(process.cwd(), '.github/workflows/deploy.yml'),
      'utf8',
    );
    const deployScript = readFileSync(join(process.cwd(), 'deploy/ck-ecs.sh'), 'utf8');

    expect(dockerfile).not.toMatch(
      /^ENV FONTAWESOME_NPM_AUTH_TOKEN=\$FONTAWESOME_NPM_AUTH_TOKEN$/m,
    );
    expect(dockerfile).not.toContain('ARG FONTAWESOME_NPM_AUTH_TOKEN');
    expect(dockerfile).toContain(
      'RUN --mount=type=secret,id=fontawesome-npm-auth-token,required=false',
    );
    expect(dockerfile).toContain(
      'export FONTAWESOME_NPM_AUTH_TOKEN="$(cat /run/secrets/fontawesome-npm-auth-token 2>/dev/null || true)"',
    );
    expect(dockerfile).not.toContain('RUN npm ci --omit=dev');
    expect(dockerfile).toContain('RUN npm prune --omit=dev');
    expect(compose).not.toContain('FONTAWESOME_NPM_AUTH_TOKEN:');
    expect(compose).toContain(
      'fontawesome-npm-auth-token:\n    environment: FONTAWESOME_NPM_AUTH_TOKEN',
    );
    expect(deployWorkflow).not.toContain('--build-arg FONTAWESOME_NPM_AUTH_TOKEN');
    expect(deployWorkflow).toContain(
      '--secret id=fontawesome-npm-auth-token,env=FONTAWESOME_NPM_AUTH_TOKEN',
    );
    expect(deployWorkflow).toContain(
      'FONTAWESOME_NPM_AUTH_TOKEN: ${{ secrets.FONTAWESOME_NPM_AUTH_TOKEN }}',
    );
    expect(deployScript).not.toContain('--build-arg FONTAWESOME_NPM_AUTH_TOKEN');
    expect(deployScript).toContain(
      '--secret id=fontawesome-npm-auth-token,env=FONTAWESOME_NPM_AUTH_TOKEN',
    );
  });
});

(runDockerSmokeTest ? describe : describe.skip)('production Docker image', () => {
  afterAll(() => {
    if (imageWasBuilt) {
      docker(['image', 'rm', '--force', imageTag]);
    }
  });

  test('loads Sharp from the runner image', () => {
    docker([
      'build',
      '--target',
      'runner',
      '--tag',
      imageTag,
      '--secret',
      'id=fontawesome-npm-auth-token,env=FONTAWESOME_NPM_AUTH_TOKEN',
      '.',
    ]);
    imageWasBuilt = true;

    docker(['run', '--rm', '--entrypoint', 'node', imageTag, '-e', "require('sharp')"]);
  }, 300_000);
});

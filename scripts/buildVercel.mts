import { execSync } from 'node:child_process';

function run(cmd: string, env?: Record<string, string>) {
  console.log(`\n>>> ${cmd}\n`);
  execSync(cmd, {
    stdio: 'inherit',
    env: env ? { ...process.env, ...env } : process.env,
  });
}

// Step 1: Build desktop SPA
run('vite build', { NODE_OPTIONS: '--max-old-space-size=6144' });

// Step 2: Build auth SPA
run('vite build', { NODE_OPTIONS: '--max-old-space-size=5120', AUTH: 'true' });

// Step 3: Build workbench SPA
run('vite build', { NODE_OPTIONS: '--max-old-space-size=5120', SPA_TARGET: 'workbench' });

// Step 4: Build mobile SPA (crucial for fixing mobile black screen)
run('vite build', { NODE_OPTIONS: '--max-old-space-size=4096', MOBILE: 'true' });

// Step 5: Copy SPA build artifacts and generate HTML templates
run('tsx scripts/copySpaBuild.mts && tsx scripts/generateSpaTemplates.mts');

// Step 6: Build Next.js app
run('next build', { NODE_OPTIONS: '--max-old-space-size=5120' });

// Step 7: Run database migrations
run('tsx ./scripts/migrateServerDB/index.ts', { MIGRATION_DB: '1' });

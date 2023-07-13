export async function register() {
  // XXX(Phong): comment this in if you want to run migration on server start.
  // You'll have to modify the CI/CD pipeline to not run on deploy.
  // if (process.env.NEXT_RUNTIME === 'nodejs') {
  //   const { migrateLatest } = await import('./db');
  //   await migrateLatest();
  // }
}

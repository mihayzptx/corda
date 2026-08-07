import fs from 'fs';
import path from 'path';
import pool from '../config/database';

export async function runMigrations() {
  const migrationsDir = path.join(__dirname, '../../migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (file.endsWith('.sql')) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      try {
        await pool.query(sql);
        console.log(`✓ Executed ${file}`);
      } catch (err) {
        console.error(`✗ Failed to execute ${file}:`, err);
        throw err;
      }
    }
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('All migrations completed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

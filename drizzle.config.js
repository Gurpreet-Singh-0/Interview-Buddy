import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './utils/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_I1lsHRb0ZycL@ep-bold-tooth-a8yja89b-pooler.eastus2.azure.neon.tech/interview_buddy?sslmode=require",
  },
});

import { config } from 'dotenv';
config();

import '@/ai/flows/improve-offline-ngram-model.ts';
import '@/ai/flows/suggest-corrections-with-gimeni.ts';
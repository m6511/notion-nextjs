import { readFileSync } from 'fs';
import { join } from 'path';

const packageJsonPath = join(process.cwd(), '../..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

export const VERSION = packageJson.version;
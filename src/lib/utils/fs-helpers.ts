import fs from 'fs';
import { promisify } from 'util';

type ReadFile = {
  (path: string, options?: { encoding?: null; flag?: string } | null): Promise<Buffer>;
  (path: string, options: { encoding: BufferEncoding; flag?: string } | BufferEncoding): Promise<string>;
};

// Define the types for the readFile and writeFile functions
export const readFile: ReadFile  = promisify(fs.readFile);
export const writeFile: (path: string, data: any, options?: fs.WriteFileOptions) => Promise<void> = promisify(fs.writeFile);

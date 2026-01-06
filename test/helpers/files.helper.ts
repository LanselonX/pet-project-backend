import 'dotenv/config';
import { mkdir, rm, writeFile } from 'fs/promises';
import { dirname } from 'path';

// TODO: need make mb try catch
export const createTestImage = async (path: string) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, 'fake image content');
};

export const removeTestImage = async (path: string) => {
  await rm(path, { force: true });
};

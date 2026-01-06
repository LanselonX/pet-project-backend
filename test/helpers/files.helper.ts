import { dirname } from 'path';
import { mkdir, rm, writeFile } from 'fs/promises';

export const createTestImage = async (path: string) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, 'fake image content');
};

export const removeTestImage = async (path: string) => {
  await rm(path, { force: true });
};

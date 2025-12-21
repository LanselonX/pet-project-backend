import { BadRequestException, Injectable } from '@nestjs/common';
import { basename, join } from 'path';
import * as fs from 'node:fs/promises';

@Injectable()
export class FileService {
  async confirmImage(
    tempPath: string,
    //TODO: change to greater extensibility
    entiyName: string,
    entityId: number,
  ): Promise<string> {
    if (!tempPath.startsWith('/uploads/tmp')) {
      throw new BadRequestException('Invalid temp Image');
    }

    const filename = basename(tempPath);

    const tempAbsolutePath = join(process.cwd(), tempPath);
    const finalDir = join(
      process.cwd(),
      'uploads',
      entiyName,
      String(entityId),
    );
    const finalAbsolutePath = join(finalDir, filename);

    await fs.mkdir(finalDir, { recursive: true });
    await fs.rename(tempAbsolutePath, finalAbsolutePath);

    return `/uploads/${entiyName}/${entityId}/${filename}`;
  }
}

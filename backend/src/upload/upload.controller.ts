import {
    BadRequestException,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import type { HTTP_RESPONSE } from '@/common/types';

@Controller('upload')
export class UploadController {
    @Post('image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/images',
                filename: (_req, file, callback) => {
                    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
                    callback(null, uniqueName);
                },
            }),
            fileFilter: (_req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return callback(
                        new BadRequestException('Only image files are allowed'),
                        false,
                    );
                }
                callback(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
        }),
    )
    uploadImage(
        @UploadedFile() file: Express.Multer.File,
    ): HTTP_RESPONSE<{ url: string }> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const url = `/uploads/images/${file.filename}`;

        return {
            message: 'Image uploaded successfully',
            success: true,
            data: { url },
        };
    }
}

import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { FilesService } from './files.service';
import { diskStorage } from 'multer';

import { fileNamer, fileFilter } from './helpers/index';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  fineProductImage(
    @Res() res: Response,
    @Param('imageName')  imageName: string
  ) {
    const path = this.filesService.getStaticProductImage( imageName )
    res.sendFile( path )
  }


  @Post('product')
  @UseInterceptors( FileInterceptor( 'file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  uploadFile( 
    @UploadedFile() file: Express.Multer.File 
  ) {
    
    if ( !file )
      throw new BadRequestException(' Make sure that the file is an image ')

    const secureURL = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`

    return {
      secureURL
    }
  }
}

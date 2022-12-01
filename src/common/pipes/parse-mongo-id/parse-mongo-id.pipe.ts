import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if(!isValidObjectId(value)){
      throw new BadRequestException(`${value} no es un id de mongo`)
    }
    return value;
  }
}

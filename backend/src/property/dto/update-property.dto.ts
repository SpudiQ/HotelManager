import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}

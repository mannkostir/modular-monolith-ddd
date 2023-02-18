import { Param, ParseUUIDPipe } from '@nestjs/common';

export function UuidParam(property: string) {
  return Param(property, ParseUUIDPipe);
}

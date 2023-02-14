import { IHandleMissingParameterSpecificationError } from '@src/infrastructure/database/interfaces/handle-missing-parameter-specification-error.interface';

export class SpecificationErrorHandlingNullStrategy
  implements IHandleMissingParameterSpecificationError
{
  handleMissingParameter(): void {
    return;
  }
}

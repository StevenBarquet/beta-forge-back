// --------------------------------------IMPORTS------------------------------------
// Dependencies
import { ValidationResult } from 'joi';

// --------------------------------------CONFIGURATION------------------------------------
// ---getCerts
interface WithFilesCerts {
  cert: string;
  key: string;
}

interface EmptyObj { [n: string]: never }

export type Certs = WithFilesCerts | EmptyObj

// -----------------------------------------Respond Services--------------------------------------
interface Result {
  error?: any;
  errorType?: string;
  statusError?: number;
  responseData?: any;
}

export interface CallbackResponse {
  internalError: boolean;
  result: Result;
}

export type Callback = (params?: any) => Promise<CallbackResponse>;

// -------------------------------------------Validations----------------------------------------
export type Validator = (data: unknown) => ValidationResult;

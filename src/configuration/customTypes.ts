/* eslint-disable no-unused-vars */
// --------------------------------------IMPORTS------------------------------------
// ---Dependencies
import { AxiosResponse, AxiosError } from 'axios';

// --------------------------------------CONFIGURATION------------------------------------
// ---getCerts
interface WithFilesCerts {
  cert: string;
  key: string;
}

interface EmptyObj { [n: string]: never }

export type Certs = WithFilesCerts | EmptyObj

// -------------------------------------------Respond Services----------------------------------------
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

// -------------------------------------------endToEndReq----------------------------------------
export interface ResponseStandar {
  internalError: boolean;
  response?: AxiosResponse<any>;
  error?: AxiosError<any>;
}
export type RouteAsyncMethod = () => Promise<ResponseStandar>

// -------------------------------------------Validations----------------------------------------

export interface WordsReqData {
  pageNumber: number;
  pageSize: number;
  searchedString: string;
  mail?: string;
}

interface AnyArray {
  [index: number]: unknown;
}
export interface DBSearchModel {
  searchedString: string;
  result: AnyArray;
  total: number;
}
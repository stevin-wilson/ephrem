import {AxiosRequestConfig} from 'axios';
import {
  FetchBiblesOptions,
  PassageAndFumsResponse,
  PassageOptions,
} from '../api-bible/api-types.js';
import {
  GetBookIdOptions,
  ParseReferencesOptions,
} from '../reference/reference-types.js';
import {
  BiblesCache,
  PassagesCache,
  UpdateBiblesCacheOptions,
} from '../cache/cache-types.js';

export type PassagesOutput = Record<string, PassageAndFumsResponse[]>;

export interface GetPassagesOptions extends ParseReferencesOptions {
  passagesCache?: PassagesCache;
  passageOptions?: PassageOptions;
  forcePassageApiCall?: boolean;
}

export class GetPassagesError extends Error {
  public readonly context?: GetPassagesOptions;

  constructor(
    message = 'Unable to retreive passage',
    context: GetPassagesOptions
  ) {
    super(message);
    this.name = 'GetPassagesError';
    this.context = context;
  }
}

import { InjectionToken } from '@angular/core';

export type UrlParser = (location: string) => URL;

export const URL_PARSER = new InjectionToken<UrlParser>('URL Parser', {
  providedIn: 'root',
  factory: () => {
    return (location: string) => new URL(location);
  }
});

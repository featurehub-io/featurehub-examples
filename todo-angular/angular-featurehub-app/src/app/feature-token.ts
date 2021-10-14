import { InjectionToken } from '@angular/core';

export interface FeatureToken {
  host: string;
  apiKey: string;
}

export const FEATURE_FLAG_TOKEN = new InjectionToken<FeatureToken>('FEATURE_FLAG_TOKEN');

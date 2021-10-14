import { Inject, Injectable } from '@angular/core';
import { EdgeFeatureHubConfig, ClientContext, fhLog, Readyness } from 'featurehub-javascript-client-sdk';
import { FeatureToken, FEATURE_FLAG_TOKEN } from './feature-token';

@Injectable({
  providedIn: 'root',
})
export class FeatureHubFlagService {
  fhClient!: ClientContext; // this instance will be availalbe in the entire application, use it to access the feature keys
  fhConfig!: EdgeFeatureHubConfig;
  constructor(@Inject(FEATURE_FLAG_TOKEN) private featureToken: FeatureToken) {}

  initFeatureHub(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fhConfig = new EdgeFeatureHubConfig(this.featureToken.host, this.featureToken.apiKey);
      this.fhConfig.init();
      this.fhConfig.addReadynessListener(async readyness => {
        if (readyness === Readyness.Ready) {
          this.fhClient = await this.fhConfig.newContext().build();
          resolve(this.fhClient);
        }
      });
    });
  }
}

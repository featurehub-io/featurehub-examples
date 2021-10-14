import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeatureToken, FEATURE_FLAG_TOKEN } from './feature-token';
import { FeatureHubFlagService } from './featurehub-service';
import { environment } from '../environments/environment';


const featureToken: FeatureToken = {
  apiKey: environment.apiKey, // api key
  host: environment.host, // host 
};

function loadFeatureHub(featuerHub: FeatureHubFlagService) {
  return () => featuerHub.initFeatureHub();
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: FEATURE_FLAG_TOKEN,
      useValue: featureToken,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadFeatureHub,
      deps: [FeatureHubFlagService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

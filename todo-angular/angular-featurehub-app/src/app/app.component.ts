import { Component, OnInit } from '@angular/core';
import {
  EdgeFeatureHubConfig,
  ClientContext,
  fhLog
} from 'featurehub-javascript-client-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit  {
  title = 'angular-basic-featurehub';

  // @ts-ignore
  fhContext: ClientContext;

  ngOnInit() {
    fhLog.quiet();
    const fhConfig = new EdgeFeatureHubConfig('http://localhost:8903', 'default/82afd7ae-e7de-4567-817b-dd684315adf7/SJXBRyGCe1dZwnL7OQYUiJ5J8VcoMrrHP3iKCrkpYovhNIuwuIPNYGy7iOFeKE4Kaqp5sT7g5X2qETsW')
    fhConfig.newContext().build().then(context => this.fhContext = context);
  }
}

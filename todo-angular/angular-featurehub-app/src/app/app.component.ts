import { Component, OnInit } from '@angular/core';
import {
  ClientContext,
} from 'featurehub-javascript-client-sdk';
import { FeatureHubFlagService } from './featurehub-service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'angular-basic-featurehub';

  // @ts-ignore
  fhContext: ClientContext;

  constructor(private featureFlagService: FeatureHubFlagService) {}

  ngOnInit() {
    this.featureFlagService.fhClient.getFlag('test'); // test is the key of the feature flag
  }
}

import { Component } from '@angular/core';
import { ClientContext,
  EdgeFeatureHubConfig,
  Readyness,
  FeatureHubEventSourceClient,
  StrategyAttributeCountryName,
  GoogleAnalyticsCollector } from 'featurehub-eventsource-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  fhConfig = new EdgeFeatureHubConfig('http://localhost:8903', 'default/22d4f6d3-73d6-4e7f-81bb-024405aeace6/KI3piDClGv4lzrcTvMV6CUZHXSxRKl*2vW9tCDbBwCuW4OmtRbo');
  title = 'Tour of Heroes';
}

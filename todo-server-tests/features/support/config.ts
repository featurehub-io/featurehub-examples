import {EdgeFeatureHubConfig} from "featurehub-javascript-node-sdk";

function getApplicationServerUrl(): string {
    let appUrl;

    if (process.env.FEATUREHUB_EDGE_URL === undefined || process.env.FEATUREHUB_CLIENT_API_KEY === undefined) {
        console.error('You must define the Application server URL under test in the environment variable FEATUREHUB_EDGE_URL and the API key in FEATUREHUB_CLIENT_API_KEY');
        process.exit(-1);
    } else appUrl = process.env.APP_SERVER_URL;

    return appUrl;
}

function getFhConfig(): EdgeFeatureHubConfig {
    const fhConfig  = new EdgeFeatureHubConfig(process.env.FEATUREHUB_EDGE_URL, process.env.FEATUREHUB_CLIENT_API_KEY);
    fhConfig.init();
    return fhConfig;
}

export class Config {
    public static baseApplicationPath = getApplicationServerUrl();
    public static fhConfig = getFhConfig();
}

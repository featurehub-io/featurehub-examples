import {EdgeFeatureHubConfig} from "../../../../featurehub-io/sdks/typescript/featurehub-eventsource-sdk";

// function getFhApiKey(): string {
//     let fhApiKey;
//
//     if (process.env.FEATUREHUB_API_KEY === undefined) {
//         console.error('You must define the FeatureHub SDK URL for your application environment in the environment variable FEATUREHUB_APP_ENV_URL');
//         process.exit(-1);
//     } else fhApiKey = process.env.FEATUREHUB_API_KEY;
//
//     return fhApiKey;
// }

function getApplicationServerUrl(): string {
    let appUrl;

    if (process.env.APP_SERVER_URL === undefined) {
        console.error('You must define the Application server URL under test in the environment variable APP_SERVER_URL');
        process.exit(-1);
    } else appUrl = process.env.APP_SERVER_URL;

    return appUrl;
}

function getFhConfig(): EdgeFeatureHubConfig {
    const fhConfig  = new EdgeFeatureHubConfig(process.env.FEATUREHUB_EDGE_URL, process.env.FEATUREHUB_API_KEY);
    fhConfig.init();
    return fhConfig;
}

export class Config {
    public static baseApplicationPath = getApplicationServerUrl();
    // public static fhApiKey = getFhApiKey();
    public static fhConfig = getFhConfig();
}

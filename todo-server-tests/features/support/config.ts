function getSDKUrl(): string {
    let sdkUrl;

    if (process.env.FEATUREHUB_APP_ENV_URL === undefined) {
        console.error('You must define the FeatureHub SDK URL for your application environment in the environment variable FEATUREHUB_APP_ENV_URL');
        process.exit(-1);
    } else sdkUrl = process.env.FEATUREHUB_APP_ENV_URL;

    return sdkUrl;
}

function getApplicationServerUrl(): string {
    let appUrl;

    if (process.env.APP_SERVER_URL === undefined) {
        console.error('You must define the Application server URL under test in the environment variable APP_SERVER_URL');
        process.exit(-1);
    } else appUrl = process.env.APP_SERVER_URL;

    return appUrl;
}

export class Config {
    public static baseApplicationPath = getApplicationServerUrl();
    public static sdkUrl = getSDKUrl();
}

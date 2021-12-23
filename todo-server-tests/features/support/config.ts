import {EdgeFeatureHubConfig} from "featurehub-javascript-node-sdk";
import globalAxios, { AxiosResponse } from "axios";

const responseProcessor = function (response: AxiosResponse) {
  const reqConfig = response.config;
  return {
    type: 'response',
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    data: response.data,
    request: {
      headers: reqConfig.headers,
      method: reqConfig.method,
      data: reqConfig.data,
      url: reqConfig.url,
    }
  };
};


globalAxios.interceptors.request.use(reqConfig=> {
  if (process.env.DEBUG) {
    const req = {
      type: 'request',
      headers: reqConfig.headers,
      method: reqConfig.method,
      data: reqConfig.data,
      url: reqConfig.url,
    };

    console.log('request: ', req);
  }

  return reqConfig;
}); // log axios requests

globalAxios.interceptors.response.use((resp: AxiosResponse) => {
  if (process.env.DEBUG) {
    const loginfo = responseProcessor(resp);
    console.log('response: ', loginfo);
  }
  return resp;
});


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

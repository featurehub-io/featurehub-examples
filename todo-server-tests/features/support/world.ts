import globalAxios from "axios";
import { FeatureStateUpdate, FeatureUpdater, EdgeFeatureHubConfig, FeatureStateHolder } from "featurehub-eventsource-sdk";
import { Config } from "./config";
import { FeatureHubEventSourceClient } from 'featurehub-eventsource-sdk/dist';
import {expect} from "chai";
import waitForExpect from "wait-for-expect";
const {Before, After, AfterAll} = require("@cucumber/cucumber");


const { setWorldConstructor } = require("@cucumber/cucumber");
const { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(30 * 1000);


// const fhConfig  = new EdgeFeatureHubConfig(process.env.FEATUREHUB_EDGE_URL, process.env.FEATUREHUB_API_KEY);
// fhConfig.init();

AfterAll(async function () {
    Config.fhConfig.close();
});

class CustomWorld {

    private variable: number;
    private user: string;
    private response: boolean;
    constructor() {
        this.variable = 0;
        globalAxios.interceptors.request.use(x=> {console.log(x); return x;}); // log axios requests
    }

    setUser(user) {
        this.user = user;
    }

    async updateFeatureOnlyValue(name: string, newValue: any) {
        const featureUpdater = new FeatureUpdater(Config.fhConfig);
        this.response =  await featureUpdater.updateKey(name, new FeatureStateUpdate({
            value: newValue,
        }));
    }

    async lockFeature(name: string) {
        const featureUpdater = new FeatureUpdater(Config.fhConfig);
        await featureUpdater.updateKey(name, new FeatureStateUpdate({
            lock: true,
        }));

        await waitForExpect(async () => { const feature: FeatureStateHolder = Config.fhConfig.repository().feature(name);
        expect(feature.isLocked()).to.equal(true);
        });
    }

    async unlockAndUpdateFeature(name: string, newValue: any) {
        const featureUpdater = new FeatureUpdater(Config.fhConfig);
        this.response =  await featureUpdater.updateKey(name, new FeatureStateUpdate({
            lock: false,
            value: newValue,
        }));
    }

    getFeatureUpdateResponse() {
        return this.response;
    }

}

setWorldConstructor(CustomWorld);

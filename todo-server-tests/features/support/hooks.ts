const {Before, After} = require("@cucumber/cucumber");
import {FeatureUpdater, FeatureStateUpdate, featureHubRepository} from "featurehub-repository/dist";
import {Config} from "./config";
import {expect} from "chai";

Before({tags: "@FEATURE_TITLE_TO_UPPERCASE"}, async function () {
    await updateFeature('FEATURE_TITLE_TO_UPPERCASE',true);
});

After({tags: "@FEATURE_TITLE_TO_UPPERCASE"}, async function () {
    await updateFeature('FEATURE_TITLE_TO_UPPERCASE',false);
});

Before({tags: "@FEATURE_STRING_MILK"}, async function () {
    await updateFeature('FEATURE_STRING','milk');
});

Before({tags: "@FEATURE_STRING_BREAD"}, async function () {
    await updateFeature('FEATURE_STRING','bread');
});

Before({tags: "@FEATURE_STRING_EMPTY"}, async function () {
    await updateFeature('FEATURE_STRING','');
});

Before({tags: "@FEATURE_STRING_NULL"}, async function () {
    await setFeatureToNotSet('FEATURE_STRING');
});

Before({tags: "@FEATURE_NUMBER_1"}, async function () {
    await updateFeature('FEATURE_NUMBER', 1);
});

Before({tags: "@FEATURE_NUMBER_500"}, async function () {
    await updateFeature('FEATURE_NUMBER', 500);
});

Before({tags: "@FEATURE_JSON_BAR"}, async function () {
    await updateFeature('FEATURE_JSON', JSON.parse("foo:bar"));
});

Before({tags: "@FEATURE_JSON_BAZ"}, async function () {
    await updateFeature('FEATURE_JSON', JSON.parse("foo:bar"));
});

Before({tags: "@FEATURE_NUMBER_NULL"}, async function () {
    await setFeatureToNotSet('FEATURE_NUMBER');
});

async function updateFeature(name: string, newValue: any) {
    const featureUpdater = new FeatureUpdater(Config.sdkUrl);
    const response = await featureUpdater.updateKey(name, new FeatureStateUpdate({
        lock: false,
        value: newValue,
    }));
    expect(response).to.equal(true);
}

async function setFeatureToNotSet(name: string) {
    const featureUpdater = new FeatureUpdater(Config.sdkUrl);
    await featureUpdater.updateKey(name, new FeatureStateUpdate({
        lock: false,
        updateValue: true
    }));
}

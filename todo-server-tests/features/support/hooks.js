"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Before, After } = require("@cucumber/cucumber");
const dist_1 = require("featurehub-repository/dist");
const config_1 = require("./config");
const chai_1 = require("chai");
Before({ tags: "@FEATURE_TITLE_TO_UPPERCASE" }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateFeature('FEATURE_TITLE_TO_UPPERCASE', true);
    });
});
After({ tags: "@FEATURE_TITLE_TO_UPPERCASE" }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateFeature('FEATURE_TITLE_TO_UPPERCASE', false);
    });
});
Before({ tags: "@FEATURE_STRING_MILK" }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateFeature('FEATURE_STRING', 'milk');
    });
});
Before({ tags: "@FEATURE_STRING_BREAD" }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateFeature('FEATURE_STRING', 'bread');
    });
});
Before({ tags: "@FEATURE_STRING_EMPTY" }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateFeature('FEATURE_STRING', '');
    });
});
Before({ tags: "@FEATURE_STRING_NULL" }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield setFeatureToNotSet('FEATURE_STRING');
    });
});
Before({ tags: "@FEATURE_NUMBER_1" }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateFeature('FEATURE_NUMBER', 1);
    });
});
Before({ tags: "@FEATURE_NUMBER_500" }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateFeature('FEATURE_NUMBER', 500);
    });
});
Before({ tags: "@FEATURE_JSON_BAR" }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateFeature('FEATURE_JSON', JSON.parse("foo:bar"));
    });
});
Before({ tags: "@FEATURE_JSON_BAZ" }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateFeature('FEATURE_JSON', JSON.parse("foo:bar"));
    });
});
Before({ tags: "@FEATURE_NUMBER_NULL" }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield setFeatureToNotSet('FEATURE_NUMBER');
    });
});
function updateFeature(name, newValue) {
    return __awaiter(this, void 0, void 0, function* () {
        const featureUpdater = new dist_1.FeatureUpdater(config_1.Config.sdkUrl);
        const response = yield featureUpdater.updateKey(name, new dist_1.FeatureStateUpdate({
            lock: false,
            value: newValue,
        }));
        chai_1.expect(response).to.equal(true);
    });
}
function setFeatureToNotSet(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const featureUpdater = new dist_1.FeatureUpdater(config_1.Config.sdkUrl);
        yield featureUpdater.updateKey(name, new dist_1.FeatureStateUpdate({
            lock: false,
            updateValue: true
        }));
    });
}
//# sourceMappingURL=hooks.js.map
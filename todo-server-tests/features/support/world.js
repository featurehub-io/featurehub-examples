"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const { setWorldConstructor } = require("@cucumber/cucumber");
class CustomWorld {
    constructor() {
        this.variable = 0;
        axios_1.default.interceptors.request.use(x => { console.log(x); return x; }); // log axios requests
    }
    setUser(user) {
        this.user = user;
    }
}
setWorldConstructor(CustomWorld);
//# sourceMappingURL=world.js.map
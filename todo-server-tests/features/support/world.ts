import globalAxios from "axios";

const { setWorldConstructor } = require("@cucumber/cucumber");
const {setDefaultTimeout} = require('@cucumber/cucumber');
setDefaultTimeout(30 * 1000);

class CustomWorld {

    private variable: number;
    private user: string;
    constructor() {
        this.variable = 0;
        globalAxios.interceptors.request.use(x=> {console.log(x); return x;}); // log axios requests
    }


    setUser(user) {
        this.user = user;
    }
}

setWorldConstructor(CustomWorld);

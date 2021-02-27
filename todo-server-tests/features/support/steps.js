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
const client_axios_1 = require("../../src/client-axios");
const { Given, When, Then } = require("@cucumber/cucumber");
const chai_1 = require("chai");
const config_1 = require("./config");
const wait_for_expect_1 = require("wait-for-expect");
const todoApi = new client_axios_1.TodoServiceApi(new client_axios_1.Configuration({ basePath: config_1.Config.baseApplicationPath }));
Given("I wipe my list of todos", function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield todoApi.removeAllTodos(this.user);
    });
});
Then("my list of todos should contain {string}", function (todoDescription) {
    return __awaiter(this, void 0, void 0, function* () {
        function extracted() {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield todoApi.listTodos(this.user);
                const responseData = response.data;
                const todo = responseData.find((item) => item.title == todoDescription);
                return { responseData, todo };
            });
        }
        yield wait_for_expect_1.default(() => __awaiter(this, void 0, void 0, function* () {
            const { responseData, todo } = yield extracted.call(this);
            chai_1.expect(todo, `Expected ${todoDescription} but found in the response: ${responseData[0].title}`).to.exist;
        }));
    });
});
Given("I have a user called {string}", function (userName) {
    this.setUser(userName);
});
When("I have added a new to-do item {string}", function (todoDescription) {
    return __awaiter(this, void 0, void 0, function* () {
        const todo = {
            id: '1',
            title: todoDescription,
        };
        yield todoApi.addTodo(this.user, todo);
    });
});
//# sourceMappingURL=steps.js.map
import {TodoServiceApi, Todo, Configuration} from "../../src/client-axios";

const {Given, When, Then} = require("@cucumber/cucumber");
import {expect} from "chai";
import {Config} from "./config";
import waitForExpect from "wait-for-expect";

const todoApi = new TodoServiceApi(new Configuration({basePath: Config.baseApplicationPath}));

Given("I wipe my list of todos", async function () {
    await todoApi.removeAllTodos(this.user);
});

Then("my list of todos should contain {string}", async function (todoDescription: string) {
    async function extracted() {
        const response = await todoApi.listTodos(this.user);
        const responseData: Todo[] = response.data;
        const todo: Todo = responseData.find((item) => item.title == todoDescription);
        return {responseData, todo};
    }

    await waitForExpect(async () => {
        const {responseData, todo} = await extracted.call(this);
        expect(todo, `Expected ${todoDescription} but found in the response: ${responseData[0].title}`).to.exist;

    });
});

Given("I have a user called {string}", function (userName: string) {
    this.setUser(userName);
});
When("I have added a new to-do item {string}", async function (todoDescription: string) {
    const todo: Todo = {
        id: '1',
        title: todoDescription,
    };
    await todoApi.addTodo(this.user, todo);
});

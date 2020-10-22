package io.featurehub.cukejava;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.featurehub.client.TodoService;
import io.featurehub.sse.model.FeatureStateUpdate;
import todo.model.Todo;

import java.util.HashMap;
import java.util.Map;

public class TodoStepDefs {
  private static TodoService todoService = TodoService.todoService;
  private String user;

  @Given("I have a user called {string}")
  public void iHaveAUserCalled(String name) {
    this.user = name.replace(" ", "_");
  }

  @Given("I wipe my list of todos")
  public void iWipeMyListOfTodos() {
    todoService.removeAllTodos(user);
  }


  @And("I have added a list of todos")
  public void iHaveAddedAListOfTodos(DataTable table) {
    table.asMaps().forEach(line -> {
      todoService.addTodo(user, new Todo().title(line.get("todo").trim()));
    });
  }

  @When("my list of todos should be")
  public void iAskForAListOfTodos(DataTable table) {
    Map<String, String> todos = getTodoListAsMap();

    table.asMaps().forEach(line -> {
      final String todoToFind = line.get("todo").trim();

      final String todo = todos.remove(todoToFind);

      if (todo == null) {
        throw new RuntimeException(String.format("Unable to find todo `%s`", todoToFind));
      }
    });

    if (!todos.isEmpty()) {
      throw new RuntimeException(String.format("Left over todos: %s", String.join(" ; ", todos.keySet())));
    }
  }

  private Map<String, String> getTodoListAsMap() {
    Map<String, String> todos = new HashMap<>();

    todoService.listTodos(user).forEach(t -> {
      todos.put(t.getTitle(), t.getId());
    });

    return todos;
  }

  @And("^the feature (.*) is (on|off)$")
  public void theFeatureIsSomething(String key, String state) {
    boolean on = state.equalsIgnoreCase("on");

    if (todoService.getRepository().getFlag(key) == on) {
      return;
    }

    todoService.setFeatureState(key, new FeatureStateUpdate().lock(false).value(on));

    int counter = 0;
    while (counter < 5 && todoService.getRepository().getFlag(key) != on) {
      System.out.println("Try #" + counter);
      try {
        Thread.sleep(1000);
      } catch (InterruptedException e) {
        throw new RuntimeException(e);
      }
      counter ++;
    }
    if (todoService.getRepository().getFlag(key) != on) {
      throw new RuntimeException(String.format("Failed to transition key `%s` to `%s`", key, state));
    }
  }
}

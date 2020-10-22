package todo.backend.resources;

import io.featurehub.client.StaticFeatureContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import todo.Features;
import todo.api.TodoService;
import todo.model.Todo;

import javax.inject.Singleton;
import javax.validation.Valid;
import javax.ws.rs.NotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Singleton
public class TodoResource implements TodoService {
  private static final Logger log = LoggerFactory.getLogger(TodoResource.class);
  Map<String, Map<String, Todo>> todos = new ConcurrentHashMap<>();

  public TodoResource() {
    log.info("created");
  }

  private Map<String, Todo> getTodoMap(String user) {
    return todos.computeIfAbsent(user, (key) -> new ConcurrentHashMap<>());
  }

  private List<Todo> getTodoList(Map<String, Todo> todos) {
    if (Features.FEATURE_TITLE_TO_UPPERCASE.isActive()) {
      StaticFeatureContext.getInstance().logAnalyticsEvent("list-by-uppercase");
      return todos.values().stream().map(t -> t.copy().title(t.getTitle().toUpperCase())).collect(Collectors.toList());
    }

    StaticFeatureContext.getInstance().logAnalyticsEvent("list-by-mixedcase");
    return new ArrayList<Todo>(todos.values());
  }

  @Override
  public List<Todo> addTodo(String user, Todo body) {
    if (body.getId() == null) {
      body.id(UUID.randomUUID().toString());
    }

    Map<String, Todo> userTodo = getTodoMap(user);
    userTodo.put(body.getId(), body);

    return getTodoList(userTodo);
  }

  @Override
  public List<Todo> listTodos(String user) {
    return getTodoList(getTodoMap(user));
  }

  @Override
  public void removeAllTodos(String user) {
    getTodoMap(user).clear();
  }

  @Override
  public List<Todo> removeTodo(String user, String id) {
    Map<String, Todo> userTodo = getTodoMap(user);
    userTodo.remove(id);
    return getTodoList(userTodo);
  }

  @Override
  public List<Todo> resolveTodo(String id, String user) {
    Map<String, Todo> userTodo = getTodoMap(user);

    Todo todo = userTodo.get(id);

    if (todo == null) {
      throw new NotFoundException();
    }

    todo.setResolved(true);

    return getTodoList(userTodo);
  }
}

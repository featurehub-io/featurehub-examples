package todo.backend.resources;

import io.featurehub.client.ClientContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import todo.Features;
import todo.api.TodoService;
import todo.backend.FeatureHub;
import todo.model.Todo;

import javax.inject.Inject;
import javax.inject.Singleton;
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
  private final FeatureHub featureHub;

  @Inject
  public TodoResource(FeatureHub featureHub) {
    this.featureHub = featureHub;
    log.info("created");
  }

  private Map<String, Todo> getTodoMap(String user) {
    return todos.computeIfAbsent(user, (key) -> new ConcurrentHashMap<>());
  }

  // ideally we wouldn't do it this way, but this is the API, the user is in the url
  // rather than in the Authorisation token. If it was in the token we would do the context
  // creation in a filter and inject the context instead
  private List<Todo> getTodoList(Map<String, Todo> todos, String user) {
    ClientContext ctx = ctx(user);

    if (ctx != null && ctx.feature(Features.FEATURE_TITLE_TO_UPPERCASE).isEnabled()) {
      ctx.logAnalyticsEvent("list-by-uppercase");
      return todos.values().stream().map(t -> t.copy().title(t.getTitle().toUpperCase())).collect(Collectors.toList());
    }

    if (ctx != null) {
      ctx.logAnalyticsEvent("list-by-mixedcase");
    }

    return new ArrayList<Todo>(todos.values());
  }

  private ClientContext ctx(String user) {
    try {
      return featureHub.newContext().userKey(user).build().get();
    } catch (Exception e) {
      log.error("Unable to get context!");
    }

    return null;
  }

  @Override
  public List<Todo> addTodo(String user, Todo body) {
    if (body.getId() == null) {
      body.id(UUID.randomUUID().toString());
    }

    Map<String, Todo> userTodo = getTodoMap(user);
    userTodo.put(body.getId(), body);

    return getTodoList(userTodo, user);
  }

  @Override
  public List<Todo> listTodos(String user) {
    return getTodoList(getTodoMap(user), user);
  }

  @Override
  public void removeAllTodos(String user) {
    getTodoMap(user).clear();
  }

  @Override
  public List<Todo> removeTodo(String user, String id) {
    Map<String, Todo> userTodo = getTodoMap(user);
    userTodo.remove(id);
    return getTodoList(userTodo, user);
  }

  @Override
  public List<Todo> resolveTodo(String id, String user) {
    Map<String, Todo> userTodo = getTodoMap(user);

    Todo todo = userTodo.get(id);

    if (todo == null) {
      throw new NotFoundException();
    }

    todo.setResolved(true);

    return getTodoList(userTodo, user);
  }
}

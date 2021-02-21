package io.featurehub.client;

import cd.connect.jersey.common.CommonConfiguration;
import cd.connect.jersey.common.LoggingConfiguration;
import cd.connect.openapi.support.ApiClient;
import io.featurehub.client.jersey.FeatureServiceImpl;
import io.featurehub.client.jersey.JerseyClient;
import io.featurehub.sse.api.FeatureService;
import io.featurehub.sse.model.FeatureStateUpdate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import todo.api.TodoServiceClient;
import todo.api.impl.TodoServiceServiceImpl;
import todo.model.Todo;

import javax.validation.Valid;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import java.util.List;
import java.util.UUID;

public class TodoService implements todo.api.TodoService {
  private static final Logger log = LoggerFactory.getLogger(TodoService.class);
  private final TodoServiceClient client;
  final FeatureRepositoryContext repository;
  private final FeatureService featureService;
  final String sdkRef;

  public static TodoService todoService = new TodoService();

  public TodoService() {
    String edgeUrl = System.getProperty("edge.hostUrl", System.getenv("EDGE_HOST_URL"));
    sdkRef = System.getProperty("edge.sdk", System.getenv("EDGE_SDK"));

    if (edgeUrl == null || sdkRef == null) {
      throw new RuntimeException(
        "Please provide either the system property edge.hostUrl/edge.sdk or EDGE_HOST_URL/EDGE_SDK " +
        "environment variable");
    }

    if (!edgeUrl.endsWith("/")) {
      edgeUrl += "/";
    }

    repository = new ClientFeatureRepository(2);
    new JerseyClient(new EdgeFeatureHubConfig(edgeUrl, sdkRef), repository);

    System.out.println(edgeUrl + "features/" + sdkRef);
    log.info("update sdkurl is {}", edgeUrl + "features/" + sdkRef);

    final Client jerseyBuilder = ClientBuilder.newBuilder()
      .register(CommonConfiguration.class)
      .register(LoggingConfiguration.class)
      .build();

    featureService = new FeatureServiceImpl(new ApiClient(jerseyBuilder, edgeUrl + "features"));

    String url = System.getProperty("todo.url", "http://localhost:8099");

    if (!url.endsWith("/")) {
      url += "/";
    }

    client = new TodoServiceServiceImpl(new ApiClient(jerseyBuilder, url));
  }

  public FeatureRepository getRepository() {
    return repository;
  }

  public void setFeatureState(String key, FeatureStateUpdate update) {
    featureService.setFeatureState(sdkRef, key, update);
    confirmFeatureState(key, (Boolean)update.getValue());
  }

  @Override
  public List<Todo> addTodo(String user, @Valid Todo todo) {
    todo.setId(UUID.randomUUID().toString());
    return client.addTodo(user, todo);
  }

  @Override
  public List<Todo> listTodos(String user) {
    return client.listTodos(user);
  }

  @Override
  public void removeAllTodos(String user) {
    client.removeAllTodos(user);
  }

  @Override
  public List<Todo> removeTodo(String user, String id) {
    return client.removeTodo(user, id);
  }

  @Override
  public List<Todo> resolveTodo(String id, String user) {
    return client.resolveTodo(id, user);
  }

  public void confirmFeatureState(String key, boolean state) {
    for(int count = 0; count < 10; count ++) {
      if (repository.getReadyness() == Readyness.Ready && repository.getFeatureState(key).getBoolean() == state) {
        return;
      }

      count ++;

      try {
        Thread.sleep(300);
      } catch (InterruptedException ignored) {
      }
    }

    throw new RuntimeException(String.format("Timed out waiting for key `%s` to be %s", key,
      Boolean.toString(state)));
  }
}

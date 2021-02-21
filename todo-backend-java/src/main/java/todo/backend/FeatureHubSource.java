package todo.backend;

import cd.connect.app.config.ConfigKey;
import cd.connect.app.config.DeclaredConfigResolver;
import io.featurehub.client.ClientContext;
import io.featurehub.client.ClientFeatureRepository;
import io.featurehub.client.EdgeFeatureHubConfig;
import io.featurehub.client.EdgeService;
import io.featurehub.client.FeatureRepositoryContext;
import io.featurehub.client.GoogleAnalyticsCollector;
import io.featurehub.client.interceptor.SystemPropertyValueInterceptor;
import io.featurehub.client.jersey.GoogleAnalyticsJerseyApiClient;
import io.featurehub.client.jersey.JerseyClient;

public class FeatureHubSource implements FeatureHub {
  @ConfigKey("feature-service.host")
  String featureHubUrl;
  @ConfigKey("feature-service.api-key")
  String sdkKey;
  @ConfigKey("feature-service.google-analytics-key")
  String analyticsKey = "";
  @ConfigKey("feature-service.cid")
  String analyticsCid = "";

  private final FeatureRepositoryContext repository;
  private final EdgeService edgeService;
  private final EdgeFeatureHubConfig config;

  public FeatureHubSource() {
    DeclaredConfigResolver.resolve(this);

    config = new EdgeFeatureHubConfig(featureHubUrl, sdkKey);

    repository = new ClientFeatureRepository(5);
    repository.registerValueInterceptor(true, new SystemPropertyValueInterceptor());

    if (analyticsCid.length() > 0 && analyticsKey.length() > 0) {
      repository.addAnalyticCollector(new GoogleAnalyticsCollector(analyticsKey, analyticsCid,
        new GoogleAnalyticsJerseyApiClient()));
    }

    edgeService = new JerseyClient(config, repository);
  }

  public ClientContext newContext() {
    return config.newContext(repository, () -> edgeService);
  }

  @Override
  public FeatureRepositoryContext getRepository() {
    return repository;
  }

  @Override
  public EdgeService getEdgeService() {
    return edgeService;
  }
}

package io.featurehub.examples.quarkus;

import io.featurehub.client.ClientContext;
import io.featurehub.client.EdgeFeatureHubConfig;
import io.featurehub.client.FeatureHubConfig;
import io.quarkus.runtime.Startup;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Produces;


/**
 * We do this at the top level because we need a Produces for the FeatureHub config as we specifically want this
 * bean and not have to delegate through, and we need the external config.
 */
@Startup
@ApplicationScoped
public class FeatureSource {
  private static final Logger log = LoggerFactory.getLogger(FeatureSource.class);
  @ConfigProperty(name = "feature-hub.url")
  String url;
  @ConfigProperty(name = "feature-hub.api-key")
  String apiKey;

  /**
   * We need a FeatureHubConfig bean available for all sundry uses, the health check and any other incoming
   * calls. So we create it at startup and seed it into the CDI Context.
   *
   * @return FeatureHubConfig - the config ready for use.
   */
  @Startup
  @Produces
  @ApplicationScoped
  public FeatureHubConfig fhConfig() {
    final EdgeFeatureHubConfig config = new EdgeFeatureHubConfig(url, apiKey);
    config.init();
    log.info("FeatureHub started");
    return config;
  }

  /**
   * This lets us create the ClientContext, which will always be empty, or the AuthFilter will add the user if it
   * discovers it.
   *
   * @param config - the FeatureHub Config
   * @return - a blank context usable by any resource.
   */
  @Produces
  @RequestScoped
  public ClientContext fhClient(FeatureHubConfig config) {
    try {
      return config.newContext().build().get();
    } catch (Exception e) {
      log.error("Cannot create context!", e);
      throw new RuntimeException(e);
    }
  }
}

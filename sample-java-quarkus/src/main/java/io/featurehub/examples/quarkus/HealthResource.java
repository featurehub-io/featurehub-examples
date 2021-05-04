package io.featurehub.examples.quarkus;

import io.featurehub.client.FeatureHubConfig;
import io.featurehub.client.Readyness;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

/**
 * This follows our Java recommendation patterns to return a 503 until you have a connected repository. If the
 * connection to the feature server permanently goes down, this would stop routing traffic to this server.
 */
@Path("/health/liveness")
public class HealthResource {
  private final FeatureHubConfig config;

  @Inject
  public HealthResource(FeatureHubConfig config) {
    this.config = config;
  }

  @GET
  public Response liveness() {
    if (config.getReadyness() == Readyness.Ready) {
      return Response.ok().build();
    }

    return Response.status(503).build();
  }
}

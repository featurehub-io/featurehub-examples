package io.featurehub.examples.quarkus;

import io.featurehub.client.ClientContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.ext.Provider;

/**
 * This filter checks if there is an Authorization header and if so, will add it to the user context
 * (which is mutable) allowing downstream resources to correctly calculate their features.
 *
 */
@Provider
@PreMatching
public class AuthFilter implements ContainerRequestFilter {
  private static final Logger log = LoggerFactory.getLogger(AuthFilter.class);

  @Inject
  javax.inject.Provider<ClientContext> contextProvider;
  
  @Override
  public void filter(ContainerRequestContext req) {
    if (req.getHeaders().containsKey("Authorization")) {
      String user = req.getHeaderString("Authorization");

      log.info("incoming request from user {}", user);

      try {
        contextProvider.get().userKey(user).build().get();
      } catch (Exception e) {
        log.error("Unable to set user key on user");
      }
    } else {
      log.info("request has no user");
    }
  }
}

package io.featurehub.examples.quarkus;

import io.featurehub.client.ClientContext;

import javax.inject.Inject;
import javax.inject.Provider;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/")
public class HelloResource {
  private final Provider<ClientContext> contextProvider;

  @Inject
  public HelloResource(Provider<ClientContext> contextProvider) {
    this.contextProvider = contextProvider;
  }


  @GET
  @Produces(MediaType.TEXT_PLAIN)
  public String hello() {
    return "hello world! " + contextProvider.get().feature("SUBMIT_COLOR_BUTTON").getString();
  }
}

package io.featurehub.examples.springboot;

import io.featurehub.client.ClientContext;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.inject.Provider;

@RestController
public class HelloResource {
  private final Provider<ClientContext> ctxProvider;

  @Inject
  public HelloResource(Provider<ClientContext> ctxProvider) {
    this.ctxProvider = ctxProvider;
  }

  @RequestMapping("/")
  public String index() {
    ClientContext ctx = ctxProvider.get();
    return "Hello World " + ctx.feature("SUBMIT_COLOR_BUTTON").getString();
  }
}

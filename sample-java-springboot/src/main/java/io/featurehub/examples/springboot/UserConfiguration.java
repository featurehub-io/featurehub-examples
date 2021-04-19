package io.featurehub.examples.springboot;

import io.featurehub.client.ClientContext;
import io.featurehub.client.FeatureHubConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import javax.servlet.http.HttpServletRequest;

@Configuration
public class UserConfiguration {
  @Bean
  @Scope("request")
  ClientContext featureHubContext(FeatureHubConfig fhConfig, HttpServletRequest request) {
    ClientContext ctx = fhConfig.newContext();

    if (request.getHeader("Authorization") != null) {
      // you would always authenticate some other way, this is just an example
      ctx.userKey(request.getHeader("Authorization"));
    }

    return ctx;
  }
}

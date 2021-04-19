package io.featurehub.examples.springboot;

import io.featurehub.client.ClientContext;
import io.featurehub.client.EdgeFeatureHubConfig;
import io.featurehub.client.FeatureHubConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Scope;

import javax.servlet.http.HttpServletRequest;

@SpringBootApplication
public class Application {

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

  @Bean
  public FeatureHubConfig featureHubConfig() {
    String host = System.getenv("FEATUREHUB_EDGE_URL");

    if (host == null) {
      throw new RuntimeException("Unable to determine the host for FeatureHub");
    }

    String apiKey = System.getenv("FEATUREHUB_API_KEY");

    if (apiKey == null) {
      throw new RuntimeException("Unable to determine the API key for FeatureHub");
    }

    FeatureHubConfig config = new EdgeFeatureHubConfig(host, apiKey);
    config.init();

    return config;
  }

}

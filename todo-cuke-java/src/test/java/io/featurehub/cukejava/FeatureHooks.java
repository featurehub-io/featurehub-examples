package io.featurehub.cukejava;

import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.featurehub.client.TodoService;
import io.featurehub.sse.model.FeatureStateUpdate;

public class FeatureHooks {
  private static TodoService todoService = TodoService.todoService;

  @Before
  public void featureBeforeHook(Scenario scenario) {
    if (System.getProperty("features.imperative") != null) {
      if (scenario.getSourceTagNames().contains("@FEATURE_TITLE_TO_UPPERCASE_ON")) {
        todoService.setFeatureState("FEATURE_TITLE_TO_UPPERCASE", new FeatureStateUpdate().lock(false).value(true));
      } else if (scenario.getSourceTagNames().contains("@FEATURE_TITLE_TO_UPPERCASE_OFF")) {
        todoService.setFeatureState("FEATURE_TITLE_TO_UPPERCASE", new FeatureStateUpdate().lock(false).value(false));
      }
    } else {
      if (scenario.getSourceTagNames().contains("@FEATURE_TITLE_TO_UPPERCASE_ON")) {
        todoService.confirmFeatureState("FEATURE_TITLE_TO_UPPERCASE", true);
      } else if (scenario.getSourceTagNames().contains("@FEATURE_TITLE_TO_UPPERCASE_OFF")) {
        todoService.confirmFeatureState("FEATURE_TITLE_TO_UPPERCASE", false);
      }
    }

  }
}

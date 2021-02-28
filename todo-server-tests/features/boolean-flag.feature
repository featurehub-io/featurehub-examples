Feature: Checks boolean flag

  @FEATURE_TITLE_TO_UPPERCASE
  Scenario: Check boolean flag on
    # This hook is called before and after the scenario to tidy up the feature state so it doesn't affect other tests
    Given I have a user called "Wilma"
    And I wipe my list of todos
    When I have added a new to-do item "Buy eggs"
    Then my list of todos should contain "BUY EGGS"

  Scenario: Check boolean flag off
    Given I have a user called "Wilma"
    And I wipe my list of todos
    When I have added a new to-do item "Buy eggs"
    Then my list of todos should contain "Buy eggs"

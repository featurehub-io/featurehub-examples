Feature: Checks json feature

  @FEATURE_JSON_BAR
  Scenario: Test json feature value
    Given I have a user called "Wilma"
    And I wipe my list of todos
    When I have added a new to-do item "find"
    Then my list of todos should contain "find bar"

  @FEATURE_JSON_BAZ
  Scenario: Test another json feature value
    Given I have a user called "Wilma"
    And I wipe my list of todos
    When I have added a new to-do item "find"
    Then my list of todos should contain "find baz"

Feature: Checks number feature

  @FEATURE_NUMBER_1
  Scenario: Check a number value
    Given I have a user called "Wilma"
    And I wipe my list of todos
    When I have added a new to-do item "pay"
    Then my list of todos should contain "pay 1"

  @FEATURE_NUMBER_500
  Scenario: Check another number value
    Given I have a user called "Wilma"
    And I wipe my list of todos
    When I have added a new to-do item "pay"
    Then my list of todos should contain "pay 500"

  @FEATURE_NUMBER_NULL
  Scenario: Check null number value
    Given I have a user called "Wilma"
    And I wipe my list of todos
    When I have added a new to-do item "pay"
    Then my list of todos should contain "pay"

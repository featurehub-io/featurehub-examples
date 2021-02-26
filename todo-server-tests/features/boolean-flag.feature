Feature: Checks boolean flag

  @FEATURE_TITLE_TO_UPPERCASE
  Scenario: Add, list and complete features upper case
    Given I have a user called "Wilma"
    And I wipe my list of todos
    When I have added a new to-do item "Buy eggs"
    Then my list of todos should contain "BUY EGGS"

  Scenario: Add, list and complete features mixed case
    Given I have a user called "Wilma"
    And I wipe my list of todos
    When I have added a new to-do item "Buy eggs"
    Then my list of todos should contain "Buy eggs"

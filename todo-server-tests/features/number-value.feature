Feature: Checks number feature

  Scenario: Add, list and complete features upper case
    Given I have a user called "Wilma"
    And I wipe my list of todos
    When I have added a new to-do item "pay $"
    Then my list of todos should contain "pay $251"


Feature: The todo should allow to add, list and complete features when the feature is on

  @FEATURE_TITLE_TO_UPPERCASE_ON
  Scenario: Add, list and complete features upper case
    Given I have a user called "Wilma"
    And I wipe my list of todos
    When I have added a list of todos
      | todo                                 |
      | Buy eggs                             |
      | Find cheapest warm white light bulbs |
      | Organise plumber for garden pump     |
    Then my list of todos should be
      | todo                                 |
      | BUY EGGS                             |
      | FIND CHEAPEST WARM WHITE LIGHT BULBS |
      | ORGANISE PLUMBER FOR GARDEN PUMP     |

Feature: The todo should allow to add, list and complete features when the feature is off

  @FEATURE_TITLE_TO_UPPERCASE_OFF
  Scenario: Add, list and complete features mixed case
    Given I have a user called "Fred"
    And I wipe my list of todos
    When I have added a list of todos
      | todo                                 |
      | Buy eggs                             |
      | Find cheapest warm white light bulbs |
      | Organise plumber for garden pump     |
    Then my list of todos should be
      | todo                                 |
      | Buy eggs                             |
      | Find cheapest warm white light bulbs |
      | Organise plumber for garden pump     |






Feature: The todo should allow to add, list and complete features

  Scenario: Add, list and complete features mixed case
    Given I have a user called "Fred"
    And I wipe my list of todos
    And the feature FEATURE_TITLE_TO_UPPERCASE is off
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

  Scenario: Add, list and complete features upper case
    Given I have a user called "Wilma"
    And I wipe my list of todos
    And the feature FEATURE_TITLE_TO_UPPERCASE is off
    When I have added a list of todos
      | todo                                 |
      | Buy eggs                             |
      | Find cheapest warm white light bulbs |
      | Organise plumber for garden pump     |
    And the feature FEATURE_TITLE_TO_UPPERCASE is on
    Then my list of todos should be
      | todo                                 |
      | BUY EGGS                             |
      | FIND CHEAPEST WARM WHITE LIGHT BULBS |
      | ORGANISE PLUMBER FOR GARDEN PUMP     |




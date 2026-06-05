Feature: SauceDemo common shopper behavior
  Users with the same shopper role should receive the same core application behavior.
  SauceDemo intentionally exposes defects through different usernames, so these
  scenarios are executed as a user matrix in Playwright.

  Background:
    Given the SauceDemo login page is open
    And the shared password is "secret_sauce"

  Scenario Outline: Shopper can open the product catalog within the accepted time
    When I log in as "<username>"
    Then the inventory page should be displayed in less than 3000 ms

    Examples:
      | username                |
      | standard_user           |
      | problem_user            |
      | performance_glitch_user |
      | error_user              |
      | visual_user             |

  Scenario Outline: Shopper sees baseline product prices and images
    When I log in as "<username>"
    Then every product should have the baseline price
    And every product should have a valid unique image

    Examples:
      | username                |
      | standard_user           |
      | problem_user            |
      | performance_glitch_user |
      | error_user              |
      | visual_user             |

  Scenario Outline: Shopper checkout form preserves entered customer data
    Given I am logged in as "<username>"
    When I add "Sauce Labs Backpack" to the cart
    And I start checkout
    And I enter customer information
    Then first name, last name, and postal code should keep the entered values

    Examples:
      | username                |
      | standard_user           |
      | problem_user            |
      | performance_glitch_user |
      | error_user              |
      | visual_user             |

  Scenario Outline: Shopper can complete checkout
    Given I am logged in as "<username>"
    When I add "Sauce Labs Backpack" to the cart
    And I complete checkout with valid customer information
    Then the order confirmation page should be displayed

    Examples:
      | username                |
      | standard_user           |
      | problem_user            |
      | performance_glitch_user |
      | error_user              |
      | visual_user             |

  Scenario: Locked-out user cannot access the catalog
    When I log in as "locked_out_user"
    Then a locked-out error should be displayed
    And the inventory page should not be displayed

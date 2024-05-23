function SelectIssueTypeBug() {
  cy.get('[data-testid="select:type"]').click();
  cy.get('[data-testid="select-option:Bug"]')
    .wait(1000)
    .trigger("mouseover")
    .trigger("click");
}

function SetPriorityLow() {
  cy.get('[data-testid="select:priority"]').click();
  cy.get('[data-testid="select-option:Low"]').click();
}

import { faker } from "@faker-js/faker";

// Variables
const Title = "Bug";
let RndTitle = faker.lorem.word();
const RndDescription = faker.lorem.sentence(7);
const Description = "My bug description";

describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type("TEST_DESCRIPTION");
      cy.get(".ql-editor").should("have.text", "TEST_DESCRIPTION");

      cy.get('input[name="title"]').type("TEST_TITLE");
      cy.get('input[name="title"]').should("have.value", "TEST_TITLE");

      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:story"]').should("be.visible");

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("TEST_TITLE")
          .siblings()
          .within(() => {
            cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
            cy.get('[data-testid="icon:story"]').should("be.visible");
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains("TEST_TITLE")
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
        cy.get('[data-testid="icon:story"]').should("be.visible");
      });
  });

  it("Should validate title is required field if missing", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('button[type="submit"]').click();

      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should(
        "contain",
        "This field is required"
      );
    });
  });

  it("Should create new Issue with all fileds filled", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type(Description);
      cy.get(".ql-editor").should("have.text", Description);

      cy.get('input[name="title"]').type(Title);
      cy.get('input[name="title"]').should("have.value", Title);

      SelectIssueTypeBug();
      cy.get('[data-testid="icon:bug"]').should("be.visible");

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporterId"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");

      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').click();

      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("Bug")
          .siblings()
          .within(() => {
            cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
            cy.get('[data-testid="icon:bug"]').should("be.visible");
          });
      });
  });

  it("Should create new Issue using Faker", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type(RndDescription);
      cy.get(".ql-editor").should("have.text", RndDescription);

      cy.get('input[name="title"]').type(RndTitle);
      cy.get('input[name="title"]').should("have.value", RndTitle);

      cy.get('[data-testid="select:type"]').should("have.text", "Task");

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:reporterId"]').should(
        "have.text",
        "Baby Yoda"
      );

      SetPriorityLow();
      cy.get('[data-testid="icon:arrow-down"]').should("be.visible");

      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains(RndTitle);
      });
  });
});

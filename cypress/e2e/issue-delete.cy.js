//Variables
const ConfirmWindow = '[data-testid="modal:confirm"]';
const TrashIcon = '[data-testid="icon:trash"]';
const IssueDetailView = '[data-testid="modal:issue-details"]';
const IssueTitle = "This is an issue of type: Task.";

// Function
function CloseIssueDetailView() {
  cy.get(".sc-bdVaJa.fuyACr").click();
}

// Assignment 3.
describe("Issue Deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
    cy.get(IssueDetailView).should("be.visible");
  });

  // Test case 1; Deleting issue
  it("Should delete the selected issue", () => {
    cy.get(TrashIcon).click();
    cy.get(ConfirmWindow).should("exist");
    cy.get("button").contains("Delete issue").click();
    cy.get(ConfirmWindow).should("not.exist");
    cy.reload();
    cy.contains(IssueTitle).should("not.exist");
  });

  // Test case 2; Cancel deletion
  it("Should Cancel the delete process", () => {
    cy.get(TrashIcon).click();
    cy.get(ConfirmWindow).should("exist");
    cy.get("button").contains("Cancel").click();
    cy.get(ConfirmWindow).should("not.exist");
    CloseIssueDetailView();
    cy.contains(IssueTitle).should("be.visible");
  });
});

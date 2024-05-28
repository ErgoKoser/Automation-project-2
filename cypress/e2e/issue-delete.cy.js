//Variables
const confirmWindow = '[data-testid="modal:confirm"]';
const trashIcon = '[data-testid="icon:trash"]';
const issueDetailView = '[data-testid="modal:issue-details"]';
const issueTitle = "This is an issue of type: Task.";

// Functions
function closeIssueDetailView() {
  cy.get(".sc-bdVaJa.fuyACr").click();
}
function confirmDeletion() {
  cy.get('[data-testid="modal:confirm"]').within(() => {
    cy.contains("Delete issue").click();
  });
}
function cancelDeletion() {
  cy.get('[data-testid="modal:confirm"]').within(() => {
    cy.contains("Cancel").click();
  });
}

// Assignment 3.
describe("Issue Deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
      });
    cy.get(issueDetailView).should("be.visible");
  });

  // Test case 1; Deleting issue
  it("Should delete the selected issue", () => {
    cy.get(trashIcon).click();
    cy.get(confirmWindow).should("exist");
    confirmDeletion();
    cy.get(confirmWindow).should("not.exist");
    cy.reload();
    cy.contains(issueTitle).should("not.exist");
  });

  // Test case 2; Cancel deletion
  it("Should Cancel the delete process", () => {
    cy.get(trashIcon).click();
    cy.get(confirmWindow).should("exist");
    cancelDeletion();
    cy.get(confirmWindow).should("not.exist");
    closeIssueDetailView();
    cy.contains(issueTitle).should("be.visible");
  });
});

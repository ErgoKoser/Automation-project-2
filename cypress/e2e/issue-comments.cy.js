
import { faker } from "@faker-js/faker";

const myComment = "My test comment for Sprint_2";
const openFirstIssue = () =>
  cy.get('[data-testid="board-list:backlog"]').children().first().click();
const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');
const newCommentOption = () => cy.contains("Add a comment...");
const getCommentTextArea = () =>
  cy.get('textarea[placeholder="Add a comment..."]');
const getIssueComment = () => cy.get('[data-testid="issue-comment"]');
const saveComment = () => cy.contains("button", "Save").click();
const getEditButton = () => cy.contains("Edit");
const getDeleteButton = () => cy.contains("Delete");
const getConfirmDletionButton = () => cy.contains("button", "Delete comment");
const confirmationWindow = '[data-testid="modal:confirm"]';
const rndComment = faker.lorem.sentence(7);

describe("My tests for creating, editing and deleting issue comments", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
              });
              openFirstIssue();
  });

  it("Should create new comment, edit it and then delete it", () => {
    // Enter new comment
    getIssueDetailsModal().within(() => {
      getIssueComment().should("have.length", 1);
      newCommentOption().click();
      getCommentTextArea().type(myComment);
      // Save comment and verify that save button is not visible anymore
      saveComment().should("not.exist");
      // Assert that adding new comment option exists and previously added comment is visible in issue view
      newCommentOption().should("exist");
      getIssueComment()
        .should("have.length", 2)
        .first()
        .should("contain", myComment);
    });

    // Editing comment
    getIssueDetailsModal().within(() => {
      getIssueComment().first();
      // Click edit button and verify that Edit button is not visible after clicking
      getEditButton().click().should("not.exist");
      // Clear previous comment and add new comment
      getCommentTextArea()
        .should("contain", myComment)
        .clear()
        .type(rndComment);
      // Save edited comment and verify that save button is not visible anymore
      saveComment().should("not.exist");
      // Assert that newly edited comment is visible in issue view and previous comment is not
      getIssueComment()
        .should("have.length", 2)
        .first()
        .should("contain", rndComment);
      getIssueComment().contains(myComment).should("not.exist");
    });

    // Deleting comment
    getIssueDetailsModal().within(() => {
      getIssueComment()
        .should("have.length", 2)
        .first()
        .should("contain", rndComment);
      // Click Delete button
      getDeleteButton().click();
    });
      // Verify that confirmation window opens and confirm deletion
      // "Delete comment" button should not be visible after clicking on it
      cy.get(confirmationWindow)
        .should("exist")
        .and("contain.text", "Are you sure you want to delete this comment?");
      getConfirmDletionButton()
        .should("be.visible")
        .click()
        .should("not.exist");
      // Confirm that previously created comment is deleted and not visible in issue view
      getIssueComment().contains(rndComment).should("not.exist");
      getIssueComment().should("have.length", 1);
   
  });
});

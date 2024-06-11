import IssueModal from "../../pages/IssueModal";
import { faker } from "@faker-js/faker";

const estimateTime = 10;
const timeSpentHRS = 5;
const timeRemainingHours = 5;
const rndTimeSpent = faker.number.int({ min: 2, max: 10 });
const rndEstimateTime = faker.number.int({ min: 2, max: 10 });
const rndTitle = faker.word.words(2);
const description = "Description for Sprint_2 Assignment_2";

describe("My tests for Issue time tracking functions", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
        // Create new issue
        getIssueCreate();
        fillDescriptionField();
        fillTitleField();
        SelectIssueTypeBug();
        clikCreateIssue();
        validateIssueIsCreated();
      });
  });

  it("Should add, edit and remove Time estimation ", () => {
    // Add Estimated time to newnly created issue
    IssueModal.openFirstIssue();
    IssueModal.validateEstimateTimeIsNotVisible();
    IssueModal.getOriginalEstimateHours().click().type(estimateTime);
    IssueModal.getOriginalEstimateHours().should("have.value", estimateTime);
    IssueModal.validateEstimatedTimeIsVisible(estimateTime);
    IssueModal.closeDetailModal();

    // Edit Time estimation
    IssueModal.openFirstIssue();
    IssueModal.getOriginalEstimateHours().click().clear().type(rndEstimateTime);
    IssueModal.getOriginalEstimateHours().should("have.value", rndEstimateTime);
    IssueModal.validateEstimatedTimeIsVisible2(rndEstimateTime);
    IssueModal.closeDetailModal();

    // Remove Time Estimation
    IssueModal.openFirstIssue();
    IssueModal.getOriginalEstimateHours().click().clear();
    IssueModal.getOriginalEstimateHours().should("have.value", "");
    IssueModal.closeDetailModal();
    IssueModal.openFirstIssue();
    IssueModal.validateEstimateTimeIsNotVisible();
  });

  it("Should add, edit and remove time from Time tracking ", () => {
    // Log time to Time tracking
    IssueModal.openFirstIssue();
    IssueModal.openTimeTrackingModal();
    IssueModal.getTimeSpentHours().type(timeSpentHRS);
    IssueModal.getTimeRemainingHours().type(timeRemainingHours);
    IssueModal.clickDoneButton();

    /*Assert that Time tracking modal is not open,
    Looged time and Remaining time is visible on issue view*/
    IssueModal.getTimeTrackingModal().should("not.exist");
    cy.reload();
    IssueModal.validateLoggedTimeIsVisible();
    IssueModal.getLoggedTime().should("contain", timeSpentHRS);
    IssueModal.validateRemainigTimeIsVisible();
    IssueModal.getRemainingTime().should("contain", timeRemainingHours);
    IssueModal.closeDetailModal();

    // Edit time tracking Time Spent
    IssueModal.openFirstIssue();
    IssueModal.openTimeTrackingModal();
    IssueModal.getTimeTrackingModal();
    IssueModal.getTimeSpentHours().click().clear().type(rndTimeSpent);
    IssueModal.clickDoneButton();

    /*Assert that Time tracking modal is not open and
    eddited looged time is visible on issue view*/
    IssueModal.getTimeTrackingModal().should("not.exist");
    cy.reload();
    IssueModal.validateLoggedTimeIsVisible();
    IssueModal.getLoggedTime().should("contain", rndTimeSpent);
    IssueModal.closeDetailModal();

    // Delete Time tracking time spent
    IssueModal.openFirstIssue();
    IssueModal.openTimeTrackingModal();
    IssueModal.getTimeTrackingModal();
    IssueModal.getTimeSpentHours().click().clear();
    IssueModal.getTimeRemainingHours().click().clear();
    IssueModal.clickDoneButton();

    /*Assert that Time tracking modal is not open and
    "No time logged" displayed on issue view*/
    IssueModal.getTimeTrackingModal().should("not.exist");
    IssueModal.validateNoTimeLoggedVisible();
    IssueModal.closeDetailModal();
  });
});

const getIssueCreate = () => {
  cy.get('[data-testid="modal:issue-create"]');
};

const fillDescriptionField = () => {
  cy.get(".ql-editor").click().type(description);
};

const fillTitleField = () => {
  cy.get('input[name="title"]').click().type(rndTitle);
};

const clikCreateIssue = () => {
  cy.get('button[type="submit"]').click();
};

function SelectIssueTypeBug() {
  cy.get('[data-testid="select:type"]').click();
  cy.get('[data-testid="select-option:Bug"]')
    .wait(1000)
    .trigger("mouseover")
    .trigger("click");
}
function validateIssueIsCreated() {
  cy.get('[data-testid="modal:issue-create"]').should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");

  cy.reload();
  cy.get('[data-testid="board-list:backlog"]')
    .should("be.visible")
    .and("have.length", "1")
    .within(() => {
      cy.get('[data-testid="list-issue"]')
        .should("have.length", "5")
        .first()
        .find("p")
        .contains(rndTitle);
    });
}

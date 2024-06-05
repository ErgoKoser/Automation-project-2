import { faker } from "@faker-js/faker";

const issueDetailsModal = '[data-testid="modal:issue-details"]';
const originalEstimateHours = 'input[placeholder="Number"]';
const estimateTime = 3;
const openFirstIssue = () =>
  cy.get('[data-testid="board-list:backlog"]').children().first().click();
const timeSpentHours = 4;
const openTimeTrackingModal = () =>
  cy.get('[data-testid="icon:stopwatch"]').click();
const timeTrackingModal = '[data-testid="modal:tracking"]';
const getTimeSpent = () => cy.get('input[placeholder="Number"]').eq(1);
const rndTimeSpent = faker.number.int(2);
const clickDoneButton = () => cy.get("button").contains("Done").click();

describe("My tests for Issue time tracking functions", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        openFirstIssue();
      });
  });

  it("Should add, edit and remove Time estimation ", () => {
    // cy.get('[data-testid="modal:issue-details"]') //.within(() => {

    cy.get(originalEstimateHours)
      .invoke("val")
      .then((value) => {
        const originalValue = value;
        // Log the constants to verify
        cy.log("Original Value:", originalValue);
        //cy.log('Estimate Time:', estimateTime);

        // Add the estimate to the original value
        const newValue = originalValue + estimateTime;

        // Log the new value
        // cy.log('New Value:', newValue);

        cy.get(originalEstimateHours).click().type(estimateTime);
        cy.get(originalEstimateHours).should("have.value", newValue);
        cy.contains("estimated")
          .should("be.visible")
          .and("contain.text", newValue);
      });

    // Edit Time estimation
    cy.get(issueDetailsModal).within(() => {
      cy.get(originalEstimateHours).click().clear().type(estimateTime);
    });
    cy.get(originalEstimateHours).should("have.value", estimateTime);
    cy.contains("estimated")
      .should("be.visible")
      .and("contain.text", estimateTime);

    // Remove Time Estimation
    cy.get(issueDetailsModal).within(() => {
      cy.get(originalEstimateHours).click().clear();
    });
    cy.get(originalEstimateHours).should("have.value", "");
    cy.contains("estimated").should("not.exist");
  });

  it.only("Should add, edit and remove time from Time tracking ", () => {
    // Log time to Time tracking
    //cy.get(issueDetailsModal); 
    openTimeTrackingModal();
    cy.get(timeTrackingModal);
    getTimeSpent().click().type(timeSpentHours);
    clickDoneButton();
        
    //Assert that Time tracking modal is not visible
    cy.get(timeTrackingModal).should("not.exist");
    cy.contains("logged").should("be.visible").and("contain", timeSpentHours);
    

    // Edit time tracking Time Spent
    //cy.get(issueDetailsModal);
    openTimeTrackingModal();
    cy.get(timeTrackingModal);
    getTimeSpent().click().clear().type(rndTimeSpent);
    clickDoneButton();
   
    //Assert that Time tracking modal is not visible
    cy.get(timeTrackingModal).should("not.exist");
    cy.contains("logged").should("be.visible").and("contain", rndTimeSpent);

    // Delete Time tracking time spent
   // cy.get(issueDetailsModal);
    openTimeTrackingModal();
    cy.get(timeTrackingModal);
    getTimeSpent().click().clear();
    clickDoneButton();
  
    //Assert that Time tracking modal is not visible
    cy.get(timeTrackingModal).should("not.exist");
    cy.contains("No time logged").should("be.visible");
  });
});

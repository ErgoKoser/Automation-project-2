import { th } from "@faker-js/faker";

class IssueModal {
  constructor() {
    this.submitButton = 'button[type="submit"]';
    this.issueModal = '[data-testid="modal:issue-create"]';
    this.issueDetailModal = '[data-testid="modal:issue-details"]';
    this.title = 'input[name="title"]';
    this.issueType = '[data-testid="select:type"]';
    this.descriptionField = ".ql-editor";
    this.assignee = '[data-testid="select:userIds"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
    this.issuesList = '[data-testid="list-issue"]';
    this.deleteButton = '[data-testid="icon:trash"]';
    this.deleteButtonName = "Delete issue";
    this.cancelDeletionButtonName = "Cancel";
    this.confirmationPopup = '[data-testid="modal:confirm"]';
    this.closeDetailModalButton = '[data-testid="icon:close"]';
    this.inputNumber = 'input[placeholder="Number"]';
    this.stopWatchIcon = '[data-testid="icon:stopwatch"]';
    this.timeTrackingModal = '[data-testid="modal:tracking"]';
    this.doneButton = "Done";
    this.estimateTime = "estimated";
    this.loggedTime = "logged";
    this.noTimeLogged = "No time logged";
  }

  getIssueModal() {
    return cy.get(this.issueModal);
  }

  getDescriptionField() {
    return cy.get(this.descriptionField);
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailModal);
  }

  getOriginalEstimateHours() {
    return cy.get(this.inputNumber).first();
  }

  getTimeTrackingModal() {
    return cy.get(this.timeTrackingModal);
  }

  getTitle() {
    return cy.get(this.title);
  }

  getLoggedTime() {
    return cy.get(this.issueDetailModal).within(() => {
      cy.contains(this.loggedTime);
    });
  }

  addTimeEstimationToIssue() {
    cy.get(this.inputNumber).first().click().type(estimateTime);
  }

  clickSubmitButton() {
    cy.get(this.submitButton).click();
  }

  selectIssueType(issueType) {
    cy.get(this.issueType).click("bottomRight");
    cy.get(`[data-testid="select-option:${issueType}"]`)
      .trigger("mouseover")
      .trigger("click");
  }

  selectAssignee(assigneeName) {
    cy.get(this.assignee).click("bottomRight");
    cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
  }

  editTitle(title) {
    cy.get(this.title).debounced("type", title);
  }

  editDescription(description) {
    cy.get(this.descriptionField).type(description);
  }

  createIssue(issueDetails) {
    this.getIssueModal().within(() => {
      this.selectIssueType(issueDetails.type);
      this.editDescription(issueDetails.description);
      this.editTitle(issueDetails.title);
      this.selectAssignee(issueDetails.assignee);
      cy.get(this.submitButton).click();
    });
  }

  ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
    cy.get(this.issueModal).should("not.exist");
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get(this.backlogList)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get(this.issuesList)
          .should("have.length", expectedAmountIssues)
          .first()
          .find("p")
          .contains(issueDetails.title);
        cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should(
          "be.visible"
        );
      });
  }

  ensureIssueIsVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    cy.contains(issueTitle).should("be.visible");
  }

  ensureIssueIsNotVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    cy.contains(issueTitle).should("not.exist");
  }

  validateEstimatedTimeIsVisible(estimateTime) {
    cy.contains(this.estimateTime)
      .should("be.visible")
      .should("contain", estimateTime);
  }

  validateEstimatedTimeIsVisible2(rndEstimateTime) {
    cy.contains(this.estimateTime)
      .should("be.visible")
      .should("contain", rndEstimateTime);
  }
  validateEstimateTimeIsNotVisible() {
    cy.get(this.estimateTime).should("not.exist");
  }

  validateLoggedTimeIsVisible() {
    cy.get(this.issueDetailModal).within(() => {
      cy.contains(this.loggedTime).should("be.visible");
    });
  }

  validateNoTimeLoggedVisible() {
    cy.get(this.issueDetailModal).within(() => {
      cy.contains(this.noTimeLogged).should("be.visible");
    });
  }

  validateIssueVisibilityState(issueTitle, isVisible = true) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    cy.get(this.backlogList).should("be.visible");
    if (isVisible) cy.contains(issueTitle).should("be.visible");
    if (!isVisible) cy.contains(issueTitle).should("not.exist");
  }

  clickDeleteButton() {
    cy.get(this.deleteButton).click();
    cy.get(this.confirmationPopup).should("be.visible");
  }

  confirmDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains(this.deleteButtonName).click();
    });
    cy.get(this.confirmationPopup).should("not.exist");
    cy.get(this.backlogList).should("be.visible");
  }

  cancelDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains(this.cancelDeletionButtonName).click();
    });
    cy.get(this.confirmationPopup).should("not.exist");
    cy.get(this.issueDetailModal).should("be.visible");
  }

  closeDetailModal() {
    cy.get(this.issueDetailModal)
      .get(this.closeDetailModalButton)
      .first()
      .click();
    cy.get(this.issueDetailModal).should("not.exist");
  }

  openFirstIssue() {
    cy.get(this.backlogList).children().first().click();
  }

  openTimeTrackingModal() {
    cy.get(this.stopWatchIcon).click();
  }

  getTimeSpentHours() {
    return cy.get(this.inputNumber).eq(1);
  }

  clickDoneButton() {
    cy.get(this.timeTrackingModal).within(() => {
      cy.contains("Done").click();
    });
  }
}

export default new IssueModal();

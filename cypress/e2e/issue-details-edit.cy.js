describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben"
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  it("Should check the options of Priority dropdown", () => {
    getIssueDetailsModal().within(() => {
      cy.get(prioritySelection)
        .invoke("text")
        .then((selectedPriority) => {
          priorities.push(selectedPriority);
          cy.log(`Length of array: ${priorities.length}`);
        });
      cy.get(prioritySelection).click();
      // Loop through each option
      cy.get(selectOptions)
        .each(($el) => {
          cy.wrap($el)
            // Get the text content of the current element
            .invoke("text")
            .then((priorityOption) => {
              // Push the text content into the array
              priorities.push(priorityOption);
              cy.log(`Value added: ${priorityOption}`);
              // Log the current length of the priorities array
              cy.log(`Length of array: ${priorities.length}`);
            });
        })
        .then(() => {
          // Assert the length of the array
          cy.wrap(null).then(() => {
            expect(priorities.length).to.eq(expectedLengthPriority);
            cy.log(`Priorities array: ${priorities}`);
          });
        });
    });
  });

  it("Should check that reporter name has only characters in it", () => {
    getIssueDetailsModal().within(() => {
      cy.get(reporterSelection)
        .invoke("text")
        .then((reporterName) => {
          cy.log(`Reporter name: ${reporterName}`);
          expect(reporterName).to.match(/^[A-Za-z\s]+$/);
        });
      cy.get(reporterSelection).click();
      cy.get(selectOptions).should("be.visible");
      // Loop through each reporter option
      cy.get(selectOptions).each(($el) => {
        // Get the text value of each reporter name
        cy.wrap($el)
          .invoke("text")
          .then((reporterName) => {
            cy.log(`Reporter name: ${reporterName}`);
            //Assert that the reporter name contains only letters and spaces
            expect(reporterName).to.match(/^[A-Za-z\s]+$/);
          });
      });
    });
  });

  it("Should remove unnecessary spaces on the board view", () => {
    // Create New Issue
    closeIssueDetailView();
    openCreateNewIssue();
    getIssueTitle().click().type(unTrimmedTitle);
    clickCreateIssueButton();
    ensureIssueIsCreated();

    // Assert that issu title in the Board view does not contain extra spaces
    cy.get(backloggList)
      .children()
      .first()
      .find("p")
      .invoke("text")
      .should("eq", unTrimmedTitle.trim());
  });
});

const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');
const expectedLengthPriority = 5;
let priorities = [];
const prioritySelection = '[data-testid="select:priority"]';
const selectOptions = '[data-testid^="select-option:"]';
const reporterSelection = '[data-testid="select:reporter"]';
const closeIssueDetailView = () =>
  cy.get('[data-testid="icon:close"]').first().click();
const openCreateNewIssue = () => cy.get('[data-testid="icon:plus"]').click();
const getIssueTitle = () => cy.get('[data-testid="form-field:title"]');
const clickCreateIssueButton = () => cy.get('button[type="submit"]').click();
const unTrimmedTitle = "Untrimmed     Title for    Bonus   Tests";
const backloggList = '[data-testid="board-list:backlog"]';

function ensureIssueIsCreated() {
  cy.get('[data-testid="modal:issue-create"]').should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");
  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");
  cy.get('[data-testid="board-list:backlog"]')
    .should("be.visible")
    .and("have.length", "1")
    .within(() => {
      cy.get('[data-testid="list-issue"]').should("have.length", "5");
    });
}

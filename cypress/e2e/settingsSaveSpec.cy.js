/* eslint-disable no-undef */
describe("Test cookies", () => {
  const cookieName = "savedConfig";
  beforeEach(() => {
    cy.visit("/");
    cy.clearCookie(cookieName).should("be.null");
  });
  it("Generates a cookie", () => {
    cy.reload();
    cy.wait(100);
    cy.getCookie(cookieName).should("exist");
  });
  it("Persists settings", () => {
    cy.reload();
    cy.get(".rs-nav-item").contains("Settings").click();
    cy.get('[data-cy="slaveryModeInput"]').should("not.be.checked");
    cy.get('[data-cy="slaveryModeInput"]').click();
    cy.reload();
    cy.get('[data-cy="slaveryModeInput"]').should("be.checked");
  });
});

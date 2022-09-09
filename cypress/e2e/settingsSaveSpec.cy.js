/* eslint-disable no-undef */
describe("Test cookies", () => {
  const cookieName = "__session";
  it("Generates a cookie", () => {
    cy.visit("/");
    cy.getCookie(cookieName).should("exist");
    // cy.clearCookie(cookieName).should("be.null");
  });
});

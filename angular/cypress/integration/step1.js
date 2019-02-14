/// <reference types="Cypress" />

context('Step1', () => {
  before(() => {
    cy.visit(Cypress.env('url'));
  });

  describe('change to spanish', () => {
    it('page is in spanish', () => {
      cy.get('.group-title').contains('Descripción general');
    });
    it('click on langage changer', () => {
      cy.get('.k-input')
        .contains('Español')
        .click();
    });
    it('click on french', () => {
      cy.get('.k-list')
        .children()
        .contains('Français')
        .click();
    });
    it('page changed to french', () => {
      cy.get('.group-title').contains('Tâches');
    });
  });
});

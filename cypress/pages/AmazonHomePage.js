// cypress/pages/AmazonHomePage.js
class AmazonHomePage {
    elements = {
      searchInput: () => cy.get("#twotabsearchtextbox"),
      searchSuggestions: () => cy.get(".s-suggestion-container"),
      menuAll: () => cy.get("#nav-hamburger-menu"),
      logo: () => cy.get("#nav-logo-sprites")
    };
  
    visit() {
      cy.visit("https://www.amazon.com.br/");
    }
  
    search(text) {
      this.elements.searchInput().type(text);
    }
  
    openMenu() {
      this.elements.menuAll().click();
    }
  }
  
  module.exports = new AmazonHomePage();
  
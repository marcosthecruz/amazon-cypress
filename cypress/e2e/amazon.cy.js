const home = require("../pages/AmazonHomePage");

describe("Amazon Home Page", () => {


    beforeEach(() => {
        home.visit();
    });

    it("TC01 - Deve exibir sugestoes ao digitar 'iphone'", () => {
        home.search("iphone");
        home.elements.searchSuggestions().should("be.visible");
    });

    it("TC02 - Nao deve exibir sugestoes invalidas", () => {
        home.search("@@@");
        home.elements.searchSuggestions().should("not.exist");
    });

    it("TC03 - Menu deve abrir e exibir categorias", () => {
        home.openMenu();
        cy.get(".hmenu-visible").should("exist");
    });

    it("TC04 - Validar responsividade mobile", () => {
        cy.viewport("iphone-x");
        home.visit();
        home.openMenu();
        cy.get(".hmenu-visible").should("exist");
    });

    it("TC05 - Pagina deve carregar em menos de 3s", () => {
        const start = Date.now();
        home.visit();
        cy.window().then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lessThan(3000);
        });
    });
});
# Desafio Amazon – Cypress E2E

Framework de testes E2E com Cypress para validar a home da Amazon Brasil (**autocomplete**, **menu** e **desempenho**). Preparado para rodar no VS Code (macOS).

## Stack
- Node.js + npm
- Cypress (recomendado: `13.13.3`)
- Mochawesome (relatórios)
- Page Objects

## Requisitos
- Node.js (recomendado gerenciar com `nvm`)
- VS Code
- Internet para baixar dependências

## Início rápido

```bash
# 1) Criar projeto
mkdir desafio-amazon-cypress
cd desafio-amazon-cypress
npm init -y

# 2) Instalar Cypress (estável)
npm install cypress@13.13.3 --save-dev

# 3) Estrutura (se necessário)
mkdir -p cypress/{e2e,fixtures,support,pages} reports

# 4) Configuração
# cypress.config.js
cat > cypress.config.js << 'EOF'
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.amazon.com.br",
    setupNodeEvents(on, config) {}
  }
});
EOF

# 5) Suporte
echo "import './commands';" > cypress/support/e2e.js
touch cypress/support/commands.js

# 6) Primeiro teste
cat > cypress/pages/AmazonHomePage.js << 'EOF'
class AmazonHomePage {
  elements = {
    searchInput: () => cy.get('#twotabsearchtextbox'),
    searchSuggestions: () => cy.get('.s-suggestion-container'),
    menuAll: () => cy.get('#nav-hamburger-menu'),
    logo: () => cy.get('#nav-logo-sprites'),
  };

  visit() { cy.visit('/'); }
  search(text) { this.elements.searchInput().type(text); }
  openMenu() { this.elements.menuAll().click(); }
}
module.exports = new AmazonHomePage();
EOF

cat > cypress/e2e/amazon.cy.js << 'EOF'
const home = require('../pages/AmazonHomePage');

describe('Amazon Home Page', () => {
  beforeEach(() => { home.visit(); });

  it("TC01 - Deve exibir sugestões ao digitar 'iphone'", () => {
    home.search('iphone');
    home.elements.searchSuggestions().should('be.visible');
  });

  it('TC02 - Não deve exibir sugestões inválidas', () => {
    home.search('@@@');
    home.elements.searchSuggestions().should('not.exist');
  });

  it('TC03 - Menu deve abrir e exibir categorias', () => {
    home.openMenu();
    cy.get('.hmenu-visible').should('exist');
  });

  it('TC04 - Validar responsividade mobile', () => {
    cy.viewport('iphone-x');
    home.visit();
    home.openMenu();
    cy.get('.hmenu-visible').should('exist');
  });

  it('TC05 - Página deve carregar em menos de 3s', () => {
    const start = Date.now();
    home.visit();
    cy.window().then(() => {
      const duration = Date.now() - start;
      expect(duration).to.be.lessThan(3000);
    });
  });
});
EOF

# 7) Rodar (GUI)
npx cypress open

# 8) Rodar (headed)
npx cypress run --headed --browser chrome
```

## Relatórios (Mochawesome)

Instale:
```bash
npm install mochawesome mochawesome-merge mochawesome-report-generator --save-dev
```

Scripts no `package.json`:
```json
{
  "scripts": {
    "test": "cypress run --reporter mochawesome --reporter-options reportDir=cypress/reports,overwrite=false,html=false,json=true",
    "report:merge": "npx mochawesome-merge 'cypress/reports/*.json' > mochawesome.json",
    "report:html": "npx marge mochawesome.json",
    "report": "npm run test && npm run report:merge && npm run report:html"
  }
}
```

Gerar HTML:
```bash
npm run report
```

## Estrutura

```
desafio-amazon-cypress/
 ┣ cypress/
 ┃ ┣ e2e/
 ┃ ┣ fixtures/
 ┃ ┣ pages/
 ┃ ┗ support/
 ┃    ┣ e2e.js
 ┃    ┗ commands.js
 ┣ reports/
 ┣ cypress.config.js
 ┣ package.json
```

## Troubleshooting

- **Erro `tsx must be loaded with --import instead of --loader` (Node 18.20.3 + Cypress 15.x)**  
  Use `npm install cypress@13.13.3 --save-dev` **ou** `nvm install 18.18.0 && nvm use 18.18.0`.  
  Depois: `npx cypress cache clear && npx cypress install`.

- **`No version of Cypress is installed`**  
  `npx cypress cache clear && npx cypress install && npx cypress verify`.

- **`Your project does not contain a default supportFile`**  
  Crie `cypress/support/e2e.js` e `cypress/support/commands.js`.

- **`zsh: no matches found: cypress/reports/*.json`**  
  Rode o merge com aspas: `npx mochawesome-merge 'cypress/reports/*.json' > mochawesome.json`.

## Licença
Uso livre para estudos.


## TestRail:
https://marcosthecruz.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=tree&display_deleted_cases=0


## 🔹 **Formas de Rodar o Cypress**

### 1. **Modo Interativo (UI)**

```bash
npx cypress open
```

* Abre a interface gráfica do Cypress.
* Permite escolher os testes e executá-los manualmente.
* Útil para debug e desenvolvimento, pois dá para assistir o teste rodando passo a passo.

---

### 2. **Modo Headless (linha de comando)**

```bash
npx cypress run
```

* Executa todos os testes **sem abrir o navegador** (por padrão usa Electron).
* Gera relatórios de execução automaticamente.
* Mais usado em **CI/CD pipelines**.

---

### 3. **Rodar em um Navegador Específico**

```bash
npx cypress run --browser chrome
npx cypress run --browser edge
npx cypress run --browser firefox
```

* Permite escolher qual navegador usar (além do Electron padrão).
* Útil para validar compatibilidade entre browsers.

---

### 4. **Rodar Apenas um Especifico Arquivo de Teste**

```bash
npx cypress run --spec "cypress/e2e/login.cy.js"
```

* Executa somente o(s) arquivo(s) indicado(s).
* Bom para rodar smoke tests ou cenários críticos.

---

### 5. **Rodar Vários Specs via Pattern**

```bash
npx cypress run --spec "cypress/e2e/**/*.cy.js"
```

* Executa testes que seguem um padrão de caminho ou nome.
* Exemplo: rodar apenas testes de regressão ou apenas mobile.

---

### 6. **Rodar em Headed Mode (com navegador visível)**

```bash
npx cypress run --headed
```

* Roda em **headless**, mas mantendo o navegador visível.
* Útil para ver o comportamento do teste em execução sem abrir a UI completa (`cypress open`).

---

### 7. **Rodar em Headless + Headed com Navegador**

```bash
npx cypress run --browser chrome --headed
```

* Combina as opções: executa com um navegador específico e mostra a execução.

---

### 8. **Rodar Testes em Modo CI/CD com Reports**

```bash
npx cypress run --reporter mochawesome
```

* Executa em modo headless, mas gera relatórios customizados (HTML/JSON).
* Essencial para pipelines de QA.

---

### 9. **Rodar com Configurações Customizadas**

```bash
npx cypress run --config viewportWidth=375,viewportHeight=812
```

* Permite alterar configurações direto no comando (ex.: simular iPhone).
* Substitui temporariamente o `cypress.config.js`.

---

### 10. **Rodar com Environment Variables**

```bash
npx cypress run --env ENV=qa,username=admin,password=123
```

* Define variáveis de ambiente para os testes.
* Útil para rodar em diferentes ambientes (QA, Homolog, Prod).

---

### 11. **Rodar em Paralelo (Cypress Cloud ou CI)**

```bash
npx cypress run --record --parallel --key <chave-do-projeto>
```

* Divide os testes em múltiplas máquinas para acelerar a execução.
* Necessita do **Cypress Cloud** ou integração com CI/CD.

---

👉 Resumindo:

* **Desenvolvimento/Debug** → `cypress open`, `--headed`
* **CI/CD** → `cypress run`, `--reporter`, `--env`, `--config`
* **Cross-browser** → `--browser`
* **Escopo específico** → `--spec` ou patterns

---
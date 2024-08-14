import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given(`que un usuario ingresa a la página`, () => {
  cy.log("Esta en el given");
});

When(`en la tabla {string} se ejecuta {string}`, (tableName, consulta) => {
  cy.log("Está en el When");
  cy.task("queryDB", {
    DBname: tableName,
    query: consulta,
  }).then((response) => {
    cy.log(`La BD respondio ${JSON.stringify(response)}`);
  });
});

Then(`se verifica algo`, () => {
  cy.log("Esta en el Then");
});

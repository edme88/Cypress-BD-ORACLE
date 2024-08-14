import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given(`que un usuario ingresa a la página`, () => {
  cy.log("Esta en el given");
});

When(`el usuario hace algo`, () => {
  cy.log("Está en el When");
  cy.task("queryDB", {
    DBname: "nombreTabla",
    query: "select * from tabla where rownum<=20",
  }).then((response) => {
    cy.log(`La BD respondio ${JSON.stringify(response)}`);
  });
});

Then(`se verifica algo`, () => {
  cy.log("Esta en el Then");
});

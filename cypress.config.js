const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const addCucumberPreprocessorPlugin =
  require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;
const createEsbuildPlugin =
  require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;
let oracledb;
try {
  oracledb = require("oracledb");
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
  let clientOpts = {
    libDir: "C:\\JenkinsDrivers\\instantclient_19_12",
  };
  oracledb.initOracleClient(clientOpts);
  //Bajar e instalar - Ver en Readme
  //https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html
} catch (error) {
  console.error("No se pudo importar oracledb module", error.message);
}

module.exports = defineConfig({
  env: {},
  e2e: {
    specPattern: "cypress/e2e/features/**.feature",
    async setupNodeEvents(on, config) {
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });

      on("file:preprocessor", bundler);
      await addCucumberPreprocessorPlugin(on, config);

      //TASK: Codigo para ejecutar funciones de NodeJS
      on("task", {
        deleteFolder(folderName) {
          console.log(`Borrar carpeta: ${folderName}`);
          if (fs.existsSync(folderName)) {
            rmdir(folderName, { maxRetries: 10, recursive: true }, () => {
              return null;
            });
          } else {
            console.log(`La carpeta ${folderName} no existe`);
          }
          return null;
        },
        //Función para BD
        async queryDB({ DBname, query }) {
          let con, DBrespuesta;

          try {
            con = await oracledb.getConnection({
              user: "acaVaTuUser",
              password: "acaVaTuPass",
              connectionString: `acaVaHOST:acaVaPORT/acaVaNombreBD`,
              mode: oracledb.BASIC,
            });

            DBrespuesta = await con.execute(
              "select * from tabla where rownum<=20"
            );
            console.log(`Respuesta BD ${DBrespuesta}`);
          } catch (err) {
            console.error("Error al ejecutar la consulta:");
            DBrespuesta = "Se genero un error";
          } finally {
            if (con) {
              try {
                await con.close();
                console.log("Se cerro la conexión de la DB!");
              } catch (err) {
                console.error("Error al cerrar la conexión:");
              }
            }
            return DBrespuesta;
          }
        },
      });

      return config;
    },
  },
});

const {
  ejecutarSimulacion
} = require("./simulador");

(async () => {

  const resultado =
    await ejecutarSimulacion(
      "casosPromoMasivo.json"
    );

  console.log(resultado);

})();
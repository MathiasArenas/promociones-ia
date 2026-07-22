function crearCaso({
    id,
    idEvento,
    idPromocion,
    nombre,
    descripcion,
    tipo,
    productos,
    resultadoEsperado
}) {

    return {

        id,

        idEvento,

        idPromocion,

        nombre,

        descripcion,

        tipo,

        productos,

        resultadoEsperado

    };

}

module.exports = {

    crearCaso

};
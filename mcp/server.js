const { Server } =
  require("@modelcontextprotocol/sdk/server/index.js");

const {
  StdioServerTransport
} =
  require("@modelcontextprotocol/sdk/server/stdio.js");

const {
  CallToolRequestSchema,
  ListToolsRequestSchema
} =
  require("@modelcontextprotocol/sdk/types.js");

const {
    generarCasos
} = require("./services/casos");

const {
  listarEventos
} = require("./services/eventos");

const {
  obtenerEvento
} = require("./services/evento");

const {
  ejecutarAltaArticulos,
  ejecutarAltaArticulosMasivo
} = require("./simulador");

// ======================================
// CREAR SERVIDOR MCP
// ======================================

const server = new Server(
  {
    name: "mcp-promociones",
    version: "2.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// ======================================
// LISTAR TOOLS
// ======================================

server.setRequestHandler(
  ListToolsRequestSchema,
  async () => ({
    tools: [

      {
  name: "listar_eventos",

  description:
    "Lista los eventos de promociones disponibles en GitHub. Utiliza esta herramienta cuando necesites conocer qué eventos existen antes de consultar uno en detalle.",

  inputSchema: {

    type: "object",

    properties: {

    }

  }

},

// ======================================
// GENERAR CASOS
// ======================================

{
    name: "generar_casos",

    description:
        "Genera casos de prueba para un evento de promociones.",

    inputSchema: {

        type: "object",

        properties: {

            id: {

                type: "integer",

                description:
                    "Identificador del evento."

            }

        },

        required: [
            "id"
        ]

    }

},

// ======================================
// Obtener evento
// ======================================
{
  name: "obtener_evento",

  description:
    "Obtiene el detalle completo de un evento de promociones, incluyendo cabecera, resumen y promociones normalizadas. Utiliza esta herramienta antes de generar casos de prueba.",

  inputSchema: {

    type: "object",

    properties: {

      id: {

        type: "integer",

        description:
          "Identificador del evento."

      }

    },

    required: [
      "id"
    ]

  }

},

      // ======================================
      // ALTA INDIVIDUAL
      // ======================================

      {

        name: "alta_articulos",

        description:
          "Ejecuta Playwright para simular una compra utilizando los productos indicados y validar el comportamiento de una promoción.",

        inputSchema: {

          type: "object",

          properties: {

            productos: {

              type: "array",

              description:
                "Lista de productos.",

              items: {

                type: "object",

                properties: {

                  codigo: {
                    type: "string",
                    description:
                      "Código SKU"
                  },

                  cantidad: {
                    type: "integer",
                    description:
                      "Cantidad"
                  }

                },

                required: [
                  "codigo",
                  "cantidad"
                ]

              }

            },

            modo: {

              type: "string",

              enum: [
                "uno",
                "todos"
              ],

              description:
                "Modo de ejecución."

            },

            cantidadCasos: {

              type: "integer",

              description:
                "Cantidad máxima de casos a ejecutar."

            }

          },

          required: [
            "productos"
          ]

        }

      },

      // ======================================
      // ALTA MASIVA
      // ======================================

      {

        name:
          "alta_articulos_masivo",

        description:
          "Ejecuta Playwright utilizando un archivo JSON que contiene múltiples casos de prueba.",

        inputSchema: {

          type: "object",

          properties: {

            archivo: {

              type: "string",

              description:
                "Archivo JSON."

            }

          },

          required: [
            "archivo"
          ]

        }

      }

    ]

  })
);

// ======================================
// EJECUTAR TOOL
// ======================================

server.setRequestHandler(

  CallToolRequestSchema,

  async (request) => {


    if (
    request.params.name ===
    "listar_eventos"
) {

    const resultado =
        await listarEventos();

    return {

        content: [

            {

                type: "text",

                text: JSON.stringify(
                    resultado,
                    null,
                    2
                )

            }

        ]

    };

}

if (
    request.params.name ===
    "obtener_evento"
) {

    const id =
        request.params.arguments?.id;

    const resultado =
        await obtenerEvento(id);

    return {

        content: [

            {

                type: "text",

                text: JSON.stringify(
                    resultado,
                    null,
                    2
                )

            }

        ]

    };



if (
    request.params.name ===
    "generar_casos"
) {

    const idEvento =
        request.params.arguments?.idEvento;

    const resultado =
        await generarCasos(idEvento);

    return {

        content: [

            {

                type: "text",

                text: JSON.stringify(
                    resultado,
                    null,
                    2
                )

            }

        ]

    };

}


}
    // ======================================
    // ALTA INDIVIDUAL
    // ======================================

    if (
      request.params.name ===
      "alta_articulos"
    ) {

      const productos =
        request.params.arguments?.productos || [];

      const modo =
        request.params.arguments?.modo ||
        "todos";

      const cantidadCasos =
        request.params.arguments?.cantidadCasos ||
        productos.length;

      const resultado =
        await ejecutarAltaArticulos({

          productos,

          modo,

          cantidadCasos

        });

      return {

        content: [

          {

            type: "text",

            text: JSON.stringify(
              resultado,
              null,
              2
            )

          }

        ]

      };

    }

    // ======================================
    // ALTA MASIVA
    // ======================================

    if (
      request.params.name ===
      "alta_articulos_masivo"
    ) {

      const archivo =
        request.params.arguments?.archivo ||
        "casosPromoMasivo.json";

      const resultado =
        await ejecutarAltaArticulosMasivo(
          archivo
        );

      return {

        content: [

          {

            type: "text",

            text: JSON.stringify(
              resultado,
              null,
              2
            )

          }

        ]

      };

    }

    throw new Error(
      `Tool no encontrada: ${request.params.name}`
    );

  }

);

// ======================================
// INICIO
// ======================================

async function main() {

  const transport =
    new StdioServerTransport();

  await server.connect(
    transport
  );

  console.error(
    "MCP iniciado correctamente."
  );

}

main();
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
  ejecutarAltaArticulos,
  ejecutarAltaArticulosMasivo
} = require("./simulador");

// ======================================
// CREAR SERVIDOR MCP
// ======================================

const server = new Server(
  {
    name: "simulador-promociones",
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

      // ======================================
      // ALTA INDIVIDUAL
      // ======================================

      {

        name: "alta_articulos",

        description:
          "Ejecuta Playwright utilizando una lista de productos enviada por el agente.",

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
          "Ejecuta el simulador múltiple utilizando un archivo JSON.",

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
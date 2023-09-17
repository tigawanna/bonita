import {
  ProxifiedModule,
  ProxifiedObject,
  MagicastError,
  parseExpression,
  generateCode,
  Proxified,
} from "magicast";
import { Program, VariableDeclarator } from "./type";

export function getConfigFromVariableDeclaration(
  magicast: ProxifiedModule<any>,
): {
  declaration: VariableDeclarator;
  config: ProxifiedObject<any> | undefined;
} {
  if (magicast.exports.default.$type !== "identifier") {
    throw new MagicastError(
      `Not supported: Cannot modify this kind of default export (${magicast.exports.default.$type})`,
    );
  }

  const configDecalarationId = magicast.exports.default.$name;

  for (const node of (magicast.$ast as Program).body) {
    if (node.type === "VariableDeclaration") {
      for (const declaration of node.declarations) {
        if (
          declaration.id.type === "Identifier" &&
          declaration.id.name === configDecalarationId &&
          declaration.init
        ) {
          const init = declaration.init;  
        // @ts-expect-error
          const configExpression = parseExpression(generateCode(init).code);

          return {
            declaration,
            config: configFromNode(configExpression),
          };
        }
      }
    }
  }
  throw new MagicastError("Couldn't find config declaration");
}

export function getDefaultExportOptions(magicast: ProxifiedModule<any>) {
  return configFromNode(magicast.exports.default);
}

function configFromNode(node: Proxified<any>): ProxifiedObject<any> {
  if (node.$type === "function-call") {
    return node.$args[0];
  }
  return node;
}

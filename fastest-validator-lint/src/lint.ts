import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/typescript-estree";


export const createRule = ESLintUtils.RuleCreator(
  _ =>
    "",
);

function isPrimitiveType (type: AST_NODE_TYPES): boolean {
  switch (type) {
    case AST_NODE_TYPES.TSBooleanKeyword:
    case AST_NODE_TYPES.TSNumberKeyword:
    case AST_NODE_TYPES.TSStringKeyword:
      return true;
    default:
      return false;
  }
}


function isOptionalParam (node: any): boolean {
  return "optional" in node && node.optional === true;
}

export const rule =  createRule({
  name: "validation-decorators",
  meta: {
    type: "suggestion",
    docs: {
      description: "Requires using decorators for strongly type validation",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "code",
    messages: {
      errorMissingSchema:
        "missing Schema decorator.",
      errorMissingTypeValidation:
        "missing validation decorator.",
    },
    schema: [
      {
        type: "object"
      },
    ],
  },
  defaultOptions: [],
  create (context): any  {
    const handleType = (node: any, decoratorName: string, type?: string) =>{
      const prop = node;
      const hasBooleanDecorator = prop?.decorators && prop?.decorators.some((d: any) => d.expression.callee.name === decoratorName);
      if (hasBooleanDecorator){
        return;
      }
      context.report({
        node: prop,
        messageId: "errorMissingSchema",
        fix (fixer) {
          const options = isOptionalParam(prop) ? "optional: true" : "";
          const decoratorParams = (type ? type + (options ? ", " : "") : "") + (options ? `{${options}}` : "");
          return [fixer.insertTextBefore(prop,`@${decoratorName}(${decoratorParams}) `)];
        },
      });
    };

    return {
      ClassDeclaration (node): void{
        const decorators = node.decorators || [];
        const hasSchemaDecorator = decorators.some((d: any) => d.expression.callee.name === "Schema");
        if (hasSchemaDecorator){
          return;
        }
        context.report({
          node: node,
          messageId: "errorMissingTypeValidation",
          fix (fixer) {
            return [fixer.insertTextBefore(node.parent?.type === "ExportNamedDeclaration" ? node.parent as TSESTree.Node: node,
              "@Schema()\n")];
          },
        });
      },
      ClassProperty (node): void{
        const type = node.typeAnnotation?.typeAnnotation?.type;
        if (!type) return;
        if (type === "TSTypeReference")
          handleType(node, "Nested");
        else if (type === "TSArrayType"){
          const t = node.typeAnnotation?.typeAnnotation?.elementType?.typeName?.name;
          handleType( node, t ? "NestedArray" : "Array", t);
        }
        else if (isPrimitiveType(type))
          handleType(node, type.replace("TS","").replace("Keyword", ""));
      }
    };
  },
});

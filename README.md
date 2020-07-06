[![npm](https://img.shields.io/npm/v/fastest-validator-decorators.svg)](https://www.npmjs.com/package/fastest-validator-typescript) 
[![npm](https://img.shields.io/npm/dm/fastest-validator-decorators.svg)](https://www.npmjs.com/package/fastest-validator-typescript) 
[![GitHub issues](https://img.shields.io/github/issues/yantrab/fastest-validator-decorators.svg)](https://github.com/yantrab/fastest-validator-typescript/issues) 

# Fastest Validator Typescript
> Decorators for [fastest-validator](https://github.com/icebob/fastest-validator#readme)

## Setup

Install the package
```
npm install --save fastest-validator-typescript
```
## Example usage

```ts
    @Schema(true)
    class AnotherNestedObject {
      @Number({positive: true, integer: true})
      prop: number;

      get total (): number{return 1;}

    }

    @Schema(true)
    class NestedObject {
      @Nested()
      anotherNested: AnotherNestedObject;
      get total (): number{return 1;}
    }

    @Schema()
    class SomeModel {
      @NestedArray(NestedObject)
      prop: NestedObject[];
      get total (): number{return 1;}
    }
    const t: SomeModel = Object.assign(new SomeModel(), {prop: [{anotherNested: {prop: 1}}]});
    expect(transformAndValidate(t)).toEqual(true);
    expect(t.total).toEqual(1);
    expect(t.prop[0].total).toEqual(1);
    expect(t.prop[0].anotherNested.total).toEqual(1);
```

Add the following to your tsconfig.json
```
"experimentalDecorators": true
"emitDecoratorMetadata": true
```

## Available decorators

All decorators accept an object of options that apply to the type being used, for a full list of options please refer to the fastest-validator [documentation](https://www.npmjs.com/package/fastest-validator).

**@Schema(strict=false, messages={})** - Schema decorator. 

**@Field({})** - Generic decorator, no default properties set. Will apply all options to the schema.

**@String({})** - Applies { type: "string", empty: false }

**@Boolean({})** - Applies { type: "boolean" }

**@Number({})** - Applies { type: "number", convert: true }

**@UUID({})** - Applies { type: "uuid" }

**@ObjectId({})** - Applies { type: "string", pattern: /^[a-f\d]{24}$/i }

**@Email({})** - Applies { type: "email" }

**@Date({})** - Applies { type: "date" }

**@Enum({})** - Applies { type: "enum" }

**@Array({})** - Applies { type: "array" }

**@Nested({})** - Applies { type: "object", props: {} } (The props are gathered from the nested schema)

**@NestedArray(type, {})** - Applies { type: "object", props: {} } (The props are gathered from the nested schema)

## Available methods

**getSchema()** - Returns the fastest-validator schema for a given class

**validate()** - Returns true or fastest-validator errors for a given instance

**transformAndValidate()** - validate and  tranform object.

**transform()** - nested transform object to the ES6 classes

**validateOrReject()** - Returns true or throws fastest-validator errors for a given instance


## ESLint
To force using validation decorators add rule to eslint file (within domain folder).
```
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "fastest-validator"],
  "extends": ["../.eslintrc.json"],
  "rules": {
    "fastest-validator/fastest-validator": "error"
  }
}
```

## License
Licensed under the MIT license.

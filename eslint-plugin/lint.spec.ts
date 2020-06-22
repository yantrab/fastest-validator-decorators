import { TSESLint } from '@typescript-eslint/experimental-utils';
import * as parser from '@typescript-eslint/parser';
import rule from './lint';

describe('Class validation decorators', () => {
  const linter = new TSESLint.Linter();
  linter.defineRule('array-type', rule);
  linter.defineParser('@typescript-eslint/parser', parser);

  it('validation decorators', () => {
    const code =
`
class SomeClass2{}
class SomeClass {
  someBoolProp: boolean;
  someOptionalBollProp?: boolean;
  nestedClass: SomeClass2;
  someNumber: number;
  someString: string;
  someArrayOfString: string[];
  someArrayOfObject: SomeClass2[];
  someArrayOfObjectOptional?: SomeClass2[];
}
`

    const output =
      `
@Schema()
class SomeClass2{}
@Schema()
class SomeClass {
  @Boolean() someBoolProp: boolean;
  @Boolean({optional: true}) someOptionalBollProp?: boolean;
  @Nested() nestedClass: SomeClass2;
  @Number() someNumber: number;
  @String() someString: string;
  @Array() someArrayOfString: string[];
  @NestedArray(SomeClass2) someArrayOfObject: SomeClass2[];
  @NestedArray(SomeClass2, {optional: true}) someArrayOfObjectOptional?: SomeClass2[];
}


`

    const result = linter.verifyAndFix(code, {
        rules: { 'array-type': [2] },
        parser: '@typescript-eslint/parser',
      },
      { fix: true },
    );

    expect(result.messages).toHaveLength(0);
    expect(result.output.trim()).toBe(output.trim());
  });
})

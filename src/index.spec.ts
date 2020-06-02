import {
  validate,
  validateOrReject,
  getSchema,
  Schema,
  Field,
  String,
  Boolean,
  Number,
  UUID,
  ObjectId,
  Email,
  Date,
  Enum,
  Array,
  Nested,
  transform,
  transformAndValidate,
  NestedArray
} from "../src/index";

describe("Schema", () => {

  it("Should default to not strict", () => {
    @Schema()
    class Test {
    }
    expect(getSchema(Test)).toEqual({ $$strict: false });
  });

  it("Should set strict", () => {
    @Schema(true)
    class Test {
    }
    expect(getSchema(Test)).toEqual({ $$strict: true });
  });
});

describe("Field", () => {

  it("Should not apply any defaults", () => {
    @Schema()
    class Test {

      @Field()
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: {} });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Field({ type: "string" })
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "string" } });
  });
});

describe("String", () => {

  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @String()
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "string", empty: false } });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @String({ empty: true })
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "string", empty: true } });
  });
});

describe("Boolean", () => {

  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Boolean()
      prop: boolean;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "boolean" } });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Boolean({ optional: true })
      prop: boolean;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "boolean", optional: true } });
  });
});

describe("Number", () => {

  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Number()
      prop: number;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "number", convert: true } });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Number({convert: false })
      prop: number;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "number", convert: false } });
  });
});

describe("UUID", () => {

  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @UUID()
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "uuid" } });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @UUID({ optional: true })
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "uuid", optional: true } });
  });
});

describe("ObjectId", () => {

  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @ObjectId()
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "string", pattern: expect.any(RegExp) } });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @ObjectId({ optional: true })
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "string", pattern: expect.any(RegExp), optional: true } });
  });
});

describe("Email", () => {

  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Email()
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "email" } });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Email({ optional: true })
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "email", optional: true } });
  });
});

describe("Date", () => {

  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Date()
      prop: Date;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "date" } });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Date({ convert: true })
      prop: Date;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "date", convert: true } });
  });
});

describe("Enum", () => {

  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Enum()
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "enum" } });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Enum({ optional: true })
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "enum", optional: true } });
  });
});

describe("Array", () => {

  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Array()
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "array" } });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Array({ optional: true })
      prop: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "array", optional: true } });
  });
});

describe("Nested", () => {

  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Nested()
      prop: any;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "object", strict: false, props: {} } });
  });

  it("Should apply nested schema", () => {
    @Schema(true)
    class NestedTest {
      @Boolean()
      prop: boolean;
    }
    @Schema()
    class Test {
      @Nested()
      prop: NestedTest;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false, prop: {
        type: "object", strict: true, props: {
          prop: { type: "boolean" }
        }
      }
    });
  });

  it("Should apply nested array schema", () => {
    @Schema(true)
    class AnotherNested {
      @Number({positive: true, integer: true})
      prop: number;
    }

    @Schema(true)
    class NestedTest {
      @Nested()
      anotherNested: AnotherNested;
    }

    @Schema()
    class Test {
      @NestedArray(NestedTest)
      prop: NestedTest[];
    }

    expect(getSchema(Test)).toEqual(
      {
        prop: {
          type: "array",
          strict: true,
          items: { 
            props: {
              anotherNested: {
                props: {
                  prop: {
                    convert: true,
                    positive: true,
                    integer: true,
                    type: "number"
                  }
                }, strict: true, type: "object"
              }
            }, strict: true, type: "object"
          }
        }, $$strict: false
      }
    );
  });

  it("Should not remove nested $$strict", () => {
    @Schema()
    class NestedTest {
      @Boolean()
      prop: boolean;
    }
    @Schema()
    class Test {
      @Nested()
      prop: NestedTest;
    }
    expect(getSchema(NestedTest)).toEqual({
      $$strict: false,
      prop: { "type": "boolean" }
    });
  });
});

describe("validate", () => {

  it("Should throw an error if missing compiled validation method", () => {
    expect(() => validate({})).toThrow();
  });

  it("Should return true when valid", () => {
    @Schema()
    class Test {
      @Email()
      prop: string;
    }
    const t = new Test();
    t.prop = "test@test.com";
    expect(validate(t)).toEqual(true);
  });

  it("Should return validation errors", () => {
    @Schema()
    class Test {
      @Email()
      prop: string;
    }
    const t = new Test();
    t.prop = "invalid";
    expect(validate(t)[0].field).toEqual("prop");
  });
});

describe("validateOrReject", () => {

  it("Should return true when valid", async () => {
    @Schema()
    class Test {
      @Email()
      prop: string;
    }
    const t = new Test();
    t.prop = "test@test.com";
    expect(await validateOrReject(t)).toEqual(true);
  });

  it("Should throw validation errors", async () => {
    @Schema()
    class Test {
      @Email()
      prop: string;
    }
    const t = new Test();
    t.prop = "invalid";
    expect.assertions(1);
    try {
      await validateOrReject(t);
    } catch (e) {
      expect(e[0].field).toEqual("prop");
    }
  });
});

describe("transform", () =>{
  @Schema(true)
  class AnotherNested {
    @Number({positive: true, integer: true})
    prop: number;

    get total (): number{return 1;}

  }

  @Schema(true)
  class NestedTest {
    @Nested()
    anotherNested: AnotherNested;
    get total (): number{return 1;}
  }

  @Schema()
  class Test {
    @NestedArray(NestedTest) prop: NestedTest[];
    get total (): number{return 1;}
  }
  it("Should instantiate object", () => {
    const obj: Test = Object.assign(new Test(), {prop: [{anotherNested: {prop: 1}}]} as Test);
    transform(obj);
    expect(obj.total).toEqual(1);
    expect(obj.prop[0].total).toEqual(1);
    expect(obj.prop[0].anotherNested.total).toEqual(1);
  });
});

describe("transform and validate", () => {

  it("Should return true when valid", () => {
    @Schema(true)
    class AnotherNested {
      @Number({positive: true, integer: true})
      prop: number;

      get total (): number{return 1;}

    }

    @Schema(true)
    class NestedTest {
      @Nested()
      anotherNested: AnotherNested;
      get total (): number{return 1;}
    }

    @Schema()
    class Test {
      @NestedArray(NestedTest)
      prop: NestedTest[];
      get total (): number{return 1;}
    }
    const t: Test = Object.assign(new Test(), {prop: [{anotherNested: {prop: 1}}]} as Test);
    expect(transformAndValidate(t)).toEqual(true);
    expect(t.total).toEqual(1);
    expect(t.prop[0].total).toEqual(1);
    expect(t.prop[0].anotherNested.total).toEqual(1);
  });

  it("Should return validation errors", () => {
    @Schema()
    class Test {
      @Email()
      prop: string;
    }
    const t = new Test();
    t.prop = "invalid";
    expect(transformAndValidate(t)[0].field).toEqual("prop");
  });
});

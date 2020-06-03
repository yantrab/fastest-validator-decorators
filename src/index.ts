import "reflect-metadata";
import FastestValidator, { ValidationError } from "fastest-validator";
import {
  ArrayOptions,
  BooleanOptions,
  DateOptions,
  EmailOptions,
  NumberOptions, Options,
  StringOptions,
  UuidOptions
} from "./interfaces";

const SCHEMA_KEY = Symbol("propertyMetadata");
const TYPE_KEY = Symbol("typeMetadata");
export const validate = (obj: any): true | ValidationError[] => {
  if (!obj._validate) {
    throw new Error("Obj is missing complied validation method");
  }
  const { _validate, _schema, ...data } = obj;
  return _validate(data);
};

export const validateOrReject = async (obj: any): Promise<true | ValidationError[]> => {
  const result = validate(obj);
  if (result !== true) {
    throw result;
  }
  return true;
};

export function getSchema (target: any): any {
  return {...Reflect.getMetadata(SCHEMA_KEY, target.prototype)};
}

const updateSchema = (target: any, key: string | symbol, options: any): void => {
  const s = Reflect.getMetadata(SCHEMA_KEY, target) || {};
  s[key] = options;
  Reflect.defineMetadata(SCHEMA_KEY, {...s}, target);
};

export function Schema (strict = false, messages = {}): any {
  return function _Schema<T extends {new (...args: any[]): {}}>(target: T): any  {
    updateSchema(target.prototype, "$$strict", strict);
    return class extends target {
      _validate: (obj: object) => true | ValidationError[];
      constructor (...args: any[]) {
        super(...args);
        const s = Reflect.getMetadata(SCHEMA_KEY, this) || {};
        const v = new FastestValidator({ messages });
        this._validate = v.compile(s);
        return this;
      }
    };
  };
}

export const decoratorFactory = <T>(mandatory = {}, defaults = {}) => {
  return function (options?: T | T[]): any {
    return (target: any, key: string | symbol): any => {
      updateSchema(target, key, { ...defaults, ...(options || {}), ...mandatory });
    };
  };
};

export const Field = decoratorFactory({}, {});
export const String = decoratorFactory<StringOptions>({ type: "string" }, { empty: false });
export const Boolean = decoratorFactory<BooleanOptions>({ type: "boolean" });
export const Number = decoratorFactory<NumberOptions>({ type: "number" }, { convert: true });
export const UUID = decoratorFactory<UuidOptions>({ type: "uuid" });
export const ObjectId = decoratorFactory<Options>({ type: "string" }, { pattern: /^[a-f\d]{24}$/i });
export const Email = decoratorFactory<EmailOptions>({ type: "email" });
export const Date = decoratorFactory<DateOptions>({ type: "date" });
export const Enum = decoratorFactory<Options>({ type: "enum" });
export const Array = decoratorFactory<ArrayOptions>({ type: "array" });

export function Nested (options?: Options): any {
  return (target: any, key: string): any => {
    const t = Reflect.getMetadata("design:type", target, key);
    Reflect.defineMetadata(TYPE_KEY, t, target, key);
    const props = Object.assign({}, getSchema(t));
    const strict = props.$$strict || false;
    delete props.$$strict;
    updateSchema(target, key, { ...options, props, strict, type: "object" });
  };
}
export function NestedArray (type, options?: Options): any {
  return (target: any, key: string): any => {
    const props = Object.assign({}, getSchema(type));
    const strict = props.$$strict || false;
    delete props.$$strict;
    Reflect.defineMetadata(TYPE_KEY, type, target, key);
    updateSchema(target, key, {type: "array", strict, items: {...options, props, strict, type: "object"}});
  };
}

export function transform (obj): void {
  const schema = getSchema(obj.constructor);
  const props = Object.keys(schema);
  props.forEach(prop =>{
    if (!obj[prop]){
      return;
    }
    if (schema[prop].type === "object"){
      const type = Reflect.getMetadata(TYPE_KEY, obj, prop);
      obj[prop] = Object.assign(new type(obj[prop]), obj[prop]);
      delete obj[prop]._validate;
      transform(obj[prop]);
    }

    if (schema[prop].type === "array"){
      const type = Reflect.getMetadata(TYPE_KEY, obj, prop);
      obj[prop] = obj[prop].map(item => Object.assign(new type(item), item));
      obj[prop].forEach(item => {
        delete item._validate;
        transform(item);
      });
    }
  });
}

export function transformAndValidate (obj): true | ValidationError[] {
  transform(obj);
  return validate(obj);
}

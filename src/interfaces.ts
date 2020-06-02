export interface Options {
  optional?: boolean;
  type?;
}

export interface ArrayOptions extends Options{
  empty?: boolean;
  min?: number;
  max?: number;
  length?: number;
  contains?: Array<any>;
  unique?: boolean;
}
export interface BooleanOptions extends  Options{
  convert?: boolean;
}
export interface StringOptions extends  ArrayOptions{
  pattern?: string;
  alpha?: boolean;
  numeric?: boolean;
  alphanum?: boolean;
  alphadash?: boolean;
  trim?: boolean;
  trimLeft?: boolean;
  trimRight?: boolean;
  hex?: boolean;
  padStart?;
  padEnd?;
  padChar?;
  lowercase?: boolean;
  localeLowercase?: boolean;
  uppercase?: boolean;
  localeUppercase?: boolean;
  convert?: boolean;
}
export interface NumberOptions extends Options{
  min?: number;
  max?: number;
  equal?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
  convert?: boolean;
}
export interface UuidOptions extends Options{
  version?: number;
}

export interface EmailOptions extends Options{
  mode?: "quick" | "precise";
  normalize?: boolean;
}

export interface DateOptions extends Options{
  convert?: boolean;
}


type BaseType = boolean | number | string;
export class UriQueryModel {
  [key: string]: BaseType | Array<BaseType>;
}

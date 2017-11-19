import { is } from './instanceOf';

type BaseType = boolean | number | string;

export interface IUriQueryModel {
  [key: string]: BaseType | Array<BaseType>;
}

export class UriQueryBuilder {
  public model: IUriQueryModel;

  constructor(model?: IUriQueryModel) {
    this.model = model || {};
  }

  public static parse(query: string): UriQueryBuilder {
    const result = new UriQueryBuilder();

    if (query.indexOf('?') > -1) {
      query = query.split('?', 2)[1];
    }
    if (query.indexOf('#') > -1) {
      query = query.split('#', 2)[0];
    }

    for (const keyValue of query.split('&')) {
      const pair = keyValue.split('=', 2).map(x => decodeURIComponent(x));

      let value: BaseType = +pair[1];
      if (isNaN(value)) {
        value = pair[1];
      }

      if (result.model.hasOwnProperty(pair[0])) {
        // is array
        if (is(result.model[pair[0]], Array)) {
          (<Array<BaseType>>result.model[pair[0]]).push(value);
        } else {
          result.model[pair[0]] = <Array<BaseType>>[result.model[pair[0]]];
          (<Array<BaseType>>result.model[pair[0]]).push(value);
        }
      } else {
        result.model[pair[0]] = value;
      }
    }

    return result;
  }

  public toString(): string {
    const keyValueList = [];
    for (const key in this.model) {
      if (!this.model.hasOwnProperty(key)) {
        continue;
      }
      const value = this.model[key];
      if (is(value, Boolean) || is(value, Number) || is(value, String)) {
        keyValueList.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`
        );
      } else if (is(value, Array)) {
        for (const valueItem of <Array<BaseType>>value) {
          keyValueList.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(
              valueItem.toString()
            )}`
          );
        }
      }
    }
    return keyValueList.join('&');
  }
}

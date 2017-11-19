import { IUriQueryModel, UriQueryBuilder } from './uriQueryBuilder';
import { UriSchemaPortList } from './uriSchemaPortList';

// #region Uri Format Regex
const uriRegExp = /^(([^:/?#]+):)\/\/([^/?#]+)(\?([^#]*))?(#(.*))?/;
const uriRegExp_schema = /^(([^:/?#]+):)/;
const uriRegExp_hostPort = /\/\/[^/?#]+/;
const uriRegExp_pathSegments = /(\/[^/?#]*)+/;
const uriRegExp_query = /\?[^#]*/;
const uriRegExp_hash = /#(.*)/;
// #endregion

export interface IUriModel {
  schema: string;
  host: string;
  port: number;
  pathSegments: string[];
  query: IUriQueryModel;
  hash: string;
}

export class UriBuilder implements IUriModel {
  public schema: string;
  public host: string;

  // #region Port
  private _port?: number;
  public get port(): number {
    return this._port || UriSchemaPortList.getPort(this.schema);
  }
  public set port(value: number) {
    this._port = value;
  }
  // #endregion

  public pathSegments: string[];

  public query: IUriQueryModel;
  public hash: string;

  public static isUriFormat(str: string): boolean {
    return uriRegExp.test(str);
  }

  public static updateQuery(uri: string, model: IUriQueryModel): string {
    const builder = UriBuilder.parse(uri);
    for (const key in model) {
      if (!model.hasOwnProperty(key)) {
        continue;
      }
      builder.query[key] = model[key];
    }
    return builder.toString();
  }

  public static parse(uri: string): UriBuilder {
    if (!this.isUriFormat(uri)) {
      throw new Error('URI Format ERROR');
    }

    const result = new UriBuilder();

    result.schema = uri.match(uriRegExp_schema)[0];
    result.schema = result.schema.substring(0, result.schema.length - 1);

    result.host = uri.match(uriRegExp_hostPort)[0].substring(2);
    const hostPortTemp = result.host.split(':', 2);
    result.host = hostPortTemp[0];
    result.port = +hostPortTemp[1];

    result.pathSegments = uri
      .match(uriRegExp_pathSegments)[0]
      .substring(2)
      .split('/')
      .slice(1);

    const queryTemp = uri.match(uriRegExp_query);
    if (
      queryTemp &&
      uri.substring(0, queryTemp.index + 1).indexOf('#') === -1
    ) {
      result.query = UriQueryBuilder.parse(queryTemp[0]).model;
    }

    const hashTemp = uri.match(uriRegExp_hash);
    if (hashTemp) {
      result.hash = hashTemp[0].substring(1);
    }

    return result;
  }

  public toString(): string {
    let result = `${this.schema}://${this.host}`;
    if (!UriSchemaPortList.isDefaultPort(this.schema, this.port)) {
      result += ':' + this.port;
    }

    result += '/';

    if (this.pathSegments && this.pathSegments.length) {
      result += this.pathSegments.join('/');
    }

    if (this.query) {
      const queryTemp = new UriQueryBuilder(this.query).toString();
      if (queryTemp.length) {
        result += '?' + queryTemp;
      }
    }

    if (this.hash && this.hash.length) {
      result += '#' + this.hash;
    }

    return result;
  }
}

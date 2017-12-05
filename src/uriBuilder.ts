import { IUriQueryModel, UriQueryBuilder } from './uriQueryBuilder';
import { UriSchemaPortList } from './uriSchemaPortList';
import { IUriAuthority } from './uriAuthority';

// #region Uri Format Regex
const uriRegExp = /^(([^:/?#]+):)\/\/([^/?#]+)(\?([^#]*))?(#(.*))?/;
const uriRegExp_schema = /^(([^:/?#]+):)/;
const uriRegExp_hostPort = /\/\/[^/?#]+/;
const uriRegExp_pathSegments = /(\/[^/?#]*)+/;
const uriRegExp_query = /\?[^#]*/;
const uriRegExp_fragment = /#(.*)/;
// #endregion

export interface IUriModel {
  schema: string;
  authority?: IUriAuthority;
  host: string;
  port: number;
  pathSegments: string[];
  query: IUriQueryModel;
  fragment: string;
}

export class UriBuilder implements IUriModel {
  public static relative = 'relative';
  public schema: string;

  private _authority: IUriAuthority;
  public get authority(): IUriAuthority {
    return this._authority;
  }

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

  public query: IUriQueryModel = {};
  public fragment: string;

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
      uri = `${UriBuilder.relative}://${uri}`;
      if (!this.isUriFormat(uri)) {
        throw new Error('URI Format ERROR');
      }
    }

    const result = new UriBuilder();

    result.schema = uri.match(uriRegExp_schema)[0];
    result.schema = result.schema.substring(0, result.schema.length - 1);

    result.host = uri.match(uriRegExp_hostPort)[0].substring(2);

    if (result.host.indexOf('@') > -1) {
      // has authority
      let authorityTemp = result.host.split('@', 2);
      result.host = authorityTemp[1];

      authorityTemp = authorityTemp[0].split(':');
      result._authority = {
        user: authorityTemp[0],
        password: authorityTemp[1]
      };
    }

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

    const hashTemp = uri.match(uriRegExp_fragment);
    if (hashTemp) {
      result.fragment = hashTemp[0].substring(1);
    }

    return result;
  }

  public setPath(path: string): void {
    if (path.indexOf('/') === 0) path = path.substring(1);
    this.pathSegments = path.split('/');
  }

  public setAuthority(user: string, password?: string): void {
    if (!this._authority) {
      this._authority = {
        user: undefined
      };
    }
    this._authority.user = user;
    this._authority.password = password;
  }

  public isRelative(): boolean {
    return this.schema === UriBuilder.relative;
  }

  public toString(): string {
    let result = `${this.schema}://`;

    if (this.schema === UriBuilder.relative) {
      result = '';
    }

    if (this.authority && this.authority.user) {
      result += this.authority.user;
      if (this.authority.password) {
        result += ':' + this.authority.password;
      }
      result += '@';
    }
    result += this.host;

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

    if (this.fragment && this.fragment.length) {
      result += '#' + this.fragment;
    }

    return result;
  }
}

import { UriQueryModel } from './uriQueryModel';
import { UriSchemaPortList } from './uriSchemaPortList';

// #region Uri Format Regex
const uriRegExp = /^(([^:/?#]+):)\/\/([^/?#]+)(\?([^#]*))?(#(.*))?/;
const uriRegExp_Schema = /^(([^:/?#]+):)/;
const uriRegExp_HostPort = /\/\/[^/?#]+/;
const uriRegExp_pathSegments = /(\/[^/?#]*)+/;
const uriRegExp_quert = /\?[^#]*/;
const uriRegExp_hash = /#(.*)/;
// #endregion

export class Uri {
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

  public query?: UriQueryModel;
  public hash?: string;

  public static isUriFormat(str: string): boolean {
    return uriRegExp.test(str);
  }
}

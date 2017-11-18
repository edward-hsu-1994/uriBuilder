export class UriSchemaPortList {
  static http: 80;
  static https: 80;

  public static getPort(schema: string): number {
    return this[schema.toLowerCase()];
  }

  public static isDefaultPort(schema: string, port: number): boolean {
    return this.getPort(schema) === port;
  }
}

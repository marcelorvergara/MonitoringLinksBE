import { Pool } from "pg";

export declare global {
  declare module globalThis {
    // global
    var logger: Logger;
    var connection: Pool;
  }
}

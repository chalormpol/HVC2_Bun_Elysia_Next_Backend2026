import "@elysiajs/jwt";

declare module "elysia" {
  interface Context {
    jwt: any;
  }
}

export {};

declare global {
  var importMap: {
    readonly resolve: (specifier: string) => string | null;
  };
}

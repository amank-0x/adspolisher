declare module "*.js" {
  const renderTemplate: (...args: unknown[]) => string;
  export default renderTemplate;
}

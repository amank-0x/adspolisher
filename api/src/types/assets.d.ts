declare module "*.js" {
  const renderTemplate: (...args: string[]) => string;
  export default renderTemplate;
}

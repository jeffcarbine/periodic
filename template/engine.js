import { renderTemplate } from "./renderTemplate.js";

export const enableTemplateEngine = (app) => {
  app.engine("html.js", (filePath, options, callback) => {
    import(filePath)
      .then((obj) => {
        const html = renderTemplate(obj.default(options));
        return callback(null, html);
      })
      .catch((err) => {
        console.error(err);
      });
  });
};

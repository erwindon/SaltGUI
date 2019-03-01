var context = require.context('./', true, /.js$/);
context.keys().forEach(context);
module.exports = context;
const Threadshandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threads',
  register: async (server, {container}) => {
    const threadsHandler = new Threadshandler(container);
    server.route(routes(threadsHandler));
  },
};

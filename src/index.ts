
import './instrument.js'
import { trace } from '@opentelemetry/api';

import Hapi from '@hapi/hapi';

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: "*",
    path: '/',
    handler: () => {
        return JSON.stringify(trace.getActiveSpan()?.spanContext(), null, 2);
    }
})

await server.start();
console.log('Server running on %s', server.info.uri);
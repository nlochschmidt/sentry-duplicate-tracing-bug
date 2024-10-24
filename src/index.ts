
import './instrument.js'
import { trace } from '@opentelemetry/api';

import Hapi from '@hapi/hapi';
import { captureException, getCurrentScope, getIsolationScope, getTraceData } from '@sentry/node';

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: "*",
    path: '/',
    handler: () => {
        const otelSpan = trace.getActiveSpan()?.spanContext();
        const scopeData = getIsolationScope().getScopeData();
        const request = scopeData.sdkProcessingMetadata.request as any
        return JSON.stringify({
            otelSpan,
            transactionName: scopeData.transactionName,
            request: {
                method: request.method,
                url: request.url,
            }
        }, null, 2);
    }
})

await server.start();
console.log('Server running on %s', server.info.uri);
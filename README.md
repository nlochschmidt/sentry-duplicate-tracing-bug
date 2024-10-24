## Sentry/OpenTelemetry example

Attempt to produce a minimal reproducible test case for the duplicate span issue.

see https://github.com/getsentry/sentry-javascript/issues/14065

### Build and run

```
npm install
npm run build
npm run start
```

### Steps to reproduce

Call the server (e.g. `curl http://localhost:3000`)

The response will be the trace and span as seen from inside the handler. Something like this:

```
{
  "traceId": "9dbf48ed9eee5aa66cba36df77eef90b",
  "spanId": "86279d018d1d20f4",
  "traceFlags": 1,
  "traceState": {
    "_internalState": {}
  }
}
```

In the terminal running the server you will see the output from the opentelemetry tracer

### Expected result

After a short time we should see two spans (http and hapi) for the single traceId, somthing like this:

```
{
  resource: {
    attributes: {
      'service.name': 'unknown_service:node',
      'telemetry.sdk.language': 'nodejs',
      'telemetry.sdk.name': 'opentelemetry',
      'telemetry.sdk.version': '1.26.0'
    }
  },
  instrumentationScope: {
    name: '@opentelemetry/instrumentation-hapi',
    version: '0.41.0',
    schemaUrl: undefined
  },
  traceId: '9dbf48ed9eee5aa66cba36df77eef90b',
  parentId: 'bb6216be501f6924',
  traceState: 'sentry.url=http://localhost:3000/,sentry.parent_span_id=',
  name: 'route - /',
  id: '86279d018d1d20f4',
  kind: 0,
  timestamp: 1729702072686000,
  duration: 221.333,
  attributes: {
    'http.route': '/',
    'http.method': '*',
    'hapi.type': 'router',
    'sentry.sample_rate': 1
  },
  status: { code: 0 },
  events: [],
  links: []
}
{
  resource: {
    attributes: {
      'service.name': 'unknown_service:node',
      'telemetry.sdk.language': 'nodejs',
      'telemetry.sdk.name': 'opentelemetry',
      'telemetry.sdk.version': '1.26.0'
    }
  },
  instrumentationScope: {
    name: '@opentelemetry/instrumentation-http',
    version: '0.53.0',
    schemaUrl: undefined
  },
  traceId: '9dbf48ed9eee5aa66cba36df77eef90b',
  parentId: undefined,
  traceState: 'sentry.url=http://localhost:3000/,sentry.parent_span_id=',
  name: 'GET',
  id: 'bb6216be501f6924',
  kind: 1,
  timestamp: 1729702072684000,
  duration: 6057.25,
  attributes: {
    'http.url': 'http://localhost:3000/',
    'http.host': 'localhost:3000',
    'net.host.name': 'localhost',
    'http.method': 'GET',
    'http.scheme': 'http',
    'http.target': '/',
    'http.user_agent': 'curl/8.10.1',
    'http.flavor': '1.1',
    'net.transport': 'ip_tcp',
    'sentry.sample_rate': 1,
    'sentry.parentIsRemote': true,
    'sentry.origin': 'auto.http.otel.http',
    'net.host.ip': '::1',
    'net.host.port': 3000,
    'net.peer.ip': '::1',
    'net.peer.port': 56579,
    'http.status_code': 200,
    'http.status_text': 'OK'
  },
  status: { code: 0 },
  events: [],
  links: []
}

```

### Actual result

However we see a total of three spans and four traces:

```
{
  resource: {
    attributes: {
      'service.name': 'unknown_service:node',
      'telemetry.sdk.language': 'nodejs',
      'telemetry.sdk.name': 'opentelemetry',
      'telemetry.sdk.version': '1.26.0'
    }
  },
  instrumentationScope: {
    name: '@opentelemetry/instrumentation-hapi',
    version: '0.41.0',
    schemaUrl: undefined
  },
  traceId: '9dbf48ed9eee5aa66cba36df77eef90b',
  parentId: 'bb6216be501f6924',
  traceState: 'sentry.url=http://localhost:3000/,sentry.parent_span_id=',
  name: 'route - /',
  id: '86279d018d1d20f4',
  kind: 0,
  timestamp: 1729702072686000,
  duration: 221.333,
  attributes: {
    'http.route': '/',
    'http.method': '*',
    'hapi.type': 'router',
    'sentry.sample_rate': 1
  },
  status: { code: 0 },
  events: [],
  links: []
}
{
  resource: {
    attributes: {
      'service.name': 'unknown_service:node',
      'telemetry.sdk.language': 'nodejs',
      'telemetry.sdk.name': 'opentelemetry',
      'telemetry.sdk.version': '1.26.0'
    }
  },
  instrumentationScope: {
    name: '@opentelemetry/instrumentation-http',
    version: '0.53.0',
    schemaUrl: undefined
  },
  traceId: '04de96dc9304e6376ac87ffa038e53f4',
  parentId: undefined,
  traceState: 'sentry.url=http://localhost:3000/,sentry.parent_span_id=',
  name: 'GET',
  id: 'e68a07918c660533',
  kind: 1,
  timestamp: 1729702072681000,
  duration: 8017.208,
  attributes: {
    'http.url': 'http://localhost:3000/',
    'http.host': 'localhost:3000',
    'net.host.name': 'localhost',
    'http.method': 'GET',
    'http.scheme': 'http',
    'http.target': '/',
    'http.user_agent': 'curl/8.10.1',
    'http.flavor': '1.1',
    'net.transport': 'ip_tcp',
    'sentry.sample_rate': 1,
    'sentry.parentIsRemote': true,
    'net.host.ip': '::1',
    'net.host.port': 3000,
    'net.peer.ip': '::1',
    'net.peer.port': 56579,
    'http.status_code': 200,
    'http.status_text': 'OK'
  },
  status: { code: 0 },
  events: [],
  links: []
}
{
  resource: {
    attributes: {
      'service.name': 'unknown_service:node',
      'telemetry.sdk.language': 'nodejs',
      'telemetry.sdk.name': 'opentelemetry',
      'telemetry.sdk.version': '1.26.0'
    }
  },
  instrumentationScope: {
    name: '@opentelemetry_sentry-patched/instrumentation-http',
    version: '0.53.0',
    schemaUrl: undefined
  },
  traceId: 'e82eb8fe28439cad4cb409199d1759f3',
  parentId: undefined,
  traceState: 'sentry.url=http://localhost:3000/,sentry.parent_span_id=',
  name: 'GET',
  id: '01cf0d4b96a81e61',
  kind: 1,
  timestamp: 1729702072683000,
  duration: 6361.375,
  attributes: {
    'http.url': 'http://localhost:3000/',
    'http.host': 'localhost:3000',
    'net.host.name': 'localhost',
    'http.method': 'GET',
    'http.scheme': 'http',
    'http.target': '/',
    'http.user_agent': 'curl/8.10.1',
    'http.flavor': '1.1',
    'net.transport': 'ip_tcp',
    'sentry.sample_rate': 1,
    'sentry.parentIsRemote': true,
    'sentry.origin': 'auto.http.otel.http',
    'net.host.ip': '::1',
    'net.host.port': 3000,
    'net.peer.ip': '::1',
    'net.peer.port': 56579,
    'http.status_code': 200,
    'http.status_text': 'OK'
  },
  status: { code: 0 },
  events: [],
  links: []
}
{
  resource: {
    attributes: {
      'service.name': 'unknown_service:node',
      'telemetry.sdk.language': 'nodejs',
      'telemetry.sdk.name': 'opentelemetry',
      'telemetry.sdk.version': '1.26.0'
    }
  },
  instrumentationScope: {
    name: '@opentelemetry_sentry-patched/instrumentation-http',
    version: '0.53.0',
    schemaUrl: undefined
  },
  traceId: '9dbf48ed9eee5aa66cba36df77eef90b',
  parentId: undefined,
  traceState: 'sentry.url=http://localhost:3000/,sentry.parent_span_id=',
  name: 'GET',
  id: 'bb6216be501f6924',
  kind: 1,
  timestamp: 1729702072684000,
  duration: 6057.25,
  attributes: {
    'http.url': 'http://localhost:3000/',
    'http.host': 'localhost:3000',
    'net.host.name': 'localhost',
    'http.method': 'GET',
    'http.scheme': 'http',
    'http.target': '/',
    'http.user_agent': 'curl/8.10.1',
    'http.flavor': '1.1',
    'net.transport': 'ip_tcp',
    'sentry.sample_rate': 1,
    'sentry.parentIsRemote': true,
    'sentry.origin': 'auto.http.otel.http',
    'net.host.ip': '::1',
    'net.host.port': 3000,
    'net.peer.ip': '::1',
    'net.peer.port': 56579,
    'http.status_code': 200,
    'http.status_text': 'OK'
  },
  status: { code: 0 },
  events: [],
  links: []
}
```

If I disable Sentry it works as expected.

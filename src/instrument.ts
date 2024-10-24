import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { registerInstrumentations } from "@opentelemetry/instrumentation"
import { BatchSpanProcessor, ConsoleSpanExporter, NodeTracerProvider } from "@opentelemetry/sdk-trace-node"
import * as Sentry from "@sentry/node"
import { SentryPropagator, SentrySampler, SentrySpanProcessor } from "@sentry/opentelemetry"

const sentryClient = Sentry.init({
    dsn: __YOUR_SENTRY_DSN__,
    debug: true,
    tracesSampleRate: 1.0,
    skipOpenTelemetrySetup: true,
})

const provider = new NodeTracerProvider({
    sampler: sentryClient ? new SentrySampler(sentryClient) : undefined
});


provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new SentrySpanProcessor());

provider.register({
    propagator: new SentryPropagator(),
    contextManager: new Sentry.SentryContextManager(),
});

registerInstrumentations({
    instrumentations: getNodeAutoInstrumentations(),
});

Sentry.validateOpenTelemetrySetup()
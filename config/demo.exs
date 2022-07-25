import Config

# Configure your database
config :trento, Trento.Repo,
  username: "postgres",
  password: "postgres",
  database: "trento_dev",
  hostname: "localhost",
  port: 5433,
  show_sensitive_data_on_connection_error: true,
  pool_size: 10,
  log: false

config :trento, Trento.EventStore,
  username: "postgres",
  password: "postgres",
  database: "trento_eventstore_dev",
  hostname: "localhost",
  port: 5433,
  pool_size: 10

config :trento, TrentoWeb.Endpoint,
  http: [ip: {0, 0, 0, 0}, port: 4000],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: "s2ZdE+3+ke1USHEJ5O45KT364KiXPYaB9cJPdH3p60t8yT0nkLexLBNw8TFSzC7k",
  watchers: [
    node: [
      "build.js",
      cd: Path.expand("../assets", __DIR__),
      env: %{"ESBUILD_WATCH" => "true"}
    ],
    npx: [
      "tailwindcss",
      "--input=css/app.css",
      "--output=../priv/static/assets/app.css",
      "--postcss",
      "--watch",
      cd: Path.expand("../assets", __DIR__)
    ]
  ]

config :trento, Trento.Scheduler,
  jobs: [
    publish_telemetry: [
      schedule: {:extended, "@hourly"}
    ],
    clusters_checks_execution: [
      schedule: {:extended, "@hourly"}
    ],
    heartbeat_fake: [
      schedule: {:extended, "*/5"},
      task: {Trento.Heartbeats.Faker, :send_heartbeats},
      run_strategy: {Quantum.RunStrategy.Random, :cluster},
      overlap: false
    ]
  ]

config :trento, Trento.Integration.Telemetry, adapter: Trento.Integration.Telemetry.ToLogger
config :trento, Trento.Integration.Checks, adapter: Trento.Integration.Checks.MockRunner

config :trento, Trento.Integration.Prometheus,
  adapter: Trento.Integration.Prometheus.MockPrometheusApi

config :trento, :extra_children, [Trento.Integration.Checks.MockRunner]

# Do not include metadata nor timestamps in development logs
# config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Initialize plugs at runtime for faster development compilation
config :phoenix, :plug_init_mode, :runtime

config :trento, :api_key_authentication, enabled: false

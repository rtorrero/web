# This configuration file is to be used in the CI to import a DB
# snapshot from an old eventstore to check with cypress e2e test suite

import Config

config :trento, Trento.Integration.Prometheus,
  adapter: Trento.Integration.Prometheus.PrometheusApi

config :trento, Trento.Integration.Prometheus.PrometheusApi, url: "http://localhost:9000"

config :trento,
  api_key_authentication_enabled: false,
  jwt_authentication_enabled: false

config :open_api_spex, :cache_adapter, OpenApiSpex.Plug.NoneCache

config :trento, Trento.Repo,
  username: "postgres",
  password: "postgres",
  database: "trento_test#{System.get_env("REGRESSION_TEST")}",
  hostname: "localhost",
  port: 5433,
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

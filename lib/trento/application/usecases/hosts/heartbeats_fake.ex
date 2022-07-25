defmodule Trento.Heartbeats.Faker do
  @moduledoc """
  Heartbeat faker for demo environment
  """

  def send_heartbeats do
    HTTPoison.post!(
      "http://localhost:4000/hosts/1234/heartbeat",
      {},
      [{"Content-type", "application/json"}]
    )
  end
end

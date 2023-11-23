defmodule Trento.Hosts.Events.HostDeregistrationRequested do
  @moduledoc """
    This event is emitted when a deregistration (decommission) of a host is requested.
  """

  use Trento.Support.Event

  defevent do
    field :host_id, Ecto.UUID
    field :requested_at, :utc_datetime_usec
  end
end

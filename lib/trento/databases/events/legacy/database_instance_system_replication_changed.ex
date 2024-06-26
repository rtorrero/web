defmodule Trento.SapSystems.Events.DatabaseInstanceSystemReplicationChanged do
  @moduledoc """
  This event is emitted when a database instance system replication has changed.
  """

  use Trento.Support.Event

  defevent superseded_by: Trento.Databases.Events.DatabaseInstanceSystemReplicationChanged do
    field :sap_system_id, Ecto.UUID
    field :host_id, Ecto.UUID
    field :instance_number, :string
    field :system_replication, :string
    field :system_replication_status, :string
  end
end

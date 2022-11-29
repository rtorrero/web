defmodule Trento.ClusterReadModel do
  @moduledoc """
  Cluster read model
  """

  use Ecto.Schema

  import Ecto.Changeset

  require Trento.Domain.Enums.Provider, as: Provider
  require Trento.Domain.Enums.ClusterType, as: ClusterType
  require Trento.Domain.Enums.Health, as: Health

  alias Trento.{
    CheckResultReadModel,
    HostChecksExecutionsReadModel
  }

  @type t :: %__MODULE__{}

  @derive {Jason.Encoder, except: [:__meta__, :__struct__]}
  @primary_key {:id, :binary_id, autogenerate: false}
  schema "clusters" do
    field :name, :string, default: ""
    field :sid, :string
    field :provider, Ecto.Enum, values: Provider.values()
    field :type, Ecto.Enum, values: ClusterType.values()
    field :selected_checks, {:array, :string}, default: []
    field :health, Ecto.Enum, values: Health.values()
    field :resources_number, :integer
    field :hosts_number, :integer
    field :details, :map
    field :checks_execution, Ecto.Enum, values: [:not_running, :requested, :running]

    has_many :hosts_executions, HostChecksExecutionsReadModel, foreign_key: :cluster_id
    has_many :checks_results, CheckResultReadModel, foreign_key: :cluster_id
    has_many :tags, Trento.Tag, foreign_key: :resource_id

    # Virtually enriched fields
    field :cib_last_written, :string, virtual: true
  end

  @spec changeset(t() | Ecto.Changeset.t(), map) :: Ecto.Changeset.t()
  def changeset(cluster, attrs) do
    cast(cluster, attrs, __MODULE__.__schema__(:fields))
  end
end
defmodule Trento.HostsTest do
  use ExUnit.Case
  use Trento.DataCase

  import Trento.Factory

  alias Trento.Hosts
  alias Trento.Repo

  alias Trento.SlesSubscriptionReadModel

  @moduletag :integration

  describe "SLES Subscriptions" do
    test "No SLES4SAP Subscriptions detected" do
      assert 0 = SlesSubscriptionReadModel |> Repo.all() |> length()
      assert 0 = Hosts.get_all_sles_subscriptions()
    end

    test "Detects the correct number of SLES4SAP Subscriptions" do
      insert_list(6, :sles_subscription, identifier: "SLES_SAP")
      insert_list(6, :sles_subscription, identifier: "sle-module-server-applications")

      assert 12 = SlesSubscriptionReadModel |> Repo.all() |> length()
      assert 6 = Hosts.get_all_sles_subscriptions()
    end
  end

  describe "Hosts listing" do
    test "should filter unregistered hosts" do
      %{id: host_id} = insert(:host)
      insert(:host, deregistered_at: DateTime.utc_now())

      hosts = Hosts.get_all_hosts()

      assert length(hosts) == 1
      assert [%{id: ^host_id}] = hosts
    end
  end
end

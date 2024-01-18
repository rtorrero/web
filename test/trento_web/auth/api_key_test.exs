defmodule TrentoWeb.ApiKeyTest do
  use ExUnit.Case
  use Trento.DataCase

  alias Trento.Settings

  alias TrentoWeb.Auth.ApiKey

  setup_all do
    %{
      scenarios: [
        %{
          installation_id: "some-installation-id",
          otp25_api_key:
            "SFMyNTY.g2gDdAAAAAFkAA9pbnN0YWxsYXRpb25faWRtAAAAFHNvbWUtaW5zdGFsbGF0aW9uLWlkYQBkAAhpbmZpbml0eQ.1BK6v9h8jw3JVavFvYWjp90PZpOGtLcnys6mSgqcLQM",
          api_key:
            "SFMyNTY.g2gDdAAAAAF3D2luc3RhbGxhdGlvbl9pZG0AAAAUc29tZS1pbnN0YWxsYXRpb24taWRhAHcIaW5maW5pdHk.MjjWMw7hUQ0e8__Ivt21HfQk9mLZ-PfI0DhXqSVbnFA"
        },
        %{
          installation_id: "another-installation-id",
          otp25_api_key:
            "SFMyNTY.g2gDdAAAAAFkAA9pbnN0YWxsYXRpb25faWRtAAAAF2Fub3RoZXItaW5zdGFsbGF0aW9uLWlkYQBkAAhpbmZpbml0eQ.acX8VYHlDyG3lDBiDKgl02nfw-hHnY4gk3040Lxna4c",
          api_key:
            "SFMyNTY.g2gDdAAAAAF3D2luc3RhbGxhdGlvbl9pZG0AAAAXYW5vdGhlci1pbnN0YWxsYXRpb24taWRhAHcIaW5maW5pdHk.gM7LWxBCpWoreWSlWCcCxEMyo39uD3ikVdeobJ-nTmg"
        }
      ]
    }
  end

  describe "Signing data and generating an API key" do
    test "should always generate expected api_key for current installation", %{
      scenarios: scenarios
    } do
      Enum.each(scenarios, fn %{installation_id: installation_id, api_key: expected_api_key} ->
        Enum.each(1..3, fn _ ->
          assert expected_api_key ==
                   ApiKey.sign(%{
                     installation_id: installation_id
                   })
        end)
      end)
    end
  end

  describe "Verifying an API key" do
    test "should reject an unauthenticated API key" do
      assert {:error, :unauthenticated} = ApiKey.verify("definitely-a-fake-api-key")
    end

    test "should verify an authenticated API key encrypted with erlang OTP25 version", %{
      scenarios: scenarios
    } do
      Enum.each(scenarios, fn %{installation_id: installation_id, otp25_api_key: api_key} ->
        assert {:ok,
                %{
                  installation_id: ^installation_id
                }} = ApiKey.verify(api_key)
      end)
    end

    test "should verify an authenticated API key", %{scenarios: scenarios} do
      Enum.each(scenarios, fn %{installation_id: installation_id, api_key: api_key} ->
        assert {:ok,
                %{
                  installation_id: ^installation_id
                }} = ApiKey.verify(api_key)
      end)
    end
  end

  describe "Getting the API key" do
    test "should provide the API key of the current installation" do
      installation_id = Settings.get_installation_id()
      api_key = ApiKey.get_api_key()

      assert {:ok, decoded_data} = ApiKey.verify(api_key)
      assert %{installation_id: ^installation_id} = decoded_data
    end
  end
end

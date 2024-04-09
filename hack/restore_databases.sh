#!/bin/bash
# restore_databases.sh
#
# This script is used to restore the pgsql snapshots that we use from previous trento versions
# to do regression tests. This events will be upcasted to their equivalents in the current version
# by Trento.

PG_DB_URL=postgresql://postgres:postgres@localhost:5433/trento_dev
PG_ES_DB_URL=postgresql://postgres:postgres@localhost:5433/trento_eventstore_dev

# Wait for PostgreSQL to become available
# echo "Waiting for PostgreSQL to start..."
# until pg_isready -h localhost -p 5433 -U postgres; do
#   sleep 1
# done
# echo "PostgreSQL started."

# Create databases
# createdb -h localhost -p 5433 -U postgres trento_dev
# createdb -h localhost -p 5433 -U postgres trento_eventstore_dev


# Restore databases from dump files
# pg_restore -h localhost -p 5433 -U postgres -d trento_dev -c -1 /dumps/trento_dev.dump
# pg_restore -h localhost -p 5433 -U postgres -d trento_eventstore_dev -c -1 /dumps/trento_eventstore_dev.dump

pg_restore -d $PG_DB_URL -c -1 test/fixtures/regression/sap_system_split/trento_dev.dump
pg_restore -d $PG_ES_DB_URL -c -1 test/fixtures/regression/sap_system_split/trento_dev.dump

echo "Database restoration complete."
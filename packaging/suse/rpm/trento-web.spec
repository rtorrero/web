#
# spec file for package trento-web
#
# Copyright (c) 2024 SUSE LLC
#
# All modifications and additions to the file contributed by third parties
# remain the property of their copyright owners, unless otherwise agreed
# upon. The license for this file, and modifications and additions to the
# file, is the same license as for the pristine package itself (unless the
# license for the pristine package is not an Open Source License, in which
# case the license is the MIT License). An "Open Source License" is a
# license that conforms to the Open Source Definition (Version 1.9)
# published by the Open Source Initiative.

# Please submit bugfixes or comments via https://bugs.opensuse.org/
#


Name:           trento-web
Version:        2.2.0 
Release:        0
Summary:        Trento server component
# FIXME: Select a correct license from https://github.com/openSUSE/spec-cleaner#spdx-licenses
License:        Apache-2.0
URL:            https://www.trento-project.io
Source:         https://github.com/trento-project/web/archive/refs/tags/%{version}.tar.gz
Group:          System/Monitoring
BuildRequires:  elixir, elixir-hex, npm16, erlang-rebar3, git-core

%description

%prep
%autosetup -n web

%build
npm run tailwind:build --prefix ./assets
npm run build --prefix ./assets
export LANG=en_US.UTF-8
export LANGUAGE=en_US:en
export LC_ALL=en_US.UTF-8
export MIX_ENV=prod
export MIX_HOME=/usr/bin
export MIX_REBAR3=/usr/bin/rebar3
export MIX_PATH=/usr/lib/elixir/lib/hex/ebin
echo $LANG
mix phx.digest
mix release

%install
mkdir -p %{buildroot}/usr/lib/trento
cp -a _build/prod/rel/trento %{buildroot}/usr/lib
ln -s %{buildroot}/usr/lib/trento/bin/trento

%post
%postun

%files
/usr/lib/trento

%license LICENSE
%doc CHANGELOG.md README.md

%changelog
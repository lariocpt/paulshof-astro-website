#!/bin/sh
# Claude PostToolUse: use the same source rules as the full check.
set -eu
cd "$(CDPATH='' cd -- "$(dirname -- "$0")/../.." && pwd)"
if ! bun scripts/verify-source.mjs; then exit 2; fi

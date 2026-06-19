#!/usr/bin/env bash
set -euo pipefail

# Start the local Jekyll development server in Docker.
#
# Usage:
#   ./scripts/dev.sh
#
# Optional environment variables:
#   JEKYLL_PORT=4001 ./scripts/dev.sh       # expose the site on another port
#   LIVERELOAD_PORT=35730 ./scripts/dev.sh  # expose LiveReload on another port
#   DOCKER_IMAGE=jekyll/jekyll ./scripts/dev.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

JEKYLL_PORT="${JEKYLL_PORT:-4000}"
LIVERELOAD_PORT="${LIVERELOAD_PORT:-35729}"
DOCKER_IMAGE="${DOCKER_IMAGE:-jekyll/jekyll}"

# Keep the container interactive when the script is run from a terminal, but
# still allow it to run in non-interactive shells such as CI or task runners.
tty_args=()
if [[ -t 0 && -t 1 ]]; then
  tty_args=(-it)
fi

echo "Starting Jekyll with Docker..."
echo "Site: http://localhost:${JEKYLL_PORT}"

docker_args=(
  --rm
  "${tty_args[@]}"

  # Mount this repository where the jekyll/jekyll image expects the site.
  --volume="${REPO_ROOT}:/srv/jekyll"

  # Expose the Jekyll site and LiveReload ports to the host.
  --publish "${JEKYLL_PORT}:4000"
  --publish "${LIVERELOAD_PORT}:35729"

  --workdir /srv/jekyll
)

# Install dependencies when needed, then serve the site from inside Docker.
docker run "${docker_args[@]}" "${DOCKER_IMAGE}" \
  /bin/bash -lc "bundle check || bundle install; bundle exec jekyll serve --host 0.0.0.0 --livereload"

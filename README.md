# Website for my personal website

This repository contains the code source to deploy my personal website.

# Development

The development server can be started with Docker by running:

```bash
./scripts/dev.sh
```

The script installs missing dependencies and starts Jekyll with LiveReload.
Once it is running, the site can be accessed from `http://localhost:4000`.

The exposed ports can be changed with environment variables:

```bash
JEKYLL_PORT=4001 LIVERELOAD_PORT=35730 ./scripts/dev.sh
```

The manual Docker commands are:

```bash
docker run --rm \
  --volume="$PWD:/srv/jekyll" \
  --publish 4000:4000 \
  -it jekyll/jekyll \
  /bin/bash
```

Inside the container, the dependencies can be installed as follows:

```
bundle install
bundle exec jekyll serve --host 0.0.0.0 --livereload
```

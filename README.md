# Website for my personal website

This repository contains the code source to deploy my personal website.

# Development

First, a development environment with Docker can be created as follows:

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

Finally, the site can be accessed from `http://localhost:4000/site`.

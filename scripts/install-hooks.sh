#!/bin/sh
#
# Installs the repo's git hooks. Hooks live in .git/hooks, which git does not
# track, so this has to be run once per clone.
#
#   sh scripts/install-hooks.sh

set -e
ROOT=$(git rev-parse --show-toplevel)
HOOK="$ROOT/.git/hooks/pre-commit"

cat > "$HOOK" <<'EOF'
#!/bin/sh
# Blog posts publish themselves on their scheduled date with nobody watching,
# so everything is checked here, before it can reach the repo.

node scripts/validate-posts.js || {
  echo "pre-commit: post validation failed — commit aborted" >&2
  exit 1
}

node scripts/render-check.js || {
  echo "pre-commit: a scheduled post does not render — commit aborted" >&2
  exit 1
}

# Keeps sitemap <lastmod> honest; never blocks a commit on its own.
node scripts/update-sitemap-dates.js || {
  echo "pre-commit: could not update content-dates.json; continuing" >&2
  exit 0
}
git add content-dates.json
exit 0
EOF

chmod +x "$HOOK"
echo "installed pre-commit hook -> $HOOK"

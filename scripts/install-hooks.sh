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
node scripts/update-sitemap-dates.js || {
  echo "pre-commit: could not update content-dates.json; committing without it" >&2
  exit 0
}
git add content-dates.json
exit 0
EOF

chmod +x "$HOOK"
echo "installed pre-commit hook -> $HOOK"

import { execSync } from 'child_process'

let _dateMapCache

/**
 * Build a map of repo-relative path -> last commit date (YYYY-MM-DD) for every
 * file in history, in a SINGLE git process, instead of one `git log` per file.
 * Memoised for the lifetime of the process.
 *
 * git log is reverse-chronological, so the first date seen for a path is its
 * most recent commit — the same value `git log -1 -- <path>` returns. Paths are
 * repo-relative with forward slashes, matching path.relative(repoRoot, file).
 *
 * Note: `git log --name-only` lists no files for merge commits, so content
 * introduced by a conflict-resolving merge is attributed to its source
 * commits. That matches this repo's squash-merge workflow; revisit with
 * `--diff-merges=first-parent` if long-lived branches are ever merged.
 *
 * Returns an empty map — with a warning, since every page then renders without
 * an "Updated" date and the sitemap loses <lastmod> — when git is unavailable
 * or the checkout is shallow (e.g. actions/checkout without fetch-depth: 0,
 * where git log would attribute one identical, wrong date to every file).
 */
export function buildGitDateMap() {
  if (_dateMapCache) return _dateMapCache
  const map = new Map()
  try {
    const shallow = execSync('git rev-parse --is-shallow-repository', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim()
    if (shallow === 'true') {
      console.warn(
        '[git-dates] shallow clone detected — emitting no per-page dates (fetch full history to enable them)'
      )
      _dateMapCache = map
      return map
    }
    // core.quotePath=false keeps non-ASCII paths unquoted so line parsing is safe.
    const out = execSync(
      'git -c core.quotePath=false log --format=%cI --name-only',
      {
        encoding: 'utf-8',
        maxBuffer: 128 * 1024 * 1024,
        stdio: ['pipe', 'pipe', 'ignore'],
      }
    )
    let currentDate = null
    for (const line of out.split('\n')) {
      if (line === '') continue
      if (/^\d{4}-\d{2}-\d{2}T/.test(line)) {
        currentDate = line.slice(0, 10)
        continue
      }
      if (currentDate && !map.has(line)) map.set(line, currentDate)
    }
  } catch (err) {
    console.warn(
      `[git-dates] could not read git history — emitting no per-page dates: ${err.message}`
    )
  }
  _dateMapCache = map
  return map
}

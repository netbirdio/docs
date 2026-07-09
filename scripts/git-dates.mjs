import { execSync } from 'child_process'

/**
 * Get the last modified date for a file from git history.
 * Returns YYYY-MM-DD or null if the file is not tracked / git is unavailable.
 *
 * Prefer buildGitDateMap() when you need dates for many files — this spawns a
 * git process per call, which is ~300x slower across a full page tree.
 */
export function getGitLastModified(filePath) {
  try {
    const date = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim()

    return date ? date.split('T')[0] : null
  } catch {
    return null
  }
}

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
 * Returns an empty map if git is unavailable (e.g. inside the Docker image,
 * which has no git binary) or the checkout is shallow; callers then fall back
 * to no date, exactly as the per-file getGitLastModified() did.
 */
export function buildGitDateMap() {
  if (_dateMapCache) return _dateMapCache
  const map = new Map()
  try {
    // On a shallow clone (e.g. actions/checkout without fetch-depth: 0) git log
    // only sees the fetched commits, so every file would report the same wrong
    // date. Emit no dates rather than wrong ones.
    const shallow = execSync('git rev-parse --is-shallow-repository', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim()
    if (shallow === 'true') {
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
  } catch {
    // git unavailable — return the empty map, callers fall back to null.
  }
  _dateMapCache = map
  return map
}

import { execSync } from 'child_process'

/**
 * Get the last modified date for a file from git history.
 * Returns YYYY-MM-DD or null if the file is not tracked / git is unavailable.
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

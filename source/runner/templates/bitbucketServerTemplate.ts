import { DangerResults } from "../../dsl/DangerResults"
import { Violation } from "../../dsl/Violation"

/**
 * Converts a set of violations into a Markdown table
 *
 * @param {string} name User facing title of table
 * @param {string} emoji Emoji name to show next to each item
 * @param {Violation[]} violations for table
 * @returns {string} HTML
 */
function table(name: string, emoji: string, violations: Violation[]): string {
  if (violations.length === 0 || violations.every(violation => !violation.message)) {
    return ""
  }
  return [
    `|   | ${name}|`,
    `|---|---|`,
    ...violations.map(v => {
      return `| ${emoji} | ${v.message.replace(/\r?\n/g, " ").replace(/<\/?code>/g, "`")} |`
    }),
  ].join("\n")
}

export const dangerIDToString = (id: string) => `danger-id-${id};`

/**
 * Postfix signature to be attached comment generated / updated by danger.
 */
export const dangerSignaturePostfix = `_Generated by 🚫 [dangerJS](http://github.com/danger/danger-js/)_`

/**
 * A template function for creating a GitHub issue comment from Danger Results
 * @param {string} dangerID A string that represents a unique build
 * @param {DangerResults} results Data to work with
 * @returns {string} HTML
 */
export function template(dangerID: string, results: DangerResults): string {
  return `
${table("Fails", "🚫", results.fails)}
${table("Warnings", "⚠", results.warnings)}
${table("Messages", "📖", results.messages)}
${results.markdowns.join("\n\n")}

---
${dangerSignaturePostfix}

[](http://${dangerIDToString(dangerID)})
`
}

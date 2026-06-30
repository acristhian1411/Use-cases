import { bugRepository } from '$lib/server/repositories/bugs.js';
import { moduleRepository } from '$lib/server/repositories/modules.js';
import { testCaseRepository } from '$lib/server/repositories/testCases.js';

export async function load() {
  const [bugs, modules, testCases] = await Promise.all([
    bugRepository.getAll(),
    moduleRepository.getAll(),
    testCaseRepository.getAll()
  ]);

  /** @param {any[]} items @param {string} key */
  const groupBy = (items, key) =>
    items.reduce((acc, item) => {
      const value = item[key] ?? 'sin definir';
      acc[value] = (acc[value] ?? 0) + 1;
      return acc;
    }, /** @type {Record<string, number>} */ ({}));

  const bugsBySeverity = groupBy(bugs, 'severity');
  const bugsByStatus = groupBy(bugs, 'status');
  const testCasesByStatus = groupBy(testCases, 'status');

  const closedStates = ['closed', 'resolved'];
  const openBugs = bugs.filter((b) => !closedStates.includes(b.status)).length;

  return {
    stats: {
      totalModules: modules.length,
      totalTestCases: testCases.length,
      totalBugs: bugs.length,
      openBugs
    },
    bugsBySeverity,
    bugsByStatus,
    testCasesByStatus,
    recentBugs: bugs.slice(0, 6),
    modules
  };
}
export function compareProjects(a, b) {
  const ao = Number(a?.displayOrder);
  const bo = Number(b?.displayOrder);
  const aHas = Number.isFinite(ao);
  const bHas = Number.isFinite(bo);
  if (aHas && bHas && ao !== bo) return ao - bo;
  if (aHas !== bHas) return aHas ? -1 : 1;
  return (Number(b?.id) || 0) - (Number(a?.id) || 0);
}

export function sortProjects(projects) {
  return [...(projects || [])].sort(compareProjects);
}

export function nextTopOrder(projects) {
  const orders = (projects || []).map((project) => Number(project.displayOrder)).filter(Number.isFinite);
  if (!orders.length) return 0;
  return Math.min(...orders) - 1;
}

export function reorderProjectList(projects, fromId, toId) {
  const sorted = sortProjects(projects);
  const from = sorted.findIndex((project) => String(project.id) === String(fromId));
  const to = sorted.findIndex((project) => String(project.id) === String(toId));
  if (from < 0 || to < 0 || from === to) return null;
  const next = [...sorted];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next.map((project, index) => ({ ...project, displayOrder: index + 1 }));
}

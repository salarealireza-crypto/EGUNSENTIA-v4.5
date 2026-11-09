/** Apply partial updates to known people by stable id; never add or position-match identities. */
export function patchExistingByStableId(current, updates) {
  const byId = new Map();
  for (const update of updates ?? []) {
    if (!update || typeof update.id !== "string" || !update.id.trim()) {
      throw new TypeError("A stable person id is required.");
    }
    if (byId.has(update.id)) throw new TypeError("A person may be updated only once per turn.");
    byId.set(update.id, update);
  }
  return current.map((person) => {
    if (!person || typeof person.id !== "string") return person;
    const patch = byId.get(person.id);
    return patch ? { ...person, ...patch } : person;
  });
}

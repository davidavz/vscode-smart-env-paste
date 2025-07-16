export function parseEnvLines(content: string): Record<string, string> {
  const lines = content.split('\n');
  const vars: Record<string, string> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const cleaned = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed;
    const [key, ...rest] = cleaned.split('=');
    if (key && rest.length) {
      vars[key.trim()] = rest.join('=').trim();
    }
  }

  return vars;
}

export function getMissingEnvEntries(
  base: Record<string, string>,
  incoming: Record<string, string>,
): [string, string][] {
  const missing: [string, string][] = [];

  for (const key in incoming) {
    if (!(key in base)) {
      missing.push([key, incoming[key]]);
    }
  }

  return missing;
}

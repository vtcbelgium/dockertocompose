// src/tool.ts

/**
 * Docker Run to Docker Compose Converter
 * Parses `docker run` CLI arguments into a Docker Compose v2 service definition.
 */

export interface ToolResult {
  success: boolean;
  data: string;
  error?: string;
  warnings?: string[];
}

/** Supported docker run flags and their compose mappings */
interface ParsedFlags {
  name?: string;
  image: string;
  command?: string[];
  ports: string[];
  volumes: string[];
  environment: Record<string, string>;
  envFiles: string[];
  restart?: string;
  network?: string;
  entrypoint?: string;
  detach?: boolean;
  rm?: boolean;
  /** Raw unrecognized flags for warnings */
  unrecognized: string[];
}

/**
 * Tokenizes a shell command string respecting quotes and escapes.
 * Does not support all shell features (subshells, vars) but covers typical docker run usage.
 */
export function tokenize(command: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;
  let escape = false;

  for (let i = 0; i < command.length; i++) {
    const ch = command[i];
    if (escape) {
      current += ch;
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }
    if ((ch === ' ' || ch === '\t' || ch === '\n') && !inSingle && !inDouble) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      continue;
    }
    current += ch;
  }
  if (current.length > 0) tokens.push(current);
  return tokens;
}

/**
 * Parses tokenized docker run command into structured flags.
 * Returns ParsedFlags or throws with descriptive error.
 */
export function parseDockerRun(input: string): ParsedFlags {
  const tokens = tokenize(input.trim());
  if (tokens.length === 0) throw new Error('Empty command');

  // Expect first token to be 'docker' and second 'run' (case-insensitive)
  let idx = 0;
  if (tokens[idx].toLowerCase() === 'docker') idx++;
  if (tokens[idx]?.toLowerCase() === 'run') idx++;
  else throw new Error('Expected "docker run" command');

  const flags: ParsedFlags = {
    ports: [],
    volumes: [],
    environment: {},
    envFiles: [],
    unrecognized: [],
    image: '',
  };

  const knownFlags = new Set([
    '-p', '--publish',
    '-v', '--volume',
    '-e', '--env',
    '--name',
    '--restart',
    '--network',
    '--env-file',
    '--entrypoint',
    '-d', '--detach',
    '--rm',
    '--help',
  ]);

  while (idx < tokens.length) {
    const token = tokens[idx];
    // End of flags marker
    if (token === '--') {
      idx++;
      break;
    }
    // Flag starts with '-'
    if (token.startsWith('-')) {
      const flag = token;
      const arg = tokens[idx + 1];
      switch (flag) {
        case '-p':
        case '--publish':
          if (!arg) throw new Error('Missing argument for ' + flag);
          flags.ports.push(arg);
          idx += 2;
          break;
        case '-v':
        case '--volume':
          if (!arg) throw new Error('Missing argument for ' + flag);
          flags.volumes.push(arg);
          idx += 2;
          break;
        case '-e':
        case '--env':
          if (!arg) throw new Error('Missing argument for ' + flag);
          // KEY=VALUE or KEY (value from host env)
          const eqIdx = arg.indexOf('=');
          if (eqIdx > 0) {
            flags.environment[arg.slice(0, eqIdx)] = arg.slice(eqIdx + 1);
          } else {
            // In compose we cannot reference host env directly, so we keep as empty string with warning
            flags.environment[arg] = '';
          }
          idx += 2;
          break;
        case '--name':
          if (!arg) throw new Error('Missing argument for --name');
          flags.name = arg;
          idx += 2;
          break;
        case '--restart':
          if (!arg) throw new Error('Missing argument for --restart');
          flags.restart = arg;
          idx += 2;
          break;
        case '--network':
          if (!arg) throw new Error('Missing argument for --network');
          flags.network = arg;
          idx += 2;
          break;
        case '--env-file':
          if (!arg) throw new Error('Missing argument for --env-file');
          flags.envFiles.push(arg);
          idx += 2;
          break;
        case '--entrypoint':
          if (!arg) throw new Error('Missing argument for --entrypoint');
          flags.entrypoint = arg;
          idx += 2;
          break;
        case '-d':
        case '--detach':
          flags.detach = true;
          idx++;
          break;
        case '--rm':
          flags.rm = true;
          idx++;
          break;
        case '--help':
          idx++;
          break;
        default:
          if (!knownFlags.has(flag)) {
            flags.unrecognized.push(flag);
          }
          // Assume flag takes an argument if next token doesn't start with '-'
          idx++; // don't swallow next token

      }
    } else {
      // Non-flag token: first is image, rest are command
      if (!flags.image) {
        flags.image = token;
        idx++;
      } else {
        // Remaining tokens are the command
        flags.command = tokens.slice(idx);
        break;
      }
    }
  }

  if (!flags.image) throw new Error('Missing image name');
  return flags;
}

/*** Converts parsed flags to Docker Compose v2 YAML string */
export function generateCompose(flags: ParsedFlags): string {
  const lines: string[] = [];
  const indent = '  ';
  const serviceName = flags.name || 'app';
  lines.push('services:');
  lines.push(`${indent}${serviceName}:`);
  lines.push(`${indent}${indent}image: ${flags.image}`);

  if (flags.command && flags.command.length > 0) {
    // YAML flow sequence for command
    const cmdStr = flags.command.map(c => (c.includes(' ') ? `"${c}"` : c)).join(' ');
    lines.push(`${indent}${indent}command: [${cmdStr}]`);
  }

  if (flags.ports.length > 0) {
    lines.push(`${indent}${indent}ports:`);
    for (const p of flags.ports) {
      lines.push(`${indent}${indent}${indent}- "${p}"`);
    }
  }

  if (flags.volumes.length > 0) {
    lines.push(`${indent}${indent}volumes:`);
    for (const v of flags.volumes) {
      lines.push(`${indent}${indent}${indent}- "${v}"`);
    }
  }

  if (Object.keys(flags.environment).length > 0) {
    lines.push(`${indent}${indent}environment:`);
    for (const [k, v] of Object.entries(flags.environment)) {
      if (v === '') {
        lines.push(`${indent}${indent}${indent}${k}: ""  # value from host environment`);
      } else {
        lines.push(`${indent}${indent}${indent}${k}: "${v}"`);
      }
    }
  }

  if (flags.envFiles.length > 0) {
    lines.push(`${indent}${indent}env_file:`);
    for (const f of flags.envFiles) {
      lines.push(`${indent}${indent}${indent}- ${f}`);
    }
  }

  if (flags.restart) {
    lines.push(`${indent}${indent}restart: ${flags.restart}`);
  }

  if (flags.network) {
    lines.push(`${indent}${indent}networks:`);
    lines.push(`${indent}${indent}${indent}- ${flags.network}`);
    // Also define network at top level if not default
    // For simplicity, we assume external network exists.
  }

  if (flags.entrypoint) {
    lines.push(`${indent}${indent}entrypoint: ${flags.entrypoint}`);
  }

  // detach and rm are runtime flags, not compose config. Add as comments.
  if (flags.detach) {
    lines.push(`${indent}${indent}# detach: true (default in compose)`);
  }
  if (flags.rm) {
    lines.push(`${indent}${indent}# rm: true (not supported in compose, container persists)`);
  }

  // Add version header
  return 'version: "3.8"\n' + lines.join('\n');
}

/*** Main orchestrator */
export function processInput(input: string): ToolResult {
  const warnings: string[] = [];
  try {
    const parsed = parseDockerRun(input);
    if (parsed.unrecognized.length > 0) {
      warnings.push(`Unrecognized flags (ignored): ${parsed.unrecognized.join(', ')}`);
    }
    // Check for empty env values
    for (const [k, v] of Object.entries(parsed.environment)) {
      if (v === '') warnings.push(`Environment variable "${k}" has no value (will be empty in compose)`);
    }
    const yaml = generateCompose(parsed);
    return { success: true, data: yaml, warnings: warnings.length ? warnings : undefined };
  } catch (err) {
    return { success: false, data: '', error: err instanceof Error ? err.message : 'Unknown parsing error' };
  }
}


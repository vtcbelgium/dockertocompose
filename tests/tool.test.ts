// tests/tool.test.ts
import { describe, it, expect } from 'vitest';
import { processInput, parseDockerRun, generateCompose, tokenize } from '../src/tool';

describe('tokenize', () => {
  it('splits simple command', () => {
    expect(tokenize('docker run -p 80:80 nginx')).toEqual(['docker', 'run', '-p', '80:80', 'nginx']);
  });
  it('handles quoted arguments', () => {
    expect(tokenize("docker run -e 'FOO=bar baz' nginx")).toEqual(['docker', 'run', '-e', 'FOO=bar baz', 'nginx']);
  });
  it('handles escaped quotes', () => {
    expect(tokenize('docker run -e "FOO=bar\\"baz" nginx')).toEqual(['docker', 'run', '-e', 'FOO=bar"baz', 'nginx']);
  });
});

describe('parseDockerRun', () => {
  it('parses full nginx example', () => {
    const input = 'docker run -d -p 80:80 -p 443:443 --name web --restart unless-stopped -v /host/path:/container/path -e NGINX_HOST=example.com -e NGINX_PORT=80 nginx';
    const parsed = parseDockerRun(input);
    expect(parsed.image).toBe('nginx');
    expect(parsed.name).toBe('web');
    expect(parsed.ports).toEqual(['80:80', '443:443']);
    expect(parsed.volumes).toEqual(['/host/path:/container/path']);
    expect(parsed.environment).toEqual({ NGINX_HOST: 'example.com', NGINX_PORT: '80' });
    expect(parsed.restart).toBe('unless-stopped');
    expect(parsed.detach).toBe(true);
  });
  it('parses command and args after image', () => {
    const parsed = parseDockerRun('docker run ubuntu echo hello world');
    expect(parsed.image).toBe('ubuntu');
    expect(parsed.command).toEqual(['echo', 'hello', 'world']);
  });
  it('throws on missing image', () => {
    expect(() => parseDockerRun('docker run -p 80:80')).toThrow('Missing image name');
  });
  it('collects unrecognized flags as warnings', () => {
    const parsed = parseDockerRun('docker run --unknown-flag nginx');
    expect(parsed.unrecognized).toContain('--unknown-flag');
  });
});

describe('generateCompose', () => {
  it('produces valid YAML for typical service', () => {
    const flags = {
      name: 'web',
      image: 'nginx:latest',
      ports: ['80:80', '443:443'],
      volumes: ['./html:/usr/share/nginx/html:ro'],
      environment: { NGINX_HOST: 'example.com' },
      envFiles: ['.env'],
      restart: 'unless-stopped',
      network: 'frontend',
      entrypoint: '/docker-entrypoint.sh',
      detach: true,
      rm: false,
      unrecognized: [],
      command: undefined,
    };
    const yaml = generateCompose(flags);
    expect(yaml).toContain('version: "3.8"');
    expect(yaml).toContain('services:');
    expect(yaml).toContain('web:');
    expect(yaml).toContain('image: nginx:latest');
    expect(yaml).toContain('ports:');
    expect(yaml).toContain('- "80:80"');
    expect(yaml).toContain('volumes:');
    expect(yaml).toContain('- "./html:/usr/share/nginx/html:ro"');
    expect(yaml).toContain('environment:');
    expect(yaml).toContain('NGINX_HOST: "example.com"');
    expect(yaml).toContain('env_file:');
    expect(yaml).toContain('- .env');
    expect(yaml).toContain('restart: unless-stopped');
    expect(yaml).toContain('networks:');
    expect(yaml).toContain('- frontend');
    expect(yaml).toContain('entrypoint: /docker-entrypoint.sh');
  });
  it('handles empty environment value with comment', () => {
    const flags = { name: 'app', image: 'alpine', ports: [], volumes: [], environment: { FOO: '' }, envFiles: [], unrecognized: [] };
    const yaml = generateCompose(flags);
    expect(yaml).toContain('FOO: ""  # value from host environment');
  });
});

describe('processInput (integration)', () => {
  it('returns success with YAML for valid input', () => {
    const res = processInput('docker run -p 8080:80 --name test nginx');
    expect(res.success).toBe(true);
    expect(res.data).toContain('version: "3.8"');
    expect(res.data).toContain('test:');
    expect(res.data).toContain('image: nginx');
    expect(res.data).toContain('- "8080:80"');
  });
  it('returns error for invalid input', () => {
    const res = processInput('docker run');
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });
  it('includes warnings for unrecognized flags', () => {
    const res = processInput('docker run --foobar nginx');
    expect(res.success).toBe(true);
    expect(res.warnings).toBeDefined();
    expect(res.warnings?.[0]).toContain('--foobar');
  });
});


import { describe, it, expect } from 'vitest';
import { processInput } from '../src/tool';

describe('Real-World Docker to Compose Conversion', () => {
  it('converts Nginx proxy command with ports, volumes, and env', () => {
    const cmd = 'docker run -d -p 80:80 -p 443:443 --name web --restart unless-stopped -v /host/path:/container/path:ro -e NGINX_HOST=example.com -e NGINX_PORT=80 nginx:alpine';
    const res = processInput(cmd);
    expect(res.success).toBe(true);
    expect(res.data).toContain('version: "3.8"');
    expect(res.data).toContain('services:');
    expect(res.data).toContain('web:');
    expect(res.data).toContain('image: nginx:alpine');
    expect(res.data).toContain('- "80:80"');
    expect(res.data).toContain('- "443:443"');
    expect(res.data).toContain('restart: unless-stopped');
    expect(res.data).toContain('NGINX_HOST: "example.com"');
  });

  it('converts PostgreSQL database command with passwords and volume mounts', () => {
    const cmd = 'docker run -d --name postgres-db -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USER=admin -v pgdata:/var/lib/postgresql/data --restart always postgres:15';
    const res = processInput(cmd);
    expect(res.success).toBe(true);
    expect(res.data).toContain('postgres-db:');
    expect(res.data).toContain('image: postgres:15');
    expect(res.data).toContain('- "5432:5432"');
    expect(res.data).toContain('POSTGRES_PASSWORD: "mysecretpassword"');
    expect(res.data).toContain('POSTGRES_USER: "admin"');
    expect(res.data).toContain('- "pgdata:/var/lib/postgresql/data"');
    expect(res.data).toContain('restart: always');
  });

  it('converts Redis cache with custom command arguments', () => {
    const cmd = 'docker run -d --name redis-cache -p 6379:6379 -v redis_data:/data --restart unless-stopped redis:7-alpine redis-server --appendonly yes';
    const res = processInput(cmd);
    expect(res.success).toBe(true);
    expect(res.data).toContain('redis-cache:');
    expect(res.data).toContain('image: redis:7-alpine');
    expect(res.data).toContain('- "6379:6379"');
    expect(res.data).toContain('command: [redis-server --appendonly yes]');
  });

  it('converts WordPress connected to external DB', () => {
    const cmd = 'docker run -d --name wordpress -p 8080:80 -e WORDPRESS_DB_HOST=db -e WORDPRESS_DB_PASSWORD=secret -v wp_data:/var/www/html wordpress:latest';
    const res = processInput(cmd);
    expect(res.success).toBe(true);
    expect(res.data).toContain('wordpress:');
    expect(res.data).toContain('image: wordpress:latest');
    expect(res.data).toContain('- "8080:80"');
    expect(res.data).toContain('WORDPRESS_DB_HOST: "db"');
    expect(res.data).toContain('WORDPRESS_DB_PASSWORD: "secret"');
    expect(res.data).toContain('- "wp_data:/var/www/html"');
  });

  it('rejects malformed commands gracefully with actionable error', () => {
    const cmd = 'docker run';
    const res = processInput(cmd);
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
    expect(res.error).toContain('Missing image name');
  });
});

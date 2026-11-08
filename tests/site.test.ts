import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Docker Run to Docker Compose Converter Sovereign Contract', () => {
  let html: string;

  beforeEach(() => {
    html = readFileSync(resolve(__dirname, '../index.html'), 'utf-8');
  });

  it('has strict Content-Security-Policy with no external script sources', () => {
    expect(html).toContain('http-equiv="Content-Security-Policy"');
    expect(html).toContain("script-src 'self'");
    expect(html).not.toContain("https://www.google-analytics.com");
    expect(html).not.toContain("https://googletagmanager.com");
  });

  it('has zero tracking cookies disclosure and Schema.org WebApplication markup', () => {
    expect(html).toContain('schema.org');
    expect(html).toContain('WebApplication');
    expect(html).toContain('https://dockertocompose.othrys.be/');
  });

  it('includes all 4 Sovereign Fleet dialogs', () => {
    expect(html).toContain('id="about-dialog"');
    expect(html).toContain('id="settings-dialog"');
    expect(html).toContain('id="vault-dialog"');
    expect(html).toContain('id="cookie-dialog"');
  });

  it('contains the Sovereign Fleet sitemap grid footer', () => {
    expect(html).toContain('sovereign-footer');
    expect(html).toContain('https://othrys.be');
    expect(html).toContain('https://wordcounter.othrys.be');
    expect(html).toContain('https://jsonfix.othrys.be');
  });
});

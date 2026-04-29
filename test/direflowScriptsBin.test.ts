import { readFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { resolve } from 'path';

describe('direflow-scripts bin launcher', () => {
  const binPath = resolve(__dirname, '../packages/direflow-scripts/bin/direflow-scripts');

  it('does not bootstrap through esm', () => {
    const binContents = readFileSync(binPath, 'utf8');

    expect(binContents).not.toContain("require('esm')");
    expect(binContents).toContain("require('../dist/cli')");
  });

  it('runs through node without crashing', () => {
    const result = spawnSync(process.execPath, [binPath, '--help'], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
  });
});
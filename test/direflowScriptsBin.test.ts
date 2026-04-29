import {
  mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync,
} from 'fs';
import { spawnSync } from 'child_process';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

describe('direflow-scripts bin launcher', () => {
  const binPath = resolve(__dirname, '../packages/direflow-scripts/bin/direflow-scripts');

  it('does not bootstrap through esm', () => {
    const binContents = readFileSync(binPath, 'utf8');

    expect(binContents).not.toContain("require('esm')");
    expect(binContents).toContain("require('../dist/cli')");
  });

  it('runs through node without crashing', () => {
    const tempPackagePath = mkdtempSync(join(tmpdir(), 'direflow-scripts-bin-'));
    const tempBinPath = join(tempPackagePath, 'bin', 'direflow-scripts');
    const tempCliPath = join(tempPackagePath, 'dist', 'cli.js');

    mkdirSync(join(tempPackagePath, 'bin'), { recursive: true });
    mkdirSync(join(tempPackagePath, 'dist'), { recursive: true });
    writeFileSync(tempBinPath, readFileSync(binPath, 'utf8'));
    writeFileSync(tempCliPath, 'exports.default = () => {};\n');

    const result = spawnSync(process.execPath, [tempBinPath, '--help'], {
      encoding: 'utf8',
    });

    rmSync(tempPackagePath, { recursive: true, force: true });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
  });
});
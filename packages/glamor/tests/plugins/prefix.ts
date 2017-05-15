import { prefix } from '../../src/plugins/prefix';
import * as expect from 'expect';

describe('prefix.ts', () => {
  it('should prefix something (statically)', () => {
    expect(prefix({ selector: '', style: { appearance: 'button' } }).style)
      .toEqual({ appearance: 'button', WebkitAppearance: 'button', MozAppearance: 'button' });
  });
});

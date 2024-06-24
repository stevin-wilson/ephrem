// envUtils.test.ts
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {envVariableIsSet} from '../src/utils.js';

describe('envVariableIsSet', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Make a deep copy of the original process.env before each test
    process.env = {...originalEnv};
  });

  afterEach(() => {
    // Restore the original process.env after each test
    process.env = originalEnv;
  });

  it('should return true if the environment variable is set', () => {
    process.env.TEST_VARIABLE = 'someValue';
    expect(envVariableIsSet('TEST_VARIABLE')).toBe(true);
  });

  it('should return false if the environment variable is not set', () => {
    delete process.env.TEST_VARIABLE;
    expect(envVariableIsSet('TEST_VARIABLE')).toBe(false);
  });

  it('should return false if the environment variable is set to an empty string', () => {
    process.env.TEST_VARIABLE = '';
    expect(envVariableIsSet('TEST_VARIABLE')).toBe(false);
  });

  it('should return false if the environment variable is set to undefined', () => {
    process.env.TEST_VARIABLE = undefined as unknown as string; // simulate an undefined value
    expect(envVariableIsSet('TEST_VARIABLE')).toBe(false);
  });

  it('should return false if the environment variable is set to null', () => {
    process.env.TEST_VARIABLE = null as unknown as string; // simulate a null value
    expect(envVariableIsSet('TEST_VARIABLE')).toBe(false);
  });
});

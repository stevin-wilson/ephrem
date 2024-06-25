// envUtils.test.ts
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { envVariableIsSet } from '../src/utils.js';
describe('envVariableIsSet', () => {
    const originalEnv = process.env;
    beforeEach(() => {
        // Make a deep copy of the original process.env before each test
        process.env = { ...originalEnv };
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
        process.env.TEST_VARIABLE = undefined; // simulate an undefined value
        expect(envVariableIsSet('TEST_VARIABLE')).toBe(false);
    });
    it('should return false if the environment variable is set to null', () => {
        process.env.TEST_VARIABLE = null; // simulate a null value
        expect(envVariableIsSet('TEST_VARIABLE')).toBe(false);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdXRpbHMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxtQkFBbUI7QUFDbkIsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDbkUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFakQsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUNoQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBRWhDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxnRUFBZ0U7UUFDaEUsT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFDLEdBQUcsV0FBVyxFQUFDLENBQUM7SUFDakMsQ0FBQyxDQUFDLENBQUM7SUFFSCxTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ2IsbURBQW1EO1FBQ25ELE9BQU8sQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDO0lBQzVCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtRQUMvRCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUM7UUFDeEMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDREQUE0RCxFQUFFLEdBQUcsRUFBRTtRQUNwRSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywyRUFBMkUsRUFBRSxHQUFHLEVBQUU7UUFDbkYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxRUFBcUUsRUFBRSxHQUFHLEVBQUU7UUFDN0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsU0FBOEIsQ0FBQyxDQUFDLDhCQUE4QjtRQUMxRixNQUFNLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0VBQWdFLEVBQUUsR0FBRyxFQUFFO1FBQ3hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFHLElBQXlCLENBQUMsQ0FBQyx3QkFBd0I7UUFDL0UsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==
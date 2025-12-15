import { describe, it, expect } from 'vitest';
import { make32, encode } from '../utils/auth'; 

const EMAIL_SHORT = 'a@b.c';
const EMAIL_LONG = 'longemail.verylong@example.com.thiswillbetruncated';
const PASS_SHORT = '123';
const PASS_LONG = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

describe('auth.ts', () => {

    describe('make32', () => {
        it('should return an array of 32 elements', () => {
            expect(make32(EMAIL_SHORT)).toHaveLength(32);
            expect(make32(EMAIL_LONG)).toHaveLength(32);
        });

        it('should correctly pad a short string by repeating it', () => {
            const result = make32(PASS_SHORT); 

            expect(result[0]).toBe('1'.charCodeAt(0));
            expect(result[3]).toBe('1'.charCodeAt(0)); 
            expect(result[31]).toBe('2'.charCodeAt(0));
        });

        it('should correctly truncate a long string to 32 characters', () => {            
            const result = make32(PASS_LONG);

            expect(result[31]).toBe('V'.charCodeAt(0));
            expect(result[32]).toBeUndefined();
        });
    });

    describe('encode', () => {
        it('should produce the correct deterministic secret for known inputs', () => {
            const testEmail = "test@example.com";
            const testPassword = "password123";
            const EXPECTED_SECRET = "78789CF2FD1010CCC8EA6E3F0691C6ABF4C9C9F54EA7B19CFCAEF410C8F2BA6E";

            const result = encode(testEmail, testPassword);
         
            expect(result).toHaveLength(64);
            expect(result).toBe(EXPECTED_SECRET);
        });

        it('should handle zero-padded hexadecimal output', () => {
           
            const targetEmail = "F@F.COM"; 
            const targetPass = "M123456"; 
            const result = encode(targetEmail, targetPass);
         
            expect(result.substring(0, 2)).toBe("F4");
        });

        it('should produce the same secret if inputs are swapped', () => {
            const secret1 = encode(EMAIL_SHORT, PASS_SHORT);
            const secret2 = encode(PASS_SHORT, EMAIL_SHORT); 
         
            expect(secret1).toBe(secret2);
        });
    });
});
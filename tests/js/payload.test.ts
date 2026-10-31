import { describe, expect, it } from 'vitest';
import { componentModuleKey, isRecord, parsePayload } from '../../src/lib/payload';

describe('parsePayload', () => {
    it('returns an empty object for an absent payload', () => {
        expect(parsePayload(null)).toEqual({});
        expect(parsePayload(undefined)).toEqual({});
        expect(parsePayload('   ')).toEqual({});
    });

    it('decodes a JSON object', () => {
        expect(parsePayload('{"title":"Home","count":2}')).toEqual({
            title: 'Home',
            count: 2,
        });
    });

    it('rejects invalid JSON with a useful message', () => {
        expect(() => parsePayload('{not json')).toThrow('not valid JSON');
    });

    it('rejects scalar and array payloads', () => {
        expect(() => parsePayload('[1,2,3]')).toThrow('must be a JSON object');
        expect(() => parsePayload('"value"')).toThrow('must be a JSON object');
    });
});

describe('componentModuleKey', () => {
    it('maps top-level pages to Vite glob keys', () => {
        expect(componentModuleKey('Pages/Home.tsx')).toBe('./pages/Home.tsx');
        expect(componentModuleKey('Pages/NotFound.tsx')).toBe('./pages/NotFound.tsx');
    });

    it('maps nested pages to nested keys', () => {
        expect(componentModuleKey('Pages/Dashboard/Index.tsx')).toBe('./pages/Dashboard/Index.tsx');
    });

    it('trims surrounding whitespace', () => {
        expect(componentModuleKey('  Pages/Form.tsx  ')).toBe('./pages/Form.tsx');
    });

    it('rejects missing and unsafe component names', () => {
        expect(() => componentModuleKey(undefined)).toThrow('data-component');
        expect(() => componentModuleKey('Pages/../Secret.tsx')).toThrow('Unsupported');
        expect(() => componentModuleKey('src/pages/Home.tsx')).toThrow('Unsupported');
        expect(() => componentModuleKey('Pages/Home.jsx')).toThrow('Unsupported');
    });
});

describe('isRecord', () => {
    it('recognises plain objects only', () => {
        expect(isRecord({})).toBe(true);
        expect(isRecord({ nested: true })).toBe(true);
        expect(isRecord([])).toBe(false);
        expect(isRecord(null)).toBe(false);
        expect(isRecord('value')).toBe(false);
    });
});

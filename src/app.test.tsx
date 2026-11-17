import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('TestTitre', () => {
    it('renders h1 test', () => {
        render(<h1>Test</h1>);

        expect(screen.getByText("Test")).toBeInTheDocument();
    });



});
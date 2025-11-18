import React from 'react';
import { render, screen } from '@testing-library/react';
import { InputField, TextAreaField, SelectField } from '../form-field';

describe('Form Field Components', () => {
  describe('InputField', () => {
    it('should render input with label', () => {
      render(<InputField label="Email" name="email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('should display required indicator', () => {
      render(<InputField label="Email" name="email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should display error message', () => {
      render(<InputField label="Email" name="email" error="Invalid email" />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('should display helper text', () => {
      render(<InputField label="Email" name="email" helperText="We'll never share your email" />);
      expect(screen.getByText(/never share/i)).toBeInTheDocument();
    });

    it('should not display helper text when error is present', () => {
      render(<InputField label="Email" name="email" error="Invalid" helperText="Helper text" />);
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Invalid')).toBeInTheDocument();
    });

    it('should render icon when provided', () => {
      const icon = <span data-testid="icon">📧</span>;
      render(<InputField label="Email" name="email" icon={icon} />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should apply error styles when error is present', () => {
      render(<InputField label="Email" name="email" error="Invalid" />);
      const input = screen.getByLabelText('Email');
      expect(input.className).toContain('border-red');
    });

    it('should forward input props', () => {
      render(
        <InputField label="Email" name="email" type="email" placeholder="Enter email" disabled />
      );
      const input = screen.getByLabelText('Email') as HTMLInputElement;
      expect(input.type).toBe('email');
      expect(input.placeholder).toBe('Enter email');
      expect(input.disabled).toBe(true);
    });
  });

  describe('TextAreaField', () => {
    it('should render textarea with label', () => {
      render(<TextAreaField label="Description" name="description" />);
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('should display error message', () => {
      render(<TextAreaField label="Description" name="description" error="Required field" />);
      expect(screen.getByText('Required field')).toBeInTheDocument();
    });

    it('should display required indicator', () => {
      render(<TextAreaField label="Description" name="description" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should forward textarea props', () => {
      render(
        <TextAreaField
          label="Description"
          name="description"
          rows={5}
          placeholder="Enter description"
        />
      );
      const textarea = screen.getByLabelText('Description') as HTMLTextAreaElement;
      expect(textarea.rows).toBe(5);
      expect(textarea.placeholder).toBe('Enter description');
    });
  });

  describe('SelectField', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];

    it('should render select with options', () => {
      render(<SelectField label="Choose" options={options} />);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should display placeholder', () => {
      render(<SelectField label="Choose" options={options} placeholder="Select an option" />);
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should display error message', () => {
      render(<SelectField label="Choose" options={options} error="Selection required" />);
      expect(screen.getByText('Selection required')).toBeInTheDocument();
    });

    it('should display required indicator', () => {
      render(<SelectField label="Choose" options={options} required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should set selected value', () => {
      render(<SelectField label="Choose" options={options} value="option2" />);
      const select = screen.getByLabelText('Choose') as HTMLSelectElement;
      expect(select.value).toBe('option2');
    });
  });
});

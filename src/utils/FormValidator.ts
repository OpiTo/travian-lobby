import { RefObject } from 'react';

/**
 * Form Validator class (P class in original)
 * Handles form validation with various rules.
 */
class FormValidator {
  static NOT_EMPTY = 'notEmpty';
  static CHECKED = 'checked';
  static SHORTER_THAN = 'shorterThan';
  static AT_LEAST = 'atLeast';
  static IS_EMAIL = 'isEmail';
  static NO_CUSTOM_ERROR = 'customErrorExists';

  formValid = false;

  validationRules: Record<string, (element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, param?: number) => boolean> = {
    [FormValidator.NOT_EMPTY]: (e) => e.value !== '',
    [FormValidator.CHECKED]: (e) => (e as HTMLInputElement).checked,
    [FormValidator.SHORTER_THAN]: (e, a) => e.value.length <= (a || 0),
    [FormValidator.AT_LEAST]: (e, a) => e.value.length >= (a || 0),
    [FormValidator.IS_EMAIL]: (e) => /^\S+@\S+\.\S+$/.test(e.value),
    [FormValidator.NO_CUSTOM_ERROR]: () => false,
  };

  indeterminateText = '(Multiple)';
  indeterminateNumeric = '?';

  form: RefObject<HTMLFormElement>;
  attached = false;

  constructor(form: RefObject<HTMLFormElement>) {
    this.form = form;
  }

  onCustomErrorFocus = (_element: Element) => { };

  attach() {
    if (this.attached) return;
    this.bindEventListeners();
    this.initElementWithCustomValidationRenderElement();
    this.attached = true;
  }

  detach() {
    // Cleanup if needed
  }

  bindEventListeners() {
    if (!this.form.current) return;

    // Bind to text inputs, textareas, and selects inside labels
    const elements = this.form.current.querySelectorAll(
      'label input:not([type=radio]):not([type=checkbox]), label textarea, label select'
    );

    for (const element of elements) {
      const label = element.closest('label')?.closest('label') || element.closest('label');
      const labelText = label?.querySelector('.label');

      if (labelText && element instanceof HTMLInputElement) {
        // Pin label if value exists
        if (element.value !== '') {
          labelText.classList.add('pinned');
        }

        element.addEventListener('change', () => {
          if (element.value !== '') {
            labelText.classList.add('pinned');
          } else {
            labelText.classList.remove('pinned');
          }

          if (
            element.classList.contains('indeterminate') &&
            element.value !== this.indeterminateText &&
            element.value !== this.indeterminateNumeric
          ) {
            element.classList.remove('indeterminate');
          }
        });

        element.addEventListener('blur', () => {
          this.validate(element);
        });

        element.addEventListener('focus', () => {
          const parentLabel = element.closest('label');
          if (!parentLabel) return;

          parentLabel.classList.remove('valid');
          parentLabel.classList.remove('invalid');

          const validations = parentLabel.querySelectorAll('.validation');
          validations?.forEach((v) => {
            v.classList.remove('show');
            if (v.classList.contains('custom')) {
              this.onCustomErrorFocus(v);
            }
          });

          if (this.isElementIndeterminate(element)) {
            element.selectionStart = 0;
            element.selectionEnd = element.value.length;
          }
        });
      }

      // Observe for DOM changes
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && document.activeElement !== element) {
            this.validate(element as HTMLInputElement);
          }
        }
      });

      if (label instanceof Node) {
        observer.observe(label, { childList: true });
      }
    }

    // Bind to radio and checkbox inputs
    const checkboxes = this.form.current.querySelectorAll('input[type=radio], input[type=checkbox]');
    for (const checkbox of checkboxes) {
      checkbox.addEventListener('click', () => {
        const name = (checkbox as HTMLInputElement).name;
        const sameNameInputs = this.form.current?.querySelectorAll(`input[name=${name}]`);
        sameNameInputs?.forEach((input) => {
          if (input.classList.contains('indeterminate')) {
            input.classList.remove('indeterminate');
          }
          this.validate(input as HTMLInputElement);
        });
      });
    }

    // Bind form submit
    this.form.current.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validateForm();
      if (this.formValid) {
        this.form.current?.submit();
      }
    });
  }

  initElementWithCustomValidationRenderElement() {
    if (!this.form.current) return;

    const labels = this.form.current.querySelectorAll('label');
    for (const label of labels) {
      if (label.querySelectorAll('.validation[data-render-into]').length > 0) {
        label.classList.add('withCustomValidationRenderElement');
      }
    }
  }

  validateForm() {
    if (!this.form.current) return;

    const elements = this.form.current.querySelectorAll('label input, label select, label textarea');
    this.formValid = true;

    for (const element of elements) {
      this.validate(element as HTMLInputElement);
    }
  }

  validate(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
    const label = element.closest('label');
    const validations = label?.querySelectorAll('.validation');
    let isValid = true;

    if (validations && validations.length > 0) {
      if (!element.classList.contains('indeterminate')) {
        label?.classList.remove('valid');

        for (const validation of validations) {
          const rule = (validation as HTMLElement).dataset.rule;
          const parameter = parseInt((validation as HTMLElement).dataset.parameter || '0');

          if (
            rule &&
            typeof this.validationRules[rule] === 'function' &&
            !this.validationRules[rule](element, parameter)
          ) {
            this.formValid = false;
            this.highlightInvalidElement(validation as HTMLElement);
            isValid = false;
            break;
          }
        }
      }

      if (isValid) {
        label?.classList.remove('invalid');
        label?.classList.add('valid');

        const allValidations = label?.querySelectorAll('.validation') || [];
        for (const v of allValidations) {
          v.classList.remove('show');
          const renderInto = (v as HTMLElement).dataset.renderInto;
          if (renderInto) {
            this.removeCustomValidationRenderElement(renderInto);
          }
        }
      }
    }
  }

  highlightInvalidElement(validation: HTMLElement) {
    const label = validation.closest('label');
    const renderInto = validation.dataset.renderInto;

    if (renderInto) {
      const target = document.querySelector(renderInto);
      if (target) {
        target.innerHTML = validation.innerHTML;
        target.classList.add('show');
      }
    } else {
      validation.classList.add('show');
    }

    if (label) {
      if (validation.classList.contains('positive')) {
        label.classList.add('valid');
      } else {
        label.classList.add('invalid');
      }
    }
  }

  removeCustomValidationRenderElement(selector: string) {
    const validations = document.querySelectorAll(`.validation[data-render-into='${selector}']`) || [];

    for (const v of validations) {
      const label = v.closest('label');
      if (label && label.classList.contains('invalid')) {
        const input = label.querySelector('input, select, textarea');
        if (input) {
          this.validate(input as HTMLInputElement);
        }
        return;
      }
    }

    document.querySelector(selector)?.classList.remove('show');
  }

  resetAllValidations() {
    if (!this.form.current) return;

    const labels = this.form.current.querySelectorAll('label');
    for (const label of labels) {
      label.classList.remove('valid', 'invalid');

      const validations = label.querySelectorAll('.validation');
      for (const v of validations) {
        v.classList.remove('show');
        const renderInto = (v as HTMLElement).dataset.renderInto;
        if (renderInto) {
          this.removeCustomValidationRenderElement(renderInto);
        }
      }
    }
  }

  isElementIndeterminate(element: HTMLInputElement) {
    return (
      element.classList.contains('indeterminate') ||
      element.value === this.indeterminateText ||
      element.value === this.indeterminateNumeric
    );
  }
}

export default FormValidator;

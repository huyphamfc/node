/**
 * Form Validation Library v1.0
 * Created on Oct 12, 2022
 * Author: huyphamfc
 *
 * https://github.com/huyphamfc
 */

export default function (formElement, validateAll) {
  const validationMethods = {
    required(label) {
      return function (value) {
        if (value === '') return `Please enter your ${label}.`;
      };
    },

    email(value) {
      const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (pattern.test(value)) return;

      return 'Email is invalid.';
    },

    confirmed(confirmationElementName, confirmationCode) {
      // prettier-ignore
      const sampleElement = Array.from(
        formElement.querySelectorAll(`[confirmation-code=${confirmationCode}]`)
      )
      .find(element => element.name !== confirmationElementName);

      if (sampleElement) {
        return function (value) {
          if (value !== sampleElement.value)
            return `The ${confirmationCode} confirmation does not match.`;
        };
      }

      return function () {
        return undefined;
      };
    },

    minLength(label, minLength) {
      return function (value) {
        if (value.length < minLength)
          return `Your ${label} must be at least ${minLength} characters.`;
      };
    },
  };

  const handleValidationMethods = element => {
    return formRules[element.name]
      .map(rule => rule(element.value))
      .find(result => result !== undefined);
  };

  const handleValidation = ({ target: element }) => {
    const containerElement = element.closest('.form__group');
    if (!containerElement) return;

    const warningElement = containerElement.querySelector('.form__warning');
    if (!warningElement) return;

    const error = handleValidationMethods(element);
    if (!error) {
      containerElement.classList.remove('invalid');
      return;
    }

    containerElement.classList.add('invalid');
    warningElement.textContent = error;

    return error;
  };

  const formRules = {};

  const validationElements = Array.from(
    formElement.querySelectorAll('[name][rules]')
  );
  if (validationElements.length === 0) return;

  validationElements.forEach(element => {
    const rules = element
      .getAttribute('rules')
      .split('|')
      .map(rule => {
        if (rule === 'required') {
          return validationMethods.required(element.ariaLabel);
        }

        if (rule.includes(':')) {
          rule = rule.split(':');

          if (rule[0] === 'confirmed') {
            return validationMethods.confirmed(element.name, rule[1]);
          }

          return validationMethods[rule[0]](element.ariaLabel, rule[1]);
        }

        return validationMethods[rule];
      });

    formRules[element.name] = rules;

    element.addEventListener('blur', handleValidation);
  });

  if (validateAll) {
    let isError = false;

    validationElements.forEach(element => {
      if (handleValidation({ target: element })) isError = true;
    });

    return isError;
  }
}

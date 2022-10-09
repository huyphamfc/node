import validator from './validator.js';

const url = 'http://localhost:8000/api/accounts/login';
const loginForm = document.querySelector('#register-form');

const submitLoginForm = async (email, password) => {
  try {
    const payload = { email: email, password: password };

    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const results = await res.json();
    console.log(results);
  } catch (err) {
    console.log(err);
  }
};

validator(loginForm);

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const isError = validator(loginForm, true);
  if (isError) return;

  const email = loginForm.querySelector('[name=email]').value;
  const password = loginForm.querySelector('[name=password]').value;

  submitLoginForm(email, password);
});

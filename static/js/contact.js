const inputElements = {
  add_contact_us_form: {
    name: document.getElementById('input-contact-us-name'),
    email: document.getElementById('input-contact-us-email'),
    message: document.getElementById('input-contact-us-message'),
  },
};

document
  .getElementById('add-contact-us-form')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    let useBtn = document.getElementById('btn-contact-us-add-form');
    let defaultBtnText = useBtn.innerHTML;
    useBtn.disabled = true;
    useBtn.innerHTML = spinnerLoading(useBtn.innerHTML);

    const addData = processForm(inputElements.add_contact_us_form);

    try {
      const response = await fetch(
        `${STATIC_PUBLIC_HOST}/api/newsletter/contact-us`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...addData,
          }),
        }
      );

      if (!response.ok) {
        showToast('alert-toast-container', 'Something went wrong!', 'danger');
        handleFormResult({ error, useBtn, defaultBtnText });
        return;
      }

      processForm(inputElements.add_contact_us_form, true);

      handleFormResult({
        useBtn,
        defaultBtnText,
        successText:
          'Thank you for reaching out! your message has been successfully submitted!',
      });
    } catch (error) {
      showToast('alert-toast-container', error.message, 'danger');
      handleFormResult({ error, useBtn, defaultBtnText });
    }
  });

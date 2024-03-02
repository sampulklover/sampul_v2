function mapToSelect(list, elementId) {
  if (list.length > 0 && elementId) {
    list.forEach((items) => {
      const option = document.createElement('option');
      option.value = items.value;
      option.text = items.name;
      document.getElementById(elementId).appendChild(option);
    });
  }
}

function spinnerLoading(text) {
  return (
    text + `<div class="spinner-border spinner-border-sm" role="status"></div>`
  );
}

function showToast(parentContainerId = '', message, type = '') {
  const toastContainer = document.getElementById(parentContainerId);

  const alertHTML = `
      <div class="toast toast-container align-items-center text-white bg-${type} border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style="position: fixed; top: 20px; right: 20px; z-index: 9999"
      >
      <div class="d-flex">
        <div class="toast-body"></span>${message}</div>
        <button
          type="button"
          class="close mr-2"
          aria-label="Close"
          data-dismiss="toast"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      </div>
      `;
  toastContainer.innerHTML = alertHTML;

  $('.toast').toast({
    autohide: true,
    delay: 5000,
  });
  $('.toast').toast('show');
}

function handleFormResult(options) {
  const {
    error,
    useBtn,
    defaultBtnText,
    successText = 'Success!',
    failedText = '',
  } = options;

  if (error) {
    if (error.message) {
      console.error('Error', error.message);
      showToast(
        'alert-toast-container',
        failedText ? failedText : error.message,
        'danger'
      );
    } else {
      console.error('Error', error);
    }
  } else {
    showToast('alert-toast-container', successText, 'success');
  }

  if (useBtn) {
    useBtn.disabled = false;
    useBtn.innerHTML = defaultBtnText;
  }
}

function processForm(elements, clearFields = false) {
  const addData = {};

  if (clearFields) {
    for (const key in elements) {
      if (key !== 'image_path') {
        elements[key].value = '';
      }
    }
  } else {
    for (const key in elements) {
      if (key !== 'image_path') {
        if (elements[key].tagName == 'SELECT' && elements[key].multiple) {
          var selectedValues = [];
          for (var i = 0; i < elements[key].length; i++) {
            if (elements[key][i].selected) {
              selectedValues.push(elements[key][i].value);
            }
          }
          addData[key] = selectedValues;
        } else {
          addData[key] = elements[key].value;
        }
      }
    }
  }

  return addData;
}

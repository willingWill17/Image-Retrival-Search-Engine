const notifications = document.querySelector(".toast-container");

// Object containing details for different types of toasts
const toastDetails = {
  timer: 2000,
  success: "fa-circle-check",
  danger: "fa-circle-xmark",
  warning: "fa-triangle-exclamation",
  primary: "fa-circle-info",
};

export const createToast = (id, message) => {
  const toastHtml =
    $.parseHTML(`<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex alert alert-${id}">
        <div class="toast-body">
          <i class="fa-solid ${toastDetails[id]}"></i>
          <span>${message}</span>
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>`)[0];
  const toast = new bootstrap.Toast(toastHtml, {
    delay: toastDetails["timer"],
  });
  notifications.appendChild(toastHtml);
  toast.show();
};

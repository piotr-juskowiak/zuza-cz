(function () {
  const ENDPOINT = "/api/send-form-email";
  const ALERT_TIMEOUT_MS = 6000;
  const FIRESTORE_TIMEOUT_MS = 1200;

  function injectFormMailerStyles() {
    if (document.getElementById("formMailerStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "formMailerStyles";
    style.textContent = `
      .form-mailer-alert {
        display: block !important;
        margin: 0 0 1rem !important;
        padding: 0.95rem 1rem !important;
        border-radius: 6px !important;
        border: 1px solid rgba(197, 160, 101, 0.38) !important;
        border-left: 3px solid #c5a065 !important;
        background: rgba(248, 246, 241, 0.98) !important;
        color: #182d25 !important;
        font-size: 0.92rem !important;
        line-height: 1.55 !important;
        text-align: left !important;
        box-shadow: 0 18px 42px rgba(7, 24, 20, 0.14) !important;
        opacity: 0;
        transform: translateY(8px);
        animation: formMailerAlertIn 360ms ease forwards;
      }

      .footer-premium-newsletter .form-mailer-alert {
        font-size: 0.86rem !important;
      }

      .form-mailer-alert--success {
        border-color: rgba(197, 160, 101, 0.42) !important;
        border-left-color: #c5a065 !important;
      }

      .form-mailer-alert--warning {
        border-color: rgba(197, 160, 101, 0.55) !important;
        border-left-color: #c5a065 !important;
      }

      .form-mailer-alert--error {
        border-color: rgba(143, 61, 50, 0.36) !important;
        border-left-color: #8f3d32 !important;
      }

      .form-mailer-button--pending {
        cursor: wait !important;
        opacity: 0.86;
      }

      .contact-form.form-mailer-is-submitting .field-input,
      .premium-subscribe-form.form-mailer-is-submitting input {
        opacity: 0.72;
      }

      .form-mailer-button-content {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.65rem;
      }

      .form-mailer-spinner {
        display: inline-block;
        width: 1em;
        height: 1em;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 999px;
        animation: formMailerSpin 760ms linear infinite;
      }

      .premium-subscribe-form button .form-mailer-spinner {
        width: 18px;
        height: 18px;
      }

      @keyframes formMailerSpin {
        to { transform: rotate(360deg); }
      }

      @keyframes formMailerAlertIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getField(form, selector) {
    const field = form.querySelector(selector);
    return field ? field.value.trim() : "";
  }

  function getChecked(form, selector) {
    const field = form.querySelector(selector);
    return Boolean(field && field.checked);
  }

  function getPageContext() {
    return {
      pageTitle: document.title,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
    };
  }

  async function sendFormEmail(type, payload) {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        payload: {
          ...payload,
          ...getPageContext(),
        },
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "EMAIL_SEND_FAILED");
    }

    return result;
  }

  function withTimeout(promise, timeoutMs, fallbackValue) {
    return Promise.race([
      promise,
      new Promise((resolve) => {
        window.setTimeout(() => resolve(fallbackValue), timeoutMs);
      }),
    ]);
  }

  function runInBackground(promise, label) {
    Promise.resolve(promise).catch((error) => {
      console.warn(label, error);
    });
  }

  function getFirebaseHelpers() {
    const helpers = window.firebaseFunctions || {};

    if (!window.firebaseDb || !helpers.collection) {
      return null;
    }

    return helpers;
  }

  async function maybeSaveContactMessage(formData) {
    const helpers = getFirebaseHelpers();

    if (!helpers || !helpers.addDoc) {
      return;
    }

    try {
      await helpers.addDoc(helpers.collection(window.firebaseDb, "contactMessages"), formData);

      if (formData.newsletter) {
        await helpers.addDoc(helpers.collection(window.firebaseDb, "newsletter"), {
          email: formData.email,
          name: `${formData.name} ${formData.surname}`.trim(),
          source: "contact_form",
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.warn("Nie udało się zapisać formularza w Firestore:", error);
    }
  }

  async function maybeEmailExists(email) {
    const helpers = getFirebaseHelpers();

    if (!helpers || !helpers.getDocs || !helpers.query || !helpers.where) {
      return false;
    }

    try {
      const newsletterRef = helpers.collection(window.firebaseDb, "newsletter");
      const q = helpers.query(newsletterRef, helpers.where("email", "==", email));
      const snapshot = await withTimeout(
        helpers.getDocs(q),
        FIRESTORE_TIMEOUT_MS,
        { empty: true }
      );
      return !snapshot.empty;
    } catch (error) {
      console.warn("Nie udało się sprawdzić duplikatu newslettera:", error);
      return false;
    }
  }

  async function maybeSaveNewsletter(email, source) {
    const helpers = getFirebaseHelpers();

    if (!helpers || !helpers.addDoc) {
      return;
    }

    try {
      await helpers.addDoc(helpers.collection(window.firebaseDb, "newsletter"), {
        email,
        name: null,
        source,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.warn("Nie udało się zapisać newslettera w Firestore:", error);
    }
  }

  function showAlert(id, type, message) {
    const alertDiv = document.getElementById(id);

    if (!alertDiv) {
      window.alert(message);
      return;
    }

    window.clearTimeout(alertDiv.formMailerTimeout);
    alertDiv.hidden = false;
    alertDiv.style.display = "block";
    alertDiv.classList.remove(
      "form-mailer-alert--success",
      "form-mailer-alert--warning",
      "form-mailer-alert--error"
    );
    alertDiv.classList.add("form-mailer-alert", `form-mailer-alert--${type || "success"}`);
    alertDiv.setAttribute("role", type === "error" ? "alert" : "status");
    alertDiv.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
    alertDiv.textContent = message;

    alertDiv.formMailerTimeout = window.setTimeout(() => {
      alertDiv.style.display = "none";
      alertDiv.hidden = true;
    }, ALERT_TIMEOUT_MS);
  }

  function setPending(form, message) {
    const button = form.querySelector('button[type="submit"]');

    if (!button) {
      return function restore() {};
    }

    const originalHtml = button.innerHTML;
    const originalAriaLabel = button.getAttribute("aria-label");
    const isNewsletter = form.id === "newsletterForm";

    form.dataset.formMailerState = "submitting";
    form.classList.add("form-mailer-is-submitting");
    button.classList.add("form-mailer-button--pending");
    button.setAttribute("aria-busy", "true");
    button.disabled = true;
    button.innerHTML = isNewsletter
      ? '<span class="form-mailer-spinner" aria-hidden="true"></span>'
      : `<span class="form-mailer-button-content"><span>${message}</span><span class="form-mailer-spinner" aria-hidden="true"></span></span>`;

    if (isNewsletter) {
      button.setAttribute("aria-label", message);
    }

    return function restore() {
      delete form.dataset.formMailerState;
      form.classList.remove("form-mailer-is-submitting");
      button.classList.remove("form-mailer-button--pending");
      button.removeAttribute("aria-busy");
      button.innerHTML = originalHtml;
      button.disabled = false;

      if (originalAriaLabel) {
        button.setAttribute("aria-label", originalAriaLabel);
      } else {
        button.removeAttribute("aria-label");
      }
    };
  }

  function isManagedForm(form) {
    return form instanceof HTMLFormElement && (
      form.id === "contactForm" ||
      form.id === "newsletterForm"
    );
  }

  function handleManagedForm(form) {
    if (!isManagedForm(form) || form.dataset.formMailerState === "submitting") {
      return;
    }

    if (form.id === "contactForm") {
      handleContactForm(form);
    } else {
      handleNewsletterForm(form);
    }
  }

  async function handleContactForm(form) {
    const restoreButton = setPending(form, "Wysyłanie...");

    try {
      const formData = {
        name: getField(form, "#name"),
        surname: getField(form, "#surname"),
        email: getField(form, "#email"),
        phone: getField(form, "#phone") || null,
        subject: getField(form, "#subject"),
        subjectLabel: getField(form, "#subject"),
        message: getField(form, "#msg"),
        newsletter: getChecked(form, "#newsletter"),
        createdAt: new Date().toISOString(),
        read: false,
      };

      await sendFormEmail("contact", formData);
      runInBackground(
        maybeSaveContactMessage(formData),
        "Nie udało się zapisać formularza kontaktowego w tle:"
      );

      showAlert(
        "contactFormAlert",
        "success",
        "Dziękujemy! Twoja wiadomość została wysłana. Odpowiemy w ciągu 24 godzin."
      );
      form.reset();
    } catch (error) {
      console.error("Błąd wysyłania formularza:", error);
      showAlert(
        "contactFormAlert",
        "error",
        "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później."
      );
    } finally {
      restoreButton();
    }
  }

  async function handleNewsletterForm(form) {
    const restoreButton = setPending(form, "Zapisywanie...");

    try {
      const email = getField(form, "#newsletterEmail");
      const source = "newsletter_form";
      const exists = await maybeEmailExists(email);

      if (exists) {
        showAlert(
          "newsletterAlert",
          "warning",
          "Ten adres email jest już zapisany do newslettera."
        );
        return;
      }

      await sendFormEmail("newsletter", { email, source });
      runInBackground(
        maybeSaveNewsletter(email, source),
        "Nie udało się zapisać newslettera w tle:"
      );

      showAlert("newsletterAlert", "success", "Dziękujemy za zapis do newslettera!");
      form.reset();
    } catch (error) {
      console.error("Błąd newslettera:", error);
      showAlert(
        "newsletterAlert",
        "error",
        "Wystąpił błąd podczas zapisu. Spróbuj ponownie później."
      );
    } finally {
      restoreButton();
    }
  }

  document.addEventListener(
    "submit",
    function (event) {
      const form = event.target;

      if (!isManagedForm(form)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      handleManagedForm(form);
    },
    true
  );

  document.addEventListener(
    "click",
    function (event) {
      const target = event.target instanceof Element ? event.target : null;
      const button = target ? target.closest('button[type="submit"]') : null;
      const form = button ? button.closest("form") : null;

      if (!isManagedForm(form)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (typeof form.reportValidity === "function" && !form.reportValidity()) {
        return;
      }

      handleManagedForm(form);
    },
    true
  );

  injectFormMailerStyles();
  document.documentElement.dataset.formMailer = "ready";

  window.sendContactFormEmail = function (payload) {
    return sendFormEmail("contact", payload);
  };

  window.sendNewsletterFormEmail = function (payload) {
    return sendFormEmail("newsletter", payload);
  };
})();

(function () {
  const ENDPOINT = "/api/send-form-email";
  const FIRESTORE_TIMEOUT_MS = 1200;
  const MODAL_ID = "formMailerModal";

  let lastFocusedElement = null;

  window.__FORM_MAILER_HANDLES_FORMS__ = true;

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

      body.form-mailer-modal-open {
        overflow: hidden !important;
      }

      .form-mailer-modal[hidden] {
        display: none !important;
      }

      .form-mailer-modal {
        position: fixed;
        inset: 0;
        z-index: 2147483000;
        display: grid;
        place-items: center;
        padding: clamp(1rem, 4vw, 2rem);
        background: rgba(8, 24, 20, 0.82);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .form-mailer-modal__dialog {
        position: relative;
        width: min(560px, 100%);
        overflow: hidden;
        border: 1px solid rgba(197, 160, 101, 0.46);
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(247, 244, 238, 0.96)),
          radial-gradient(circle at top right, rgba(197, 160, 101, 0.16), transparent 42%);
        box-shadow: 0 34px 90px rgba(0, 0, 0, 0.34);
        color: #182d25;
        padding: clamp(1.6rem, 4vw, 2.35rem);
        transform: translateY(12px) scale(0.98);
        opacity: 0;
        animation: formMailerModalIn 280ms ease forwards;
      }

      .form-mailer-modal__dialog::before {
        content: '';
        position: absolute;
        inset: 0 0 auto;
        height: 4px;
        background: #c5a065;
      }

      .form-mailer-modal--error .form-mailer-modal__dialog::before {
        background: #8f3d32;
      }

      .form-mailer-modal--warning .form-mailer-modal__dialog::before {
        background: #b9822c;
      }

      .form-mailer-modal__close {
        position: absolute;
        top: 0.85rem;
        right: 0.85rem;
        width: 38px;
        height: 38px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(26, 46, 40, 0.14);
        background: rgba(255, 255, 255, 0.72);
        color: #182d25;
        font-size: 1.35rem;
        line-height: 1;
        cursor: pointer;
        transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
      }

      .form-mailer-modal__close:hover,
      .form-mailer-modal__close:focus-visible {
        background: #fff;
        border-color: rgba(197, 160, 101, 0.54);
        transform: translateY(-1px);
        outline: none;
      }

      .form-mailer-modal__icon {
        width: 54px;
        height: 54px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.15rem;
        border: 1px solid rgba(197, 160, 101, 0.48);
        background: #182d25;
        color: #c5a065;
        font-family: 'Syne', sans-serif;
        font-size: 1.35rem;
        font-weight: 700;
      }

      .form-mailer-modal--error .form-mailer-modal__icon {
        border-color: rgba(143, 61, 50, 0.44);
        background: #8f3d32;
        color: #fff;
      }

      .form-mailer-modal--warning .form-mailer-modal__icon {
        background: #b9822c;
        color: #fff;
      }

      .form-mailer-modal__eyebrow {
        display: block;
        margin-bottom: 0.5rem;
        font-family: 'Syne', sans-serif;
        font-size: 0.62rem;
        font-weight: 700;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: #c5a065;
      }

      .form-mailer-modal__title {
        margin: 0;
        max-width: 430px;
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(2rem, 8vw, 3rem);
        font-weight: 500;
        line-height: 0.98;
        color: #182d25;
      }

      .form-mailer-modal__message {
        margin: 1rem 0 0;
        max-width: 440px;
        color: rgba(26, 46, 40, 0.74);
        font-size: 1rem;
        line-height: 1.7;
      }

      .form-mailer-modal__actions {
        margin-top: 1.45rem;
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }

      .form-mailer-modal__button {
        min-height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #182d25;
        background: #182d25;
        color: #fff;
        padding: 0.85rem 1.45rem;
        font-family: 'Syne', sans-serif;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        cursor: pointer;
        transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
      }

      .form-mailer-modal__button:hover,
      .form-mailer-modal__button:focus-visible {
        background: #c5a065;
        border-color: #c5a065;
        color: #182d25;
        outline: none;
      }

      .form-mailer-button--pending {
        cursor: wait !important;
        opacity: 0.86;
      }

      .contact-form.form-mailer-is-submitting .field-input,
      .recruitment-form.form-mailer-is-submitting .field-input,
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

      @keyframes formMailerModalIn {
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @media (max-width: 520px) {
        .form-mailer-modal {
          align-items: end;
          padding: 0;
        }

        .form-mailer-modal__dialog {
          width: 100%;
          padding: 1.45rem 1.25rem 1.3rem;
        }

        .form-mailer-modal__title {
          max-width: calc(100% - 2.5rem);
        }

        .form-mailer-modal__actions {
          display: block;
        }

        .form-mailer-modal__button {
          width: 100%;
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

  function getSelectedValue(form, selector) {
    const field = form.querySelector(selector);
    return field ? field.value.trim() : "";
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

  function getAlertTitle(id, type) {
    if (type === "error") {
      return id === "newsletterAlert" ? "Zapis nie doszedł" : "Nie udało się wysłać";
    }

    if (type === "warning") {
      return "Ten adres już jest zapisany";
    }

    if (id === "newsletterAlert") {
      return "Zapis do newslettera potwierdzony";
    }

    if (id === "recruitmentFormAlert") {
      return "Zgłoszenie wysłane";
    }

    return "Wiadomość wysłana";
  }

  function getAlertEyebrow(type) {
    if (type === "error") {
      return "Potrzebujemy ponownej próby";
    }

    if (type === "warning") {
      return "Informacja";
    }

    return "Formularz wysłany pomyślnie";
  }

  function getAlertIcon(type) {
    if (type === "error") {
      return "!";
    }

    if (type === "warning") {
      return "i";
    }

    return "✓";
  }

  function ensureFormMailerModal() {
    const existingModal = document.getElementById(MODAL_ID);

    if (existingModal) {
      return existingModal;
    }

    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.className = "form-mailer-modal";
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="form-mailer-modal__dialog" role="alertdialog" aria-modal="true" aria-labelledby="formMailerModalTitle" aria-describedby="formMailerModalMessage">
        <button type="button" class="form-mailer-modal__close" data-form-mailer-close aria-label="Zamknij powiadomienie">×</button>
        <span class="form-mailer-modal__icon" data-form-mailer-icon aria-hidden="true"></span>
        <span class="form-mailer-modal__eyebrow" data-form-mailer-eyebrow></span>
        <h2 class="form-mailer-modal__title" id="formMailerModalTitle"></h2>
        <p class="form-mailer-modal__message" id="formMailerModalMessage"></p>
        <div class="form-mailer-modal__actions">
          <button type="button" class="form-mailer-modal__button" data-form-mailer-close>Zamknij</button>
        </div>
      </div>
    `;

    modal.querySelectorAll("[data-form-mailer-close]").forEach((button) => {
      button.addEventListener("click", closeFormMailerModal);
    });

    document.body.appendChild(modal);
    return modal;
  }

  function getFocusableModalElements(modal) {
    return Array.from(
      modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.disabled && element.getClientRects().length > 0);
  }

  function handleModalKeydown(event) {
    const modal = document.getElementById(MODAL_ID);

    if (!modal || modal.hidden) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeFormMailerModal();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableModalElements(modal);

    if (!focusableElements.length) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  function showFormMailerModal(id, type, message) {
    const modal = ensureFormMailerModal();
    const alertType = type || "success";
    const closeButton = modal.querySelector(".form-mailer-modal__button");

    lastFocusedElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    modal.classList.remove(
      "form-mailer-modal--success",
      "form-mailer-modal--warning",
      "form-mailer-modal--error"
    );
    modal.classList.add(`form-mailer-modal--${alertType}`);
    modal.querySelector("[data-form-mailer-icon]").textContent = getAlertIcon(alertType);
    modal.querySelector("[data-form-mailer-eyebrow]").textContent = getAlertEyebrow(alertType);
    modal.querySelector("#formMailerModalTitle").textContent = getAlertTitle(id, alertType);
    modal.querySelector("#formMailerModalMessage").textContent = message;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("form-mailer-modal-open");

    window.requestAnimationFrame(() => {
      closeButton?.focus({ preventScroll: true });
    });
  }

  function closeFormMailerModal() {
    const modal = document.getElementById(MODAL_ID);

    if (!modal) {
      return;
    }

    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("form-mailer-modal-open");

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus({ preventScroll: true });
    }

    lastFocusedElement = null;
  }

  function showAlert(id, type, message) {
    const alertDiv = document.getElementById(id);

    if (alertDiv) {
      window.clearTimeout(alertDiv.formMailerTimeout);
      alertDiv.hidden = true;
      alertDiv.style.display = "none";
      alertDiv.classList.remove(
        "form-mailer-alert--success",
        "form-mailer-alert--warning",
        "form-mailer-alert--error"
      );
      alertDiv.classList.add("form-mailer-alert", `form-mailer-alert--${type || "success"}`);
      alertDiv.setAttribute("role", type === "error" ? "alert" : "status");
      alertDiv.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
      alertDiv.textContent = message;
    }

    if (document.body) {
      showFormMailerModal(id, type, message);
      return;
    }

    window.alert(message);
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
      form.id === "newsletterForm" ||
      form.id === "recruitmentForm"
    );
  }

  function handleManagedForm(form) {
    if (!isManagedForm(form) || form.dataset.formMailerState === "submitting") {
      return;
    }

    if (form.id === "contactForm") {
      handleContactForm(form);
    } else if (form.id === "newsletterForm") {
      handleNewsletterForm(form);
    } else {
      handleRecruitmentForm(form);
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

  async function handleRecruitmentForm(form) {
    const restoreButton = setPending(form, "Wysyłanie zgłoszenia...");

    try {
      const formData = {
        name: getField(form, "#recruitmentName"),
        age: getField(form, "#recruitmentAge"),
        address: getField(form, "#recruitmentAddress"),
        email: getField(form, "#recruitmentEmail"),
        phone: getField(form, "#recruitmentPhone"),
        facebook: getField(form, "#recruitmentFacebook"),
        team: getSelectedValue(form, 'input[name="recruitmentTeam"]:checked'),
        motivation: getField(form, "#recruitmentMotivation"),
        experience: getField(form, "#recruitmentExperience"),
        consent: getChecked(form, "#recruitmentConsent"),
        createdAt: new Date().toISOString(),
      };

      await sendFormEmail("recruitment", formData);

      showAlert(
        "recruitmentFormAlert",
        "success",
        "Dziękujemy! Twoje zgłoszenie zostało wysłane. Odezwiemy się po jego sprawdzeniu."
      );
      form.reset();
    } catch (error) {
      console.error("Błąd formularza rekrutacyjnego:", error);
      showAlert(
        "recruitmentFormAlert",
        "error",
        "Wystąpił błąd podczas wysyłania zgłoszenia. Spróbuj ponownie później."
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

  document.addEventListener("keydown", handleModalKeydown);

  injectFormMailerStyles();
  document.documentElement.dataset.formMailer = "ready";

  window.sendContactFormEmail = function (payload) {
    return sendFormEmail("contact", payload);
  };

  window.sendNewsletterFormEmail = function (payload) {
    return sendFormEmail("newsletter", payload);
  };

  window.sendRecruitmentFormEmail = function (payload) {
    return sendFormEmail("recruitment", payload);
  };
})();

(function () {
  const ENDPOINT = "/api/send-form-email";

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
      const snapshot = await helpers.getDocs(q);
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

    const palette = {
      success: {
        background: "#e8f5e9",
        color: "#2e7d32",
        border: "1px solid #c8e6c9",
      },
      warning: {
        background: "#fff3e0",
        color: "#f57c00",
        border: "1px solid #ffcc80",
      },
      error: {
        background: "#ffebee",
        color: "#d32f2f",
        border: "1px solid #ffcdd2",
      },
    };

    const colors = palette[type] || palette.success;
    alertDiv.style.display = "block";
    alertDiv.style.background = colors.background;
    alertDiv.style.color = colors.color;
    alertDiv.style.border = colors.border;
    alertDiv.textContent = message;

    window.setTimeout(() => {
      alertDiv.style.display = "none";
    }, 5000);
  }

  function setPending(form, message) {
    const button = form.querySelector('button[type="submit"]');

    if (!button) {
      return function restore() {};
    }

    const originalHtml = button.innerHTML;
    button.textContent = message;
    button.disabled = true;

    return function restore() {
      button.innerHTML = originalHtml;
      button.disabled = false;
    };
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
      await maybeSaveContactMessage(formData);

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
      await maybeSaveNewsletter(email, source);

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

      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      if (form.id !== "contactForm" && form.id !== "newsletterForm") {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (form.id === "contactForm") {
        handleContactForm(form);
      } else {
        handleNewsletterForm(form);
      }
    },
    true
  );

  document.documentElement.dataset.formMailer = "ready";

  window.sendContactFormEmail = function (payload) {
    return sendFormEmail("contact", payload);
  };

  window.sendNewsletterFormEmail = function (payload) {
    return sendFormEmail("newsletter", payload);
  };
})();

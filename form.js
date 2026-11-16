const form = document.getElementById("the-form");
const inputs = {
  // email: (input, errors) => {},
};

if (!form) throw new Error("No form present");
/** @type {NodeListOf<HTMLInputElement | HTMLSelectElement>} */
const inputElements = form.querySelectorAll("*[required]");
for (const input of inputElements) {
  input.addEventListener("input", (event) => {
    input.classList.remove("error");
    input.parentElement?.querySelector(".errors")?.replaceChildren();
    if (input.id == "password") {
      const ul = input.parentElement?.querySelector(".requirements");
      if (!ul) return;
      for (const li of ul.children) {
        li.classList.remove("error");
      }
    }
  });
}
form.addEventListener("submit", (event) => {
  let hasError = false;

  /**
   * @param {HTMLElement} element
   * @param {string} reason
   */
  function markError(element, reason) {
    hasError = true;
    element.classList.add("error");
    const li = document.createElement("li");
    li.textContent = reason;
    element.parentElement?.querySelector(".errors")?.appendChild(li);
  }

  for (const input of inputElements) {
    if (input instanceof HTMLInputElement) {
      const contents = input.value;
      switch (input.id) {
        case "e-mail": {
          const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
          const valid = emailRegex.test(contents);
          if (!valid) {
            markError(input, "Nieprawidłowy adres e-mail")
          }
          break;
        }
        case "password":
          {
            const isAtLeast8Chars = contents.length >= 8;
            const hasSmallLetters = /[a-z]/.test(contents);
            const hasCapitals = /[A-Z]/.test(contents);
            const hasDigits = /[0-9]/.test(contents);
            const hasSpecialCharacters = /[^a-zA-Z0-9]/.test(contents);

            if (!(isAtLeast8Chars && hasSmallLetters && hasCapitals && hasDigits && hasSpecialCharacters)) {
              hasError = true;
              input.classList.add("error");
              if (!isAtLeast8Chars) document.getElementById("at-least-8-chars")?.classList.add("error");
              if (!hasSmallLetters) document.getElementById("has-small-letters")?.classList.add("error");
              if (!hasCapitals) document.getElementById("has-capitals")?.classList.add("error");
              if (!hasDigits) document.getElementById("has-digits")?.classList.add("error");
              if (!hasSpecialCharacters) document.getElementById("has-special-chars")?.classList.add("error");
            }
          }
          break;
        case "name":
        case "last-name":
          break;
        case "address":
          break;
        case "date-of-birth":
          const date = input.valueAsDate;
          if (date == null) {
            markError(input, "Brak daty urodzenia");
            break;
          }
          if (date.getTime() >= Date.now()) {
            markError(input, "Nieprawidłowa data urodzenia");
          }
          break;
        case "phone-number":
          const phoneToTest = contents.startsWith("+") ? contents : "+48" + contents;
          if (!/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(phoneToTest)) {
            markError(input, "Nieprawidłowy numer telefonu");
          }
          break;
      }
    } else {
      if (input.id == "voievodeship") {
        if (input.selectedIndex == 0) {
          markError(input, "Nie zaznaczono województwa");
        }
      }
    }
  }

  if (hasError) event.preventDefault();
});

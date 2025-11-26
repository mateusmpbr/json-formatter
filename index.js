document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input");
  const output = document.getElementById("output");
  const formatBtn = document.getElementById("formatBtn");
  const minifyBtn = document.getElementById("minifyBtn");
  const copyBtn = document.getElementById("copyBtn");
  const pasteBtn = document.getElementById("pasteBtn");
  const validateBtn = document.getElementById("validateBtn");
  const toastEl = document.getElementById("toast");

  function setOutput(text) {
    output.textContent = text;
  }

  async function copyOutput() {
    try {
      const text = output.textContent || "";
      if (!text) {
        // quick feedback: nothing to copy
        copyBtn.textContent = "Empty";
        setTimeout(() => (copyBtn.textContent = "Copy output"), 900);
        return;
      }

      await navigator.clipboard.writeText(text);

      // show copied state
      copyBtn.classList.add("clicked");
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.classList.remove("clicked");
        copyBtn.textContent = "Copy output";
      }, 1400);
    } catch (err) {
      copyBtn.textContent = "Error";
      setTimeout(() => (copyBtn.textContent = "Copy output"), 1200);
    }
  }

  async function pasteInput() {
    try {
      const text = await navigator.clipboard.readText();

      if (!text) {
        // quick feedback: nothing to paste
        pasteBtn.textContent = "Empty";
        setTimeout(() => (pasteBtn.textContent = "Paste input"), 900);
        return;
      }

      input.value = text;

      // show copied state
      pasteBtn.classList.add("clicked");
      pasteBtn.textContent = "Pasted!";
      setTimeout(() => {
        pasteBtn.classList.remove("clicked");
        pasteBtn.textContent = "Paste input";
      }, 1400);
    } catch (err) {
      pasteBtn.textContent = "Error";
      setTimeout(() => (pasteBtn.textContent = "Paste input"), 1200);
    }
  }

  function setStatus(msg, ok) {
    if (!toastEl) return;
    // set text and classes
    toastEl.textContent = msg || "";
    toastEl.classList.remove("ok", "err", "show");
    if (ok === true) toastEl.classList.add("ok");
    else if (ok === false) toastEl.classList.add("err");
    // show toast
    toastEl.hidden = false;
    // force a reflow then add show for transition
    void toastEl.offsetWidth;
    toastEl.classList.add("show");
    clearTimeout(toastEl._hideTimer);
    toastEl._hideTimer = setTimeout(() => {
      toastEl.classList.remove("show");
      // allow transition then hide
      setTimeout(() => (toastEl.hidden = true), 200);
    }, 2400);
  }

  formatBtn.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(input.value);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setOutput("Invalid JSON");
      console.error("Invalid JSON: " + e);
    }
  });

  minifyBtn.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(input.value);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setOutput("Invalid JSON");
      console.error("Invalid JSON: " + e);
    }
  });

  if (validateBtn) {
    validateBtn.addEventListener("click", () => {
      try {
        JSON.parse(input.value);
        setStatus("Valid JSON", true);
      } catch (err) {
        setStatus(
          "Invalid JSON: " + (err && err.message ? err.message : String(err)),
          false
        );
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", copyOutput);
  }

  if (pasteBtn) {
    pasteBtn.addEventListener("click", pasteInput);
  }
});

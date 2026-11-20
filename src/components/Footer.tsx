export default function Footer() {
  return (
    <>
      <footer className="foot" id="foot">
        <span className="logo-box"><svg viewBox="0 0 8808 1700" role="img" aria-label="ProSeal"><use href="#wm" /></svg></span>
        <p className="foot-icons">
          <a href="tel:+35020047974" data-cta="foot-call" aria-label="Call +350 200 47974"><svg aria-hidden="true"><use href="#i-call" /></svg></a>
          {" "}
          <a href="mailto:info@prosealconstruction.com" data-cta="foot-mail" aria-label="Email ProSeal Construction"><svg aria-hidden="true"><use href="#i-mail" /></svg></a>
          {" "}
          <a href={"https://www.google.com/maps/search/?api=1&query=3%2F1+City+Mill+Lane+Gibraltar"} target="_blank" rel="noopener" aria-label="Open the office on the map"><svg aria-hidden="true"><use href="#i-pin" /></svg></a>
        </p>
        <p className="legal">© 2026 ProSeal Construction Ltd. Photographs taken on our own sites.</p>
      </footer>
    </>
  );
}

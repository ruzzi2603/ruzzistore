export default function Footer() {
  return (
    <footer className="footer" >
      <div className="footer-inner" id="footer">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} RuzziStore. Todos os direitos reservados.
        </p>
        <div className="footer-links">
          <a href="#" className="footer-link">Termos</a>
          <a href="#" className="footer-link">Privacidade</a>
        </div>
      </div>
    </footer>
  );
}

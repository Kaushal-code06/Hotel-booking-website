import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p className="footer__logo">Wayfare</p>
          <p className="footer__tag">Small hotels, chosen carefully.</p>
        </div>
        <div className="footer__cols">
          <div>
            <p className="footer__heading">Company</p>
            <a href="#about">About</a>
            <a href="#careers">Careers</a>
            <a href="#press">Press</a>
          </div>
          <div>
            <p className="footer__heading">Support</p>
            <a href="#help">Help center</a>
            <a href="#cancel">Cancellations</a>
            <a href="#contact">Contact</a>
          </div>
          <div>
            <p className="footer__heading">Legal</p>
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
          </div>
        </div>
      </div>
      <p className="footer__bottom">© {new Date().getFullYear()} Wayfare. All rights reserved.</p>
    </footer>
  )
}

export default function Footer() {
    return (
      <footer className="footer">
        <div className="footerGlass">
          <div className="footerGrid">
            <div>
              <div className="brand">
                <span>🛫</span><span>Flight Booker</span>
              </div>
              <p className="muted" style={{marginTop:8, fontSize:13}}>
                Demo app built with React + Vite. Data from Amadeus test API.
              </p>
            </div>
  
            <div>
              <h4>Explore</h4>
              <ul className="footerList">
                <li><a href="#">Popular routes</a></li>
                <li><a href="#">Deals</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
  
            <div>
              <h4>Follow</h4>
              <ul className="footerList">
                <li><a href="#">🌐 Website</a></li>
                <li><a href="#">🐦 Twitter</a></li>
                <li><a href="#">📸 Instagram</a></li>
              </ul>
            </div>
          </div>
  
          <div className="footerCopy">
            © {new Date().getFullYear()} Flight Booker · All rights reserved
          </div>
        </div>
      </footer>
    );
  }
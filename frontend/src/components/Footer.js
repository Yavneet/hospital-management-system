import React from "react";

function Footer() {
  return (
    <footer className="text-center mt-5 py-3 bg-light text-muted border-top">
      © {new Date().getFullYear()} Hospital Management System | Built with ❤️
    </footer>
  );
}

export default Footer;

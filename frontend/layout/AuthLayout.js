import React from "react";
import { Footer } from "../components/Footer";

export function AuthLayout(props) {
  return (
    <div>
      {props.children}
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

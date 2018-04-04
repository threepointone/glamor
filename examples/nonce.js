import React from "react";

// Import the test nonce setup before any glamor code is asked to
// produce any styles.
// https://github.com/styled-components/styled-components/issues/887#issuecomment-376479268
import "./nonce-set";
import { css } from "glamor";

let cls = css({ color: "blue" });

export class App extends React.Component {
  render() {
    return (
      <div className={cls}>
        Check the DOM, the style tag should have a nonce.
      </div>
    );
  }

  componentDidMount() {
    console.log("Nonce on style tag:", document.querySelector("style").nonce);
  }
}

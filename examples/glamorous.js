import React from 'react'
import { style, merge, hover } from '../src'

import '../src/reset' // css reset!

import { base, container, row, columns, half, oneThird, twoThirds, fullWidth } from '../src/ous'

let grayBg = style({ backgroundColor: '#eee', textAlign: 'center', borderRadius: 4 })
let grayCols = n => merge(columns(n), grayBg)


export class App extends React.Component {
  render() {
    return <div {...base}>
      <Grid/>
    </div>
  }
}

export class Grid extends React.Component {
  render() {
    // 'container' is main centered wrapper
    return <div {...container} >
      {/* columns should be the immediate child of a .row */}
      <div {...row}>
        <div {...columns(1)} {...hover({ color: 'red' })}> One </div>
        <div {...columns(11)}> Eleven </div>
      </div>
      
      <div {...row}>
        <div {...columns(2)}> Two </div>
        <div {...columns(10)}> Ten </div>
      </div>

      <div {...row}>
        <div {...grayCols(3)}> Three </div>
        <div {...grayCols(9)}> Nine </div>
      </div>

      <div {...row}>
        <div {...grayCols(4)}> Four </div>
        <div {...grayCols(8)}> Eight </div>
      </div>
    {/* shothand for half and thirds */}
      <div {...row}>
        <div {...oneThird()}> 1/3 </div>
        <div {...twoThirds()}> 2/3 </div>
      </div>      

      <div {...row}>
        <div {...half()}> 1/2 </div>
        <div {...half()}> 1/2 </div>
      </div> 

      <Typography/>
      <Buttons/>
      <Forms/>
      <Lists/>
      <Code/>
      <Tables/>


    </div>
  }
}

class Typography extends React.Component {
  render() {
    return <div>
      <h1> Heading </h1>
      <h2> Heading </h2>
      <h3> Heading </h3>
      <h4> Heading </h4>
      <h5> Heading </h5>
      <h6> Heading </h6>
      <p> the base type is 15px over 1.6 line height (24px) </p>
      <strong> bolded </strong>
      <em> italicized </em>
      <a> colored </a>
      <u> underlined </u>
    </div>
  }
}

import { button, primary } from '../src/ous'

class Buttons extends React.Component {
  render() {
    return <div>
      <div>
        <a {...button} href="#">Anchor button</a>
        <button>Button element</button>
        <input type="submit" value="submit input"/>
        <input type="button" value="button input"/>  
      </div>
      <div>
        <a {...button} {...primary} href="#">Anchor button</a>
        <button {...primary}>Button element</button>
        <input {...primary} type="submit" value="submit input"/>
        <input {...primary} type="button" value="button input"/>  
      </div>      
    </div>
  }
}

import { labelBody } from '../src/ous'

class Forms extends React.Component {
  render() {
    return <form>
      <div {...row}>
        <div {...columns(6)}>
          <label htmlFor="exampleEmailInput">Your email</label>
          <input {...fullWidth} type="email" placeholder="test@mailbox.com" id="exampleEmailInput"/>
        </div>
        <div {...columns(6)}>
          <label htmlFor="exampleRecipientInput">Reason for contacting</label>
          <select {...fullWidth} id="exampleRecipientInput">
            <option value="Option 1">Questions</option>
            <option value="Option 2">Admiration</option>
            <option value="Option 3">Can I get your number?</option>
          </select>
        </div>
      </div>
      <label htmlFor="exampleMessage">Message</label>
      <textarea {...fullWidth} placeholder="Hi Dave!" id="exampleMessage"></textarea>
      <label {...style({ float: 'right', marginTop: 12 })}>
        <input type="checkbox"/>
        <span {...labelBody}>Send a copy to yourself</span>
      </label>
      <input {...primary} type="submit" value="Submit"/>
    </form>
  }
}

class Lists extends React.Component {
  render() {
    return <div>
      <ul>
        <li>Item 1</li>
        <li>
          Item 2
          <ol>
            <li>Item 2.1</li>
            <li>Item 2.2</li>
          </ol>
        </li>
        <li>Item 3</li>
      </ul>
    </div>
  }
}


let code = `.some-class {
  background-color: red;
}`

class Code extends React.Component {
  render() {
    return <div>
      <pre><code>{code}</code></pre>
    </div>
  }
}


class Tables extends React.Component {
  render() {
    return <div>
      <table {...fullWidth}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dave Gamache</td>
            <td>26</td>
            <td>Male</td>
            <td>San Francisco</td>
          </tr>
          <tr>
            <td>Dwayne Johnson</td>
            <td>42</td>
            <td>Male</td>
            <td>Hayward</td>
          </tr>
        </tbody>
      </table>
    // </div>
  }
}

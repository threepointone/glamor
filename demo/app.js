// import '../src/reset' // css reset!
// import { base } from '../src/ous'
// import { fullWidth } from '../src/ous'

function log() {
  console.log(this) 
  return this
}


import React from 'react'

// import { override } from '../src/react'            // eslint-disable-line
import { keyframes } from '../src'
import { StyleSheet, css, createElement } from '../src/aphrodite'
/** @jsx createElement */

let kfs = keyframes({
  'from': {
    marginLeft: 0
  },

  'to': {
    marginLeft: '100px'
  }
})

const styles = StyleSheet.create({
  red: {
    color: 'red'
  },

  blue: {
    color: 'blue'
  },

  hover: {
    ':hover': {
      color: 'red'
    }
  },

  hoverBlue: {
    ':hover': {
      color: 'blue'
    }
  },

  small: {
    '@media (max-width: 600px)': {
      color: 'red'
    }
  },

  evenSmaller: {
    '@media (max-width: 400px)': {
      color: 'blue'
    }
  },

  smallAndHover: {
    '@media (max-width: 600px)': {
      color: 'red',
      ':hover': {
        color: 'blue'
      }
    },
    ':hover': {
      color: 'green'
    }
  },

  returnOfSmallAndHover: {
    '@media (max-width: 600px)': {
      color: 'blue',
      ':hover': {
        color: 'green'
      }
    },
    ':hover': {
      color: 'red'
    }
  },

  pseudoSelectors: {
    ':hover': {
      color: 'red'
    },
    ':active': {
      color: 'blue'
    }
  },

  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    outline: '1px solid black'
  },

  flexInner: {
    display: 'inline-block',
    width: 100,
    textAlign: 'justify',
    textAlignLast: 'justify'
  },

  animate: {
    animation: kfs,
    animationDuration: '2s',
    animationIterationCount: 'infinite'
  }
})


const styles2 = StyleSheet.create({
  red: {
    color: 'green'
  }
})


export class App extends React.Component {
  state = {
    timer: true
  }
  componentDidMount() {
    const flipTimer = () => {
      this.setState({
        timer: !this.state.timer
      })
      setTimeout(flipTimer, 1000)
    }

    setTimeout(flipTimer, 1000)
  }
  render() {
    const testCases = [
      <span className={css(styles.red)}>This should be red</span>,
      <span className={css(styles.hover)}>This should turn red on hover</span>,
      <span className={css(styles.small)}>This should turn red when the browser is less than 600px width</span>,
      <span className={css(styles.red, styles.blue)}>This should be blue</span>,
      <span className={css(styles.blue, styles.red)}>This should be red</span>,
      <span className={css(styles.hover, styles.blue)}>This should be blue but turn red on hover</span>,
      <span className={css(styles.small, styles.blue)}>This should be blue but turn red when less than 600px width</span>,
      <span className={css(styles.hover, styles.hoverBlue)}>This should turn blue on hover</span>,
      <span className={css(styles.small, styles.evenSmaller)}>This should turn red when less than 600px and blue when less than 400px</span>,
      <span className={css(styles.smallAndHover)}>This should be red when small, green when hovered, and blue when both.</span>,
      <span className={css(styles.smallAndHover, styles.returnOfSmallAndHover)}>This should be blue when small, red when hovered, and green when both.</span>,
      <span className={css(styles.red, styles2.red)}>This should be green.</span>,
      <span className={css(this.state.timer ? styles.red : styles.blue)}>This should alternate between red and blue every second.</span>,
      <a href="javascript: void 0" className={css(styles.pseudoSelectors)}>This should turn red on hover and ???? (blue or red) on active</a>,
      <div className={css(styles.flexCenter)}><div className={css(styles.flexInner)}>This should be centered inside the outer box, even in IE 10.</div></div>,
      <span className={css(styles.animate)}>This should animate</span>
    ]

    return <div>
      {testCases.map((testCase, i) => <div key={i}>{testCase}</div>)}
    </div>

  }
}

// import { hover } from '../src'

// export class App extends React.Component {
//   render() {
//     return <div css={hover({ color: 'red' })}>
//       what what
//     </div>
//   }
// }

// let buttonStyle = override()

// @buttonStyle.base({ backgroundColor: 'blue' })  
// // optional defaults
// class Button extends React.Component {                                            //eslint-disable-line
//   render() {
//     return <button {...this.props[buttonStyle.name]}>
//       {this.props.children}
//     </button>
//   }
// }

// @buttonStyle.add({ color: 'white' })
// // can do cumulative overrides! 
// // the 'higher' components get higher precedence 
// class ButtonGroup extends React.Component {                           //eslint-disable-line
//   render() {
//     return <div>
//       <Button>one</Button>
//       <Button>two</Button>
//       <Button>three</Button>
//     </div>
//   }
// }

// // can also pass a function if based on props
// @buttonStyle.add(props => ({ fontSize: 20 }))                        //eslint-disable-line
// class InlineForm extends React.Component {                            //eslint-disable-line
//   render() {
//     return <div>
//       <Button>one</Button>
//       <Button>two</Button>
//     </div>
//   }
// }

// export class App extends React.Component {
//   render() {
//     return <div>            
//       <ButtonGroup/>
//       <InlineForm/>
//     </div>
//   }
// }

// import { container, row, columns, half, oneThird, twoThirds } from '../src/ous'


// let grayBg = style({ backgroundColor: '#eee', textAlign: 'center', borderRadius: 4 })
// let grayCols = n => merge(columns(n), grayBg)


// export class Grid extends React.Component {
//   render() {
//     // 'container' is main centered wrapper
//     return <div {...container} >
//       {/* columns should be the immediate child of a .row */}
//       <div {...row}>
//         <div {...columns(1)} {...hover({ color: 'red' })}> One </div>
//         <div {...columns(11)}> Eleven </div>
//       </div>
      
//       <div {...row}>
//         <div {...columns(2)}> Two </div>
//         <div {...columns(10)}> Ten </div>
//       </div>

//       <div {...row}>
//         <div {...grayCols(3)}> Three </div>
//         <div {...grayCols(9)}> Nine </div>
//       </div>

//       <div {...row}>
//         <div {...grayCols(4)}> Four </div>
//         <div {...grayCols(8)}> Eight </div>
//       </div>
//     {/* shothand for half and thirds */}
//       <div {...row}>
//         <div {...oneThird()}> 1/3 </div>
//         <div {...twoThirds()}> 2/3 </div>
//       </div>      

//       <div {...row}>
//         <div {...half()}> 1/2 </div>
//         <div {...half()}> 1/2 </div>
//       </div> 

//       <Typography/>
//       <Buttons/>
//       <Forms/>
//       <Lists/>
//       <Code/>
//       <Tables/>


//     </div>
//   }
// }

// class Typography extends React.Component {
//   render() {
//     return <div>
//       <h1> Heading </h1>
//       <h2> Heading </h2>
//       <h3> Heading </h3>
//       <h4> Heading </h4>
//       <h5> Heading </h5>
//       <h6> Heading </h6>
//       <p> the base type is 15px over 1.6 line height (24px) </p>
//       <strong> bolded </strong>
//       <em> italicized </em>
//       <a> colored </a>
//       <u> underlined </u>
//     </div>
//   }
// }

// import { button, primary } from '../src/ous'

// class Buttons extends React.Component {
//   render() {
//     return <div>
//       <div>
//         <a {...button} href="#">Anchor button</a>
//         <button>Button element</button>
//         <input type="submit" value="submit input"/>
//         <input type="button" value="button input"/>  
//       </div>
//       <div>
//         <a {...button} {...primary} href="#">Anchor button</a>
//         <button {...primary}>Button element</button>
//         <input {...primary} type="submit" value="submit input"/>
//         <input {...primary} type="button" value="button input"/>  
//       </div>      
//     </div>
//   }
// }

// import { labelBody } from '../src/ous'

// class Forms extends React.Component {
//   render() {
//     return <form>
//       <div {...row}>
//         <div {...columns(6)}>
//           <label htmlFor="exampleEmailInput">Your email</label>
//           <input {...fullWidth} type="email" placeholder="test@mailbox.com" id="exampleEmailInput"/>
//         </div>
//         <div {...columns(6)}>
//           <label htmlFor="exampleRecipientInput">Reason for contacting</label>
//           <select {...fullWidth} id="exampleRecipientInput">
//             <option value="Option 1">Questions</option>
//             <option value="Option 2">Admiration</option>
//             <option value="Option 3">Can I get your number?</option>
//           </select>
//         </div>
//       </div>
//       <label htmlFor="exampleMessage">Message</label>
//       <textarea {...fullWidth} placeholder="Hi Dave!" id="exampleMessage"></textarea>
//       <label {...style({ float: 'right', marginTop: 12 })}>
//         <input type="checkbox"/>
//         <span {...labelBody}>Send a copy to yourself</span>
//       </label>
//       <input {...primary} type="submit" value="Submit"/>
//     </form>
//   }
// }

// class Lists extends React.Component {
//   render() {
//     return <div>
//       <ul>
//         <li>Item 1</li>
//         <li>
//           Item 2
//           <ol>
//             <li>Item 2.1</li>
//             <li>Item 2.2</li>
//           </ol>
//         </li>
//         <li>Item 3</li>
//       </ul>
//     </div>
//   }
// }


// let code = `.some-class {
//   background-color: red;
// }`

// class Code extends React.Component {
//   render() {
//     return <div>
//       <pre><code>{code}</code></pre>
//     </div>
//   }
// }


// class Tables extends React.Component {
//   render() {
//     return <div>
//       <table {...fullWidth}>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Age</th>
//             <th>Sex</th>
//             <th>Location</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>Dave Gamache</td>
//             <td>26</td>
//             <td>Male</td>
//             <td>San Francisco</td>
//           </tr>
//           <tr>
//             <td>Dwayne Johnson</td>
//             <td>42</td>
//             <td>Male</td>
//             <td>Hayward</td>
//           </tr>
//         </tbody>
//       </table>
//     // </div>
//   }
// }

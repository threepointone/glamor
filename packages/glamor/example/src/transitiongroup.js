import React from 'react'

import { css, insertRule } from 'glamor'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const Button = (props) => {
  return <div className="button" onClick={(e) => props.onClick(e)}>Click me</div>
}


let emptyStyleSheet = {
  enter: {},
  enterActive: {},
  leave: {},
  leaveActive: {}
}

insertRule(`body {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
}`)

insertRule(`.button {
    position: absolute;
    height: 32px;
    line-height: 32px;
    width: 128px;
    text-align: center;
    border: 1px solid rgba(64, 64, 64, 0.1);
    background-color: #e74c3c;
    color: white;
    cursor: pointer;
}`)

insertRule(`.button:first-child {
    top: 64px;
    left: 64px;
}`)

insertRule(`.button:nth-child(2) {
    top: 264px;
    left: 264px;
}`)

insertRule(`.dialog {
    box-sizing: border-box;
    padding: 150px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    background-color: #34495e;
    color: #ecf0f1;
    cursor: pointer;
    font-size: 2rem;
}`)


class UnicornDialog extends React.Component {

  constructor(props) {
    super(props)
    this.state = { sheet: emptyStyleSheet }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (!nextProps.show) {
      return
    }

    let viewportRect = document.body.getBoundingClientRect()
    let sourceRect = nextProps.startRect
        
    let viewportCenterX = viewportRect.left + (viewportRect.width / 2)
    let viewportCenterY = viewportRect.top + (viewportRect.height / 2)

    let sourceCenterX = sourceRect.left + (sourceRect.width / 2)
    let sourceCenterY = sourceRect.top + (sourceRect.height / 2)

    let dx = sourceCenterX - viewportCenterX
    let dy = sourceCenterY - viewportCenterY
        
    let sheet = css({
      '&.enter': { 
        opacity: 0, 
        transform: `translate(${dx}px, ${dy}px) scale(0.01)` 
      },
      '&.enter-active': { 
        opacity: 1, 
        transform: 'translate(0, 0) scale(1)', 
        transition: 'transform 750ms cubic-bezier(0, 0, 0.2, 1), opacity 750ms cubic-bezier(0, 0, 0.2, 1)' 
      },
      '&.leave': {
        opacity: 1, 
        transform: 'translate(0, 0) scale(1)'
      },
      '&.leave.leave-active': { 
        opacity: 0, 
        transform: `translate(${dx}px, ${dy}px) scale(0.01)`, 
        transition: 'transform 750ms cubic-bezier(0, 0, 0.2, 1), opacity 750ms cubic-bezier(0, 0, 0.2, 1)' 
      }
    })

    this.setState({ sheet })
  }

  render() {
    let child = <div key='dialog' className='dialog' onClick={this.props.onClick} {...this.state.sheet} >
      click anywhere to dismiss
    </div>

    if (!this.props.show) {
      child = null
    }

    return <ReactCSSTransitionGroup
        transitionName={{
          enter: 'enter',
          enterActive: 'enter-active',
          leave: 'leave',
          leaveActive: 'leave-active'
        }}
        transitionEnterTimeout={750}
        transitionLeaveTimeout={750}>
          {child}
      </ReactCSSTransitionGroup>
  }
}


export class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = { startRect: null, show: false }
  }

  showDialog(e) {
    let startRect = e.target.getBoundingClientRect()
    let show = true
    this.setState({ startRect, show })
  }

  hideDialog() {
    this.setState({ startRect: null, show: false })
  }


  render() {
    return <div>
        <Button onClick={this.showDialog.bind(this)} />
        <Button onClick={this.showDialog.bind(this)} />
        <UnicornDialog {...this.state} onClick={this.hideDialog.bind(this)} />
    </div>
  }
}



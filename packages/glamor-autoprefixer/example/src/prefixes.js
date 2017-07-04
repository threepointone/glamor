import React from 'react'
import { css } from 'glamor'


export class App extends React.Component {
    render() {
        return <input
            {...css({ display: 'flex', '::placeholder': { color: 'red' } }) }
            placeholder="some text"
        />
    }
}

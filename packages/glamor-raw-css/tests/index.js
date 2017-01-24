import { _css } from '../src/raw'
describe('css', () => {
  // how to test the plugin?
  let node
  beforeEach(() => {
    node = document.createElement('div')
      document.body.appendChild(node)
  })

    afterEach(() => {
      unmountComponentAtNode(node)
        document.body.removeChild(node)
        flush()
    })
    it('can parse some css and return a rule', () => {
      // css` color: red `
      let red = 'red'
      let rule = _css`
      color: yellow; /* 'real' css syntax */
      font-weight: bold;
      /* pseudo classes */
      :hover {
        /* just javascript */
        color: ${ red };
      }

      /* contextual selectors */
      & > h1 { color: purple }
      html.ie9 & span { padding: 300px }
      & [type='checked'] { border: 1px dashed black }

      /* compose with objects */
      ${{ color: 'red' }}

      /* or more rules */
      ${ _css`color: greenish` }

      /* media queries */
      @media (min-width: 300px) {
        color: orange;
        border: 1px solid blue;
        ${{ color: 'brown' }}
        /* increase specificity */
        && {
          color: blue;
          ${{ color: 'browner' }}
        }
      }
    `
      expect(rule).toEqual([
        { 'color': 'yellow' },
        { 'fontWeight': 'bold' },
        { ':hover': { 'color': 'red' } },
        { '&>h1': { 'color': 'purple' } },
        { 'html.ie9 & span': { 'padding': '300px' } },
        { '& [type=checked]': { 'border': '1px dashed black' } },
        [ { 'color': 'red' } ],
        [ [ { color: 'greenish' } ] ],
        { '@media (min-width:300px)': [
          { 'color': 'orange' },
          { 'border': '1px solid blue' },
          [ { 'color': 'brown' } ],
          { '&&': { 'color': 'browner' } }
        ] }
      ])

    })
})

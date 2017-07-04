import { css } from 'glamor'

css.insert('html { font-size: 62.5% }')

export const container = css(
  {
    position: 'relative',
    width: '100%',
    maxWidth: 960,
    margin: '0 auto',
    padding: '0 20px',
    boxSizing: 'border-box',
    '@media (min-width: 400px)': {
      width: '85%',
      padding: 0
    },
    '@media (min-width: 550px)': {
      width: '80%'
    },
    ':after': {
      content: '""',
      display: 'table',
      clear: 'both'
    }
  }
)

let widths = [
  null, // 0 - don't even 
  '4.66666666667%', // 1
  '13.3333333333%', // 2 
  '22%',            // 3
  '30.6666666667%', // 4
  '39.3333333333%', // 5
  '48%',            // 6
  '56.6666666667%', // 7
  '65.3333333333%', // 8
  '74.0%',          // 9
  '82.6666666667%', // 10
  '91.3333333333%', // 11
  '100%'            // 12 - don't forget the margin 
]

let fractionalWidths = {
  half: '48%',
  oneThird: '30.6666666667%',
  twoThirds: '65.3333333333%'
}

let offsets = [
  null, // 0 - don't even 
  '8.66666666667%', // 1
  '17.3333333333%', // 2
  '26%',            // 3
  '34.6666666667%', // 4 
  '43.3333333333%', // 5 
  '52%',            // 6 
  '60.6666666667%', // 7
  '69.3333333333%', // 8
  '78.0%',          // 9
  '86.6666666667%', // 10
  '95.3333333333%'  // 11  
]

let fractionalOffsets = {
  half: '34.6666666667%',
  oneThird: '69.3333333333%',
  twoThirds: '52%'
}

export const row = css({
  ':after': {
    content: '""',
    display: 'table',
    clear: 'both'
  }
})

export const columns = (n, offset) => css(
  {
    width: '100%',
    float: 'left',
    boxSizing: 'border-box',
    '@media (min-width: 550px)': {
      marginLeft: '4%'
    },
    ':first-child': {
      marginLeft: 0
    }
  },
  {
    width: typeof n === 'number' ? widths[n] : fractionalWidths[n]
  }, n === 12 && {
    marginLeft: 0
  }, offset && {
    marginLeft: typeof n === 'number' ? offsets[offset] : fractionalOffsets[offset]
  })


export const half = offset => columns('half', offset)
export const oneThird = offset => columns('oneThird', offset)
export const twoThirds = offset => columns('twoThirds', offset)


export const button = css({ label: 'button' })
export const primary = css({ label: 'primary' })

export const labelBody = css({ label: 'labelBody' })

const buttonId = '[' + Object.keys(button)[0] + ']' //`[data-css-${idFor(button)}]`
const primaryId = '[' + Object.keys(primary)[0] + ']'//`[data-css-${idFor(primary)}]`
const labelBodyId = '[' + Object.keys(labelBody)[0] + ']' //`[data-css-${idFor(labelBody)}]`

export const base = css(
  {
    fontSize: '1.5em',
    lineHeight: '1.6',
    fontWeight: 400,
    fontFamily: '"Raleway", "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif',
    color: '#222',

    // typography
    ' h1, h2, h3, h4, h5, h6': {
      marginTop: 0,
      marginBottom: '2rem',
      fontWeight: 300
    },
  },
  ...[
    [{ fontSize: '4.0rem', lineHeight: 1.2, letterSpacing: '-.1rem' }, 5.0],
    [{ fontSize: '3.6rem', lineHeight: 1.25, letterSpacing: '-.1rem' }, 4.2],
    [{ fontSize: '3.0rem', lineHeight: 1.3, letterSpacing: '-.1rem' }, 3.6],
    [{ fontSize: '2.4rem', lineHeight: 1.35, letterSpacing: '-.08rem' }, 3.0],
    [{ fontSize: '1.8rem', lineHeight: 1.5, letterSpacing: '-.05rem' }, 2.4],
    [{ fontSize: '1.5rem', lineHeight: 1.6, letterSpacing: 0 }, 1.5]].map((x, i) =>
      css({
        [` h${i + 1}`]: x[0],
        '@media (min-width: 550px)': {
          [` h${i + 1}`]: { // larger than phablet 
            fontSize: `${x[1]}rem`
          }
        }
      })),
  {
    ' p': {
      marginTop: 0
    },
    // links
    ' a': {
      color: '#1EAEDB'
    },
    ' a:hover': {
      color: '#0FA0CE'
    },
    // buttons 
    [` button, input[type="submit"], input[type="reset"], input[type="button"], ${buttonId}`]: {
      display: 'inline-block',
      height: 38,
      padding: '0 30px',
      color: '#555',
      textAlign: 'center',
      fontSize: 11,
      fontWeight: 600,
      lineHeight: '38px',
      letterSpacing: '.1rem',
      textTransform: 'uppercase',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      backgroundColor: 'transparent',
      borderRadius: 4,
      border: '1px solid #bbb',
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    [` ${buttonId}:hover, button:hover, input[type="submit"]:hover, input[type="reset"]:hover, input[type="button"]:hover, ${buttonId}:focus, button:focus, input[type="submit"]:focus, input[type="reset"]:focus, input[type="button"]:focus`]: {
      color: '#333',
      borderColor: '#888',
      outline: 0
    },
    [` ${buttonId}${primaryId}, button${primaryId}, input[type="submit"]${primaryId}, input[type="reset"]${primaryId}, input[type="button"]${primaryId}`]: {
      color: '#FFF',
      backgroundColor: '#33C3F0',
      borderColor: '#33C3F0'
    },
    [` ${buttonId}${primaryId}:hover, button${primaryId}:hover, input[type="submit"]${primaryId}:hover, input[type="reset"]${primaryId}:hover, input[type="button"]${primaryId}:hover, ${buttonId}${primaryId}:focus, button${primaryId}:focus, input[type="submit"]${primaryId}:focus, input[type="reset"]${primaryId}:focus, input[type="button"]${primaryId}:focus`]: {
      color: '#FFF',
      backgroundColor: '#1EAEDB',
      borderColor: '#1EAEDB'
    },

    // forms 
    ' input[type="email"], input[type="number"], input[type="search"], input[type="text"], input[type="tel"], input[type="url"], input[type="password"], textarea, select': {
      height: '38px',
      padding: '6px 10px', /* The 6px vertically centers text on FF, ignored by Webkit */
      backgroundColor: '#fff',
      border: '1px solid #D1D1D1',
      borderRadius: '4px',
      boxShadow: 'none',
      boxSizing: 'border-box'
    },
    ' input[type="email"], input[type="number"], input[type="search"], input[type="text"], input[type="tel"], input[type="url"], input[type="password"], textarea': {
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      appearance: 'none'
    },
    ' textarea': {
      minHeight: 65,
      paddingTop: 6,
      paddingBottom: 6
    },
    ' input[type="email"]:focus, input[type="number"]:focus, input[type="search"]:focus, input[type="text"]:focus, input[type="tel"]:focus, input[type="url"]:focus, input[type="password"]:focus, textarea:focus, select:focus': {
      border: '1px solid #33C3F0',
      outline: 0
    },
    ' label, legend': {
      display: 'block',
      marginBottom: '.5rem',
      fontWeight: 600
    },
    ' fieldset': {
      padding: 0,
      borderWidth: 0
    },
    ' input[type="checkbox"], input[type="radio"]': {
      display: 'inline'
    },
    [` label > ${labelBodyId}`]: {
      display: 'inline-block',
      marginLeft: '.5rem',
      fontWeight: 'normal'
    },


    // lists 
    ' ul': {
      listStyle: 'circle inside'
    },
    ' ol': {
      listStyle: 'decimal inside'
    },
    ' ol, ul': {
      paddingLeft: 0,
      marginTop: 0
    },
    ' ul ul, ul ol, ol ul, ol ol': {
      margin: '1.5rem 0 1.5rem 3rem',
      fontSize: '90%'
    },
    ' li': {
      marginBottom: '1rem'
    },

    // code 
    ' code': {
      padding: '.2rem .5rem',
      margin: '0 .2rem',
      fontSize: '90%',
      whiteSpace: 'nowrap',
      background: '#F1F1F1',
      border: '1px solid #E1E1E1',
      borderRadius: '4px'
    },
    ' pre > code': {
      display: 'block',
      padding: '1rem 1.5 rem',
      whiteSpace: 'pre'
    },

    // tables 
    ' th, td': {
      padding: '12px 15px',
      textAlign: 'left',
      borderBottom: '1px solid #E1E1E1'
    },
    ' th:first-child, td:first-child': {
      paddingLeft: 0
    },
    ' th:last-child, td:last-child': {
      paddingRight: 0
    },


    // spacing
    ' button': {
      marginBottom: '1rem'
    },
    ' input, textarea, select, fieldset': {
      marginBottom: '1.5rem'
    },
    ' pre, blockquote, dl, figure, table, p, ul, ol, form': {
      marginBottom: '2.5rem'
    },

    // misc 
    ' hr': {
      marginTop: '3rem',
      marginBottom: '3.5rem',
      borderWidth: 0,
      borderTop: '1px solid #E1E1E1'
    }
  }
)

// utilities 
export const fullWidth = css({
  width: '100%',
  boxSizing: 'border-box'
})

export const maxFullWidth = css({
  maxWidth: '100%',
  boxSizing: 'border-box'
})

export const pullRight = css({
  float: 'right'
})

export const pullLeft = css({
  float: 'left'
})

export const clearfix = css({
  content: '""',
  display: 'table',
  clear: 'both'
})



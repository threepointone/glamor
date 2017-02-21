// CSS Grammar
// ===========
//
// Based on grammar from CSS 2.1 specification [1] (including the errata [2]).
// Generated parser builds a syntax tree composed of nested JavaScript objects,
// vaguely inspired by CSS DOM [3]. The CSS DOM itself wasn't used as it is not
// expressive enough (e.g. selectors are reflected as text, not structured
// objects) and somewhat cumbersome.
//
// Limitations:
//
//   * Many errors which should be recovered from according to the specification
//     (e.g. malformed declarations or unexpected end of stylesheet) are fatal.
//     This is a result of straightforward rewrite of the CSS grammar to PEG.js.
//
// [1] http://www.w3.org/TR/2011/REC-CSS2-20110607
// [2] http://www.w3.org/Style/css2-updates/REC-CSS2-20110607-errata.html
// [3] http://www.w3.org/TR/DOM-Level-2-Style/css.html

{
  function extractOptional(optional, index) {
    return optional ? optional[index] : null;
  }

  function extractList(list, index) {
    return list.map(function(element) { return element[index]; });
  }

  function buildList(head, tail, index) {
    return [head].concat(extractList(tail, index))
      .filter(function(element) { return element !== null; });
  }

  function buildExpression(head, tail) {
    return tail.reduce(function(result, element) {
      return {
        type: "Expression",
        operator: element[0],
        left: result,
        right: element[1]
      };
    }, head);
  }
}

start
  = comment* S* stylesheet:stylesheet comment* { return stylesheet; }

// ----- G.1 Grammar -----

stylesheet
  = rules:((stubs / ruleset / media / declare) (CDO S* / CDC S*)*)*
    {
      return {
        type: 'StyleSheet',
        rules: extractList(rules, 0)}
    }

declare = dec:declaration S* ";"? S*  { return dec }

media
  = MEDIA_SYM S* media:mlist "{" S* rules:(stubs / ruleset / declare)* "}" S* {
      return {
        type: "MediaRule",
        media: media,
        rules: rules
      };
    }


mlist = head:mquery tail:("," S* mquery)* { return buildList(head, tail, 2) }

mquery = prefix:("only" / "not")? S* type:( stub / property) S* exprs:("and" S* x:(stub / mexpr) S* { return x } )* { 
      return { 
        type:'MediaQuery', 
        prefix, 
        type, 
        exprs 
      }
    }  
  / head:(stub / mexpr) tail:("and" S* x:(stub / mexpr) S* { return x })* S* { 
      return { 
        type:'MediaQuery', 
        exprs: buildList(head, tail, 2) 
      }
    }  

mexpr = "(" S* feat:property S* t:(":"? S* t:term { return t })* S* ")" { 
  return { 
    type: 'MediaExpr', 
    feature: feat, 
    value: t 
  }
}


operator
  = "/" S* { return "/"; }
  / "," S* { return ","; }

combinator
  = "+" S* { return "+"; }
  / ">" S* { return ">"; }

property
  = name:IDENT S* { return name; }

ruleset
  = selectorsHead:selector
    selectorsTail:("," S* selector)*
    "{" S*
    declarationsHead:declaration?
    declarationsTail:(";" S* declaration?)*
    "}" S*
    {
      
      return {
        type: "RuleSet",
        selectors: buildList(selectorsHead, selectorsTail, 2),
        declarations: buildList(declarationsHead, declarationsTail, 2)
      };
    }

selector
  = combinator:combinator S* right:selector {
    return {
      type: "Selector",
      combinator: combinator,
      left: { type: 'Contextual' },
      right: right
    }
  }
  / left:simple_selector S* combinator:combinator right:selector {
      return {
        type: "Selector",
        combinator: combinator,
        left: left,
        right: right
      };
    }
  / left:simple_selector S+ right:selector {
      return {
        type: "Selector",
        combinator: " ",
        left: left,
        right: right
      };
    }
  / selector:simple_selector S* { return selector; }

simple_selector
  = inter: stub { return  inter} / 
  element:element_name qualifiers:(stub / id / class / attrib / pseudo / contextual)* {
      return {
        type: "SimpleSelector",
        element: element,
        all: element === '*',
        qualifiers: qualifiers
      };
    }
  / qualifiers:(stub / id / class / attrib / pseudo/ contextual)+ {
      return {
        type: "SimpleSelector",
        element: "*",
        all: false,
        qualifiers: qualifiers
      };
    }

stubs = stubsHead:stub
    stubsTail:(";" S* stub?)* {
      return {
        type: "Stubs",        
        stubs: buildList(stubsHead, stubsTail, 2)
      };
    }

stub = stub_id:(S_ P U R "-" num) S*  { 
    return { 
      type:'Stub', 
      id: stub_id.join('').trim() 
      } 
    }

contextual
  = AMP { return { type: 'Contextual' } }

id
  = id:HASH { return { type: "IDSelector", id: id }; }

class
  = "." class_:IDENT { return { type: "ClassSelector", "class": class_ }; }

element_name
  = IDENT
  / "*"

attrib
  = "[" S*
    attribute:IDENT S*
    operatorAndValue:(("=" / INCLUDES / DASHMATCH / BEGINSWITH / ENDSWITH / CONTAINS) S* (IDENT / STRING) S*)?
    "]"
    {
      let operator = extractOptional(operatorAndValue, 0)
      if(Array.isArray(operator)){
        operator = operator[1]
      }
      return {
        type: "AttributeSelector",
        attribute: attribute,
        operator: operator,
        value: extractOptional(operatorAndValue, 2)
      };
    }

pseudo
  = ":"
    value:(
        name:FUNCTION S* params:(IDENT S*)? ")" {
          return {
            type: "Function",
            name: name,
            params: params !== null ? [params[0]] : []
          };
        }
      / IDENT
    )
    { return { type: "PseudoSelector", value: value }; }

declaration
  = name:property ':' S* value:expr prio:prio? {

      return {
        type: "Declaration",
        name: name,
        value: value,
        important: prio !== null
      };
    }
  / inter: stub { return inter } 

prio
  = IMPORTANT_SYM S*

expr
  = head:term tail:(operator? term)* { return buildExpression(head, tail); }

term
  = quantity:(PERCENTAGE / LENGTH / EMS / EXS / ANGLE / TIME / FREQ / NUMBER)
    S*
    {
      return {
        type: "Quantity",
        value: quantity.value,
        unit: quantity.unit
      };
    }
  / value:STRING S* { return { type: "String", value: value }; }
  / value:URI S*    { return { type: "URI",    value: value }; }
  / function
  / hexcolor
  / inter: stub { return inter }
  / value:IDENT S*  { return { type: "Ident",  value: value }; }
  

function
  = name:FUNCTION S* params:expr ")" S* {
      return { type: "Function", name: name, params: params };
    }

hexcolor
  = value:HASH S* { return { type: "Hexcolor", value: value }; }

// ----- G.2 Lexical scanner -----

// Macros

h
  = [0-9a-f]i

nonascii
  = [\x80-\uFFFF]

unicode
  = "\\" digits:$(h h? h? h? h? h?) ("\r\n" / [ \t\r\n\f])? {
      return String.fromCharCode(parseInt(digits, 16));
    }

escape
  = unicode
  / "\\" ch:[^\r\n\f0-9a-f]i { return ch; }

nmstart
  = [_a-z]i
  / nonascii
  / escape

nmchar
  = [_a-z0-9-]i
  / nonascii
  / escape

string1
  = '"' chars:([^\n\r\f\\"] / "\\" nl:nl { return ""; } / escape)* '"' {
      return chars.join("");
    }

string2
  = "'" chars:([^\n\r\f\\'] / "\\" nl:nl { return ""; } / escape)* "'" {
      return chars.join("");
    }

comment
  = "/*" [^*]* "*"+ ([^/*] [^*]* "*"+)* "/"

ident
  = prefix:$"-"*  start:nmstart chars:nmchar* {
      return prefix + start + chars.join("");
    }

name
  = chars:nmchar+ { return chars.join(""); }

num
  = [+-]? (([0-9]* "." [0-9]+) / [0-9]+ ) ("e" [+-]? [0-9]+)? {
      return parseFloat(text());
    }

string
  = string1
  / string2

url
  = (inter:stub) { return inter } / chars:([!#$%&*-\[\]-~] / nonascii / escape)* { chars.join(""); }

s
  = [ \t\r\n\f]+

w
  = s?

nl
  = "\n"
  / "\r\n"
  / "\r"
  / "\f"

A  = "a"i / "\\" "0"? "0"? "0"? "0"? [\x41\x61] ("\r\n" / [ \t\r\n\f])? { return "a"; }
C  = "c"i / "\\" "0"? "0"? "0"? "0"? [\x43\x63] ("\r\n" / [ \t\r\n\f])? { return "c"; }
D  = "d"i / "\\" "0"? "0"? "0"? "0"? [\x44\x64] ("\r\n" / [ \t\r\n\f])? { return "d"; }
E  = "e"i / "\\" "0"? "0"? "0"? "0"? [\x45\x65] ("\r\n" / [ \t\r\n\f])? { return "e"; }
G  = "g"i / "\\" "0"? "0"? "0"? "0"? [\x47\x67] ("\r\n" / [ \t\r\n\f])? / "\\g"i { return "g"; }
H  = "h"i / "\\" "0"? "0"? "0"? "0"? [\x48\x68] ("\r\n" / [ \t\r\n\f])? / "\\h"i { return "h"; }
I  = "i"i / "\\" "0"? "0"? "0"? "0"? [\x49\x69] ("\r\n" / [ \t\r\n\f])? / "\\i"i { return "i"; }
K  = "k"i / "\\" "0"? "0"? "0"? "0"? [\x4b\x6b] ("\r\n" / [ \t\r\n\f])? / "\\k"i { return "k"; }
L  = "l"i / "\\" "0"? "0"? "0"? "0"? [\x4c\x6c] ("\r\n" / [ \t\r\n\f])? / "\\l"i { return "l"; }
M  = "m"i / "\\" "0"? "0"? "0"? "0"? [\x4d\x6d] ("\r\n" / [ \t\r\n\f])? / "\\m"i { return "m"; }
N  = "n"i / "\\" "0"? "0"? "0"? "0"? [\x4e\x6e] ("\r\n" / [ \t\r\n\f])? / "\\n"i { return "n"; }
O  = "o"i / "\\" "0"? "0"? "0"? "0"? [\x4f\x6f] ("\r\n" / [ \t\r\n\f])? / "\\o"i { return "o"; }
P  = "p"i / "\\" "0"? "0"? "0"? "0"? [\x50\x70] ("\r\n" / [ \t\r\n\f])? / "\\p"i { return "p"; }
R  = "r"i / "\\" "0"? "0"? "0"? "0"? [\x52\x72] ("\r\n" / [ \t\r\n\f])? / "\\r"i { return "r"; }
S_ = "s"i / "\\" "0"? "0"? "0"? "0"? [\x53\x73] ("\r\n" / [ \t\r\n\f])? / "\\s"i { return "s"; }
T  = "t"i / "\\" "0"? "0"? "0"? "0"? [\x54\x74] ("\r\n" / [ \t\r\n\f])? / "\\t"i { return "t"; }
U  = "u"i / "\\" "0"? "0"? "0"? "0"? [\x55\x75] ("\r\n" / [ \t\r\n\f])? / "\\u"i { return "u"; }
V  = "v"i / "\\" "0"? "0"? "0"? "0"? [\x56\x76] ("\r\n" / [ \t\r\n\f])? / "\\v"i { return "v"; }
W  = "w"i / "\\" "0"? "0"? "0"? "0"? [\x57\x77] ("\r\n" / [ \t\r\n\f])? / "\\w"i { return "w"; }
X  = "x"i / "\\" "0"? "0"? "0"? "0"? [\x58\x78] ("\r\n" / [ \t\r\n\f])? / "\\x"i { return "x"; }
Z  = "z"i / "\\" "0"? "0"? "0"? "0"? [\x5a\x7a] ("\r\n" / [ \t\r\n\f])? / "\\z"i { return "z"; }

// Tokens

AMP "ampersand"
  = "&"

S "whitespace"
  = comment* s

CDO "<!--"
  = comment* "<!--"

CDC "-->"
  = comment* "-->"

INCLUDES "~="
  = comment* "~="

DASHMATCH "|="
  = comment* "|="

BEGINSWITH "^="
  = comment* "^="

ENDSWITH "$="
  = comment* "$="  

CONTAINS "*="
  = comment* "*="

STRING "string"
  = comment* string:string { return string; }

IDENT "identifier"
  = comment* ident:ident { return ident; }

HASH "hash"
  = comment* "#" name:name { return "#" + name; }

IMPORT_SYM "@import"
  = comment* "@" I M P O R T

MEDIA_SYM "@media"
  = comment* "@" M E D I A

// We use |s| instead of |w| here to avoid infinite recursion.
IMPORTANT_SYM "!important"
  = comment* "!" (s / comment)* I M P O R T A N T

EMS "length"
  = comment* value:(num / stub) E M { return { value: value, unit: "em" }; }

EXS "length"
  = comment* value:(num / stub) E X { return { value: value, unit: "ex" }; }

LENGTH "length"
  = comment* value:(num / stub) P X { return { value: value, unit: "px" }; }
  / comment* value:(num / stub) C M { return { value: value, unit: "cm" }; }
  / comment* value:(num / stub) M M { return { value: value, unit: "mm" }; }
  / comment* value:(num / stub) I N { return { value: value, unit: "in" }; }
  / comment* value:(num / stub) P T { return { value: value, unit: "pt" }; }
  / comment* value:(num / stub) P C { return { value: value, unit: "pc" }; }
  / comment* value:(num / stub) R E M { return { value: value, unit: "rem" }; }
  / comment* value:(num / stub) V H { return { value: value, unit: "vh" }; }
  / comment* value:(num / stub) V W { return { value: value, unit: "vw" }; }
  / comment* value:(num / stub) V M I N { return { value: value, unit: "vmin" }; }
  / comment* value:(num / stub) E X { return { value: value, unit: "ex" }; }

ANGLE "angle"
  = comment* value:(num / stub) D E G   { return { value: value, unit: "deg"  }; }
  / comment* value:(num / stub) R A D   { return { value: value, unit: "rad"  }; }
  / comment* value:(num / stub) G R A D { return { value: value, unit: "grad" }; }

TIME "time"
  = comment* value:(num / stub) M S_ { return { value: value, unit: "ms" }; }
  / comment* value:(num / stub) S_   { return { value: value, unit: "s"  }; }

FREQ "frequency"
  = comment* value:(num / stub) H Z   { return { value: value, unit: "hz" }; }
  / comment* value:(num / stub) K H Z { return { value: value, unit: "kh" }; }

PERCENTAGE "percentage"
  = comment* value:(num / stub) "%" { return { value: value, unit: "%" }; }

NUMBER "number"
  = comment* value:num { return { value: value, unit: null }; }

URI "uri"
  = comment* U R L "("i w url:string w ")" { return url; }
  / comment* U R L "("i w url:url w ")"    { return url; }

FUNCTION "function"
  = comment* name:ident "(" { return name; }
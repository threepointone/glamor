Key
Value
Semi
OpenBrace
CloseBrace
Pseudo
Media


`
color: red;
font-weight: ${props => props.weight || 200};
:hover {
  color: blue
}
`


ws "whitespace" = [ \t\n\r]*
Semi = \;
OpenBrace = \{
CloseBrace = \}
Pseudo = \:\:[a-z\(\)0-9A-Z]
Media = \@media[a-z\(\)0-9A-Z]
Key = [a-zA-Z0-9\-] ws \:
Value = [a-zA-Z0-9\-\(\)\'\"] Semi
// fixes inconsistencies between browsers
export function normalizeCssText(output: string) {
   return output
    // some browsers produce "@media (...) { \n" and some "@media (...) {\n"
    .replace(/{\s\n/g, '{\n')
    // some browsers produce "a {  }" and some "a { }"
    .replace(/{\s\s}/g, '{ }');
}

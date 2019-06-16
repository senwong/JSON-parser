const fs = require("fs");
const path = require("path");
const filename = "source.json";
let source: string = fs.readFileSync(path.resolve(__dirname, filename), {
  encoding: "utf8"
});

function deleteAllSpaces() {
  return source.replace(/\s*/g, "");
}
source = deleteAllSpaces();

let start = 0;
function parseValue() {
  switch (source[start]) {
    case '"':
      return parseString();
    case "f":
      return parseFalse();
    case "t":
      return parseTrue();
    case "{":
      return parseObject();
    case "[":
      return parserArray();
  }
}
function parseString(): string {
  start++;
  const endIdx = source.indexOf('"', start);
  if (endIdx < 0) {
    throw new Error("string no end quote! str: " + source.slice(start));
  }
  const str = source.slice(start, endIdx);
  start = endIdx + 1;
  return str;
}
function parseFalse(): false {
  const f = source.slice(start, start + 5);
  if (f !== "false") {
    throw new Error("unrecognized character: " + f);
  }
  start += 5;
  return false;
}
function parseTrue(): false {
  const f = source.slice(start, start + 4);
  if (f !== "true") {
    throw new Error("unrecognized character: " + f);
  }
  start += 4;
  return false;
}
function handleComma(value) {
  if (source[start] === '"') {
    throw new Error("should have a comma!" + value);
  } else if (source[start] === ",") {
    if (source[start + 1] === "}") {
      throw new Error("last value should not have comma" + value);
    }
    start++; // ","
  }
}

function parseObject() {
  start++; // {
  const ret = {};
  while (source[start] !== "}") {
    const key = parseString();
    start++; // :
    const value = parseValue();
    ret[key] = value;
    handleComma(value);
  }
  start++; // }
  return ret;
}
function parserArray() {
  start++;
  const ret = [];
  while (source[start] !== "]") {
    const value = parseValue();
    ret.push(value);
    handleComma(value);
  }
  start++;
  return ret;
}
const obj = parseValue();
console.log(obj);

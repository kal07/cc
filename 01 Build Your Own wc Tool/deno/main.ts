import { Command } from "npm:commander";

const app = new Command();

app
  .name("wc")
  .description("print newline, word, and byte counts for each file")
  .version("0.0.1")
  .argument("<input-file>", "file path is missing")
  .option("-c", "outputs the number of bytes", false)
  .option("-l", "outputs the number of lines", false)
  .option("-w", "outputs the number of words", false)
  .option("-m", "outputs the number of characters", false);

app.parse();
const options = app.opts();
const args = app.args[0];

//Read File Part
import { toReadableStream } from "https://deno.land/std@0.215.0/io/to_readable_stream.ts";

const file = await Deno.open(args, { read: true }).catch(() => {
  console.error("An error happened when trying to read the file");
  Deno.exit(0);
});
const stats = await file.stat().catch(() => {
  console.error("An error happened when trying to read the file");
  Deno.exit(0);
});

let nbrLines = 0;
let nbrCharacters = 0;
let nbrWords = 0;
const nbrByte = stats.size;

const decoder = new TextDecoder();
//I used this way to not load all the file in memory
for await (const chunks of toReadableStream(file, { autoClose: true })) {
  const text = decoder.decode(chunks);
  nbrLines = nbrLines + (text.match(/\n/g) || []).length;
  nbrCharacters = nbrCharacters + text.length;
  for (const line of text.split("/n")) {
    nbrWords = nbrWords + line.trim().split(/\s+/).length;
  }
}
let toRender: Array<number | string> = [];
//default options
if (Object.values(options).every((v) => !v)) {
  toRender = [nbrLines, nbrWords, nbrByte];
} else {
  Object.entries(options)
    .filter((v) => v[1])
    .forEach((v) => {
      switch (v[0]) {
        case "c":
          toRender.push(nbrByte);
          break;
        case "l":
          toRender.push(nbrLines);
          break;
        case "w":
          toRender.push(nbrWords);
          break;
        case "m":
          toRender.push(nbrCharacters);
          break;
      }
    });
}
console.log(toRender.join(" "));

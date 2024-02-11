package main

import (
	"bufio"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"strings"
)

var (
	c,
	l,
	m,
	w bool
)

// it seem like widows doesn't provide the args to the script
func main() {

	//cli part
	flag.BoolVar(&c, "c", false, "outputs the number of bytes")
	flag.BoolVar(&l, "l", false, "outputs the number of lines")
	flag.BoolVar(&w, "w", false, "outputs the number of words")
	flag.BoolVar(&m, "m", false, "outputs the number of characters")
	// filename := flag.Args()
	filename := "../test.txt"

	flag.Parse()

	// read file part
	file, err := os.OpenFile(filename, os.O_RDONLY, 0644)
	if err != nil {
		log.Fatal(err)
	}
	stats, err := file.Stat()
	if err != nil {
		log.Fatal(err)
	}

	var (
		nbrLines      = 0
		nbrCharacters = 0
		nbrWords      = 0
		nbrByte       = stats.Size()
	)

	var (
		reader = bufio.NewReader(file)
		buf    = make([]byte, 256)
		str    string
	)

	for {
		_, err := reader.Read(buf)

		if err != nil {
			if err != io.EOF {
				log.Fatal(err)
			}
			break
		}
		str = string(buf)
		if len(str) > 0 {
			nbrWords = nbrWords + strings.Count(str, " ") + 1
			nbrCharacters = nbrCharacters + len(str)
			nbrLines = nbrLines + strings.Count(str, "\n")
		}
	}
	if !(l && m && w && c) {
		fmt.Println(nbrLines, nbrWords, nbrByte)
	} else {
		//TODO complete the render here
	}

}

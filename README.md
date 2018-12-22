# Brainf\*ck Interpreter

## Introduction
This program is an interpreter of a crazy programming language, "Brainf\*ck". It implemented mainly with JavaScript. The language specification of Brainf\*ck will be discribed later.

## Constitution
- README.md  
This file.

- index.html, default.css, main.js  
The main body of the interpreter. The usage will be described later.

- HelloWorld.txt  
The source code of Brainf\*ck which displays "Hello, world!". Copy and paste the code to use it.

- ascii.html  
ASCII code table.

## Setting
1. Copy these files to your preferred location.
1. Open index.html with a browser, etc.
1. If it becomes unnecessary, delete these files.

## How to use
1. Enter the source code in the text area.
1. Load the source code by pressing the "Load" button.
1. To perform step execution, press the "Step" button .
1. To execute the program to the end, press the "Run" button .
1. To reset the program execution, press the "Reset" button .

## Brainf\*ck language specification  
Programming is done with only the following 8 commands.  

| Command | Meaning |
|:---:|:--- |
|`>`|Increment the pointer (to point to the next cell to the right).|
|`<`|Decrement the pointer (to point to the next cell to the left).|
|`+`|Increment the value at the pointer.|
|`-`|Decrement the value at the pointer. |
|`.`|Output the value at the pointer.|
|`,`|Read 1 byte from input and assign it to the destination at the pointer.|
|`[`|If the value at the pointer is 0, jump immediately after the corresponding `]`.|
|`]`|If the value at the pointer is not 0, jump immediately after the corresponding `]`.|

These commands can be translated into C using the following substitutions.

|Brainf\*ck command|C command|
|:---:|:--- |
|`>`|`++ptr;`|
|`<`|`--ptr;`|
|`+`|`++(*ptr);`|
|`-`|`--(*ptr);` |
|`.`|`putchar(*ptr);`|
|`,`|`*ptr = getchar();`|
|`[`|`while(*ptr){`|
|`]`|`}`|

## Setting language specification
As described above, Brainf\*ck is a programming language consisting of eight commands, and you can change each command as you like. For example, "+" command can be expressed as "plus" string.

To set the language specification, change the `Translator` function in `main.js`. For details, see the comments in `main.js`.

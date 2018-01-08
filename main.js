(function (){
	'use strict';

    var code   = document.getElementById('code');
    var load   = document.getElementById('load');
    var step   = document.getElementById('step');
    var run    = document.getElementById('run');
    var reset  = document.getElementById('reset');
    var result = document.getElementById('result');

	var Brainfck;
	var bf;

	var UI;

	var ButtonState;

	var Translator;

	Translator = function(){
        var cmd    = [];
        var offset = 0;
        var result = '';

		/*
		 * You can change language specification here.
		 * Example: 
		 * cmd.push(['+','plus']);
		 */

		cmd.push(['+','+']);
		cmd.push(['-','-']);
		cmd.push(['>','>']);
		cmd.push(['<','<']);
		cmd.push([',',',']);
		cmd.push(['.','.']);
		cmd.push(['[','[']);
		cmd.push([']',']']);

		cmd.sort(function(a,b){
			return a[1].length < b[1].length;
		});

		function searchCmd(code){
			var i;
			for(i = 0;i < cmd.length;i++){
				if(code.indexOf(cmd[i][1]) === 0){
					result += cmd[i][0];
					offset += cmd[i][1].length;
					return true;
				}
			}
			return false;
		}

		this.translate = function(code){
			while(offset < code.length){
				if(searchCmd(code.substr(offset)) === false){
					offset++;
				}
			}
			return result;
		};

		this.reset = function(){
			offset = 0;
			result = '';
		}
	};

	ButtonState = {
		init: function(){
            step.disabled  = true;
            run.disabled   = true;
            reset.disabled = true;
		},

		afterLoad: function(){
            load.disabled  = true;
            code.disabled  = true;
            step.disabled  = false;
            run.disabled   = false;
            reset.disabled = false;
		},

		lastStep: function(){
            step.disabled = true;
            run.disabled  = true;
		},

        afterReset: function(){
            load.disabled  = false;
            code.disabled  = false;
            step.disabled  = true;
            run.disabled   = true;
            reset.disabled = true;
		}
	};

	UI = function(id){
		this.id = id;
		this.el = document.getElementById(id);

		this.update = function(data,current){

			var span;
			var i;

			while(this.el.firstChild){
				this.el.removeChild(this.el.firstChild);
			}

			for(i = 0;i < data.length;i++){
				span = document.createElement('span');
				span.appendChild(document.createTextNode(data[i]));
				if(this.id === 'ui_cells'){
					span.title = 'cells[' + i + ']';
				}
				if(current === i){
					span.className = 'current';
				}
				this.el.appendChild(span);
			}
		};	
	};

	Brainfck = function(){
		var codeString;
		var pos;
		var cells = [];
		var ptr;
		var outputString;
		var bracemap = [];

        var uiCode   = new UI('ui_code');
        var uiCells  = new UI('ui_cells');
        var uiOutput = new UI('ui_output');

		var commandMap = {
			'+': increment,
			'-': decrement,
			'>': forward,
			'<': back,
			',': input,
			'.': output,
			'[': startLoop,
			']': endLoop
		};

		this.createBracemap = function(){
			var stack = [];
			var i;
			var start;
			var counter = 0;
			for (i = 0; i < codeString.length; i++){
				if(codeString[i] === '['){
					stack.push(i);
					counter++;
				}else if(codeString[i] === ']'){
					start = stack.pop();
					bracemap[start] = i;
					bracemap[i] = start;
					counter--;
				}
			}

			if(stack.length !== 0){
				throw 'too many open bracket \'[\'';
			}

			if(counter < 0){
				throw 'too many close bracket \']\'';
			}
		};

		function increment(){
			cells[ptr]++;
			if(cells[ptr] > 255){
				cells[ptr] = 255;	
			}
		}

		function decrement(){
			cells[ptr]--;
			if(cells[ptr] < 0){
				cells[ptr] = 0;	
			}
		}

		function forward(){
			ptr++;
			if(ptr === cells.length){
				cells.push(0);
			}
		}

		function back(){
			ptr--;
			if(ptr < 0){
				throw 'bad address: out of range';
				return;
			}
		}

		function startLoop(){
			if(cells[ptr] === 0){
				pos = bracemap[pos];
			}	
		}

		function endLoop(){
			if(cells[ptr] !== 0){
				pos = bracemap[pos];
			}	
		}

		function input(){
			var v = prompt('Enter one character');
			if(v === '' || v === null || v.charCodeAt(0) > 255){
				cells[ptr] = 0;
			}else{
				cells[ptr] = v.charCodeAt(0);
			}
		}

		function output(){
			outputString += String.fromCharCode(cells[ptr]);
		}

		this.load = function(s){
			codeString = s;
			pos = 0;
			cells = Array(20).fill(0);
			ptr = 0;
			outputString = '';

			try{
				this.createBracemap();
			}catch(e){
				alert(e);
				return;
			}

			this.updateUI();
		};

		this.updateUI = function(){
			uiCode.update(codeString,pos);
			uiCells.update(cells,ptr);
			uiOutput.update(outputString);
		};

		this.step = function(){
			this.compute();
			pos++;
			this.updateUI();
			if(pos >= codeString.length){
				ButtonState.lastStep();
			}
		};

		this.compute = function(){
			try{
				commandMap[codeString[pos]]();
			}catch(e){
				alert(e);
				return;
			}
		};

		this.run = function(){
			while(pos < codeString.length){
				this.step();
			}
		};

		this.translator = new Translator();

	};


	load.addEventListener('click',function(){
		var codeString = bf.translator.translate(code.value).replace(/[^\+\-<>,\.\[\]]/g,'');
		if (codeString === '') {
			return;
		}
		ButtonState.afterLoad();
		result.className = '';
		bf.load(codeString);
	});

	step.addEventListener('click',function(){
		bf.step();
	});

	run.addEventListener('click',function(){
		bf.run();
	});

	reset.addEventListener('click',function(){
		bf.translator.reset();
		ButtonState.afterReset();
		result.className = 'hidden';
	});

	bf = new Brainfck();
	ButtonState.init();

	code.focus();

})();
// "use strict";

var ACTIVECOLOR = "lighten-1";
var DISABLEDCOLOR = "lighten-2";
var BEEP = document.getElementById("beep");

var startBtn = document.getElementById("startBtn");
var label = document.getElementById("label");
var addDelayBtn = document.getElementById("addDelay");

function beep(text) {
    console.log("called");
    BEEP.play();
    var orig = label.innerHTML;
    label.innerHTML = text;
    setTimeout(function() {
        label.innerHTML = orig;
    }, 400);
}

function Delay(node, action) {
    this.node = node;
    this.action = action;
    this.inpt = node.getElementsByTagName('input')[0];
    this.timeoutID = null;
}

Object.defineProperty(
    Delay.prototype,
    'delay',
    {
        get : function () {
            return parseInt(this.inpt.value);
        },
        set : function (value) {
            this.inpt.value = value;
        },
    }
);


Delay.prototype.shoot = function(callback) {
    var self = this;
    self.makeActive();
    self.timeoutID = setTimeout(function() { 
        self.action();
        self.makeInactive();
        callback();
    }, self.delay * 1000);
};

Delay.prototype.cancell = function() {
   clearTimeout(this.timeoutID);
   this.enable();
   this.makeInactive();
};

Delay.prototype.disable = function() {
    this.inpt.disabled = true;
};

Delay.prototype.enable = function() {
    this.inpt.removeAttribute("disabled");
};

Delay.prototype.makeActive = function() {
    if (this.node.classList.contains(DISABLEDCOLOR))
        this.node.classList.remove(DISABLEDCOLOR);
    if (!this.node.classList.contains(ACTIVECOLOR))
        this.node.classList.add(ACTIVECOLOR);
};

Delay.prototype.makeInactive = function() {
    if (this.node.classList.contains(ACTIVECOLOR))
        this.node.classList.remove(ACTIVECOLOR);
    if (!this.node.classList.contains(DISABLEDCOLOR))
        this.node.classList.add(DISABLEDCOLOR);
};



function Timer() {
    this.delays = [];
    this.stopped = true;
}

Object.defineProperty(
    Timer.prototype,
    'rounds',
    {
        get : function () {
            var lbl = document.getElementById("rounds");
            return parseInt(lbl.value);
        },
        set : function (value) {
            var lbl = document.getElementById("rounds");
            lbl.value = value;
        },
    }
);


Timer.prototype.createDelay = function(event) {
    var t = document.getElementById("delays");
    var node = document.getElementById("delayTemplate").cloneNode(true);
    node.style.display = "block";
    node.id = "delay";
    
    var delay = new Delay(node, function() { beep('Beep'); });
    t.appendChild(node);
    this.delays.push(delay);
};

Timer.prototype.start = function() {
    this.disable();
    this.stopped = false;
    this.run();
    startBtn.innerHTML = 'Stop';
};

Timer.prototype.run = function() {
    if ( this.stopped || this.rounds === 0 ) {
        this.stop();
    } else {
        this.disable();
        this.rounds -= 1;
        this.runRound(0);
    }
};

Timer.prototype.runRound = function(i) {
    var self = this;
    if ( this.stopped )
        this.stop();
    if (i == self.delays.length) {
        self.run();
    } else {
        self.delays[i].shoot(function() { self.runRound(i + 1); });
    }
};

Timer.prototype.disable = function() {
    this.delays.forEach(function(delay) { delay.disable(); });
};

Timer.prototype.enable = function() {
    this.delays.forEach(function(delay) { delay.enable(); });
};

Timer.prototype.stop = function() {
    this.stopped = true;
    this.delays.forEach(function(delay) {delay.cancell();});
    this.enable();
    startBtn.innerHTML = 'Start';
};


var controller = new Timer(3);

addDelayBtn.addEventListener("click", function() { controller.createDelay(); });

startBtn.addEventListener('click', function() {
    if (startBtn.innerHTML === 'Start') {
        controller.start();
    } else {
        controller.stop();
    }
});


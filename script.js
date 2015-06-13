// "use strict";

var startBtn = document.getElementById("startBtn");
var label = document.getElementById("label");
var addTimerBtn = document.getElementById("addTimer");

function beep(text) {
    console.log("called");
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
    console.log(self.delay);
    self.timeoutID = setTimeout(function() { 
        self.action();
        callback();
    }, self.delay * 1000);
};

Delay.prototype.cancell = function() {
   clearTimeout(this.timeoutID);
   this.enable();
};

Delay.prototype.disable = function() {
    var inpt = this.node.getElementsByTagName("input")[0];
    inpt.disabled = true;
};

Delay.prototype.enable = function() {
    var inpt = this.node.getElementsByTagName("input")[0];
    inpt.removeAttribute("disabled");
};


function MetaTimer() {
    this.timers = [];
    this.stopped = true;
}

Object.defineProperty(
    MetaTimer.prototype,
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


MetaTimer.prototype.createTimer = function(event) {
    var t = document.getElementById("timers");
    var node = document.getElementById("timerTemplate").cloneNode(true);
    node.className = "timer";
    node.style.display = "block";
    node.id = "timer";
    
    var timer = new Delay(node, function() { beep('Beep'); });
    t.appendChild(node);
    this.timers.push(timer);
};

MetaTimer.prototype.run = function() {
    this.disable();
    this.stopped = false;
    if ( this.rounds === 0 ) {
        this.enable();
        return;
    } else {
        this.rounds -= 1;
        this.runRound(0);
    }
};

MetaTimer.prototype.runRound = function(i) {
    var self = this;
    if ( this.stopped )
        return;
    if (i == self.timers.length) {
        self.run();
    } else {
        self.timers[i].shoot(function() { self.runRound(i + 1); });
    }
};

MetaTimer.prototype.disable = function() {
    this.timers.forEach(function(timer) { timer.disable(); });
};

MetaTimer.prototype.enable = function() {
    this.timers.forEach(function(timer) { timer.enable(); });
};

MetaTimer.prototype.stop = function() {
    this.stopped = true;
    this.rounds = 0;
    this.timers.forEach(function(timer) {timer.cancell();});
};


var controller = new MetaTimer(3);

addTimerBtn.addEventListener("click", function() { controller.createTimer(); });

startBtn.addEventListener('click', function() {
    if (startBtn.innerHTML === 'Start') {
        startBtn.innerHTML = 'Stop';
        controller.run();
    } else {
        startBtn.innerHTML = 'Start';
        controller.stop();
    }
});


var itsChristmas = {

    context: undefined,
    buttons: undefined,
    frequencyArray: [440, 493, 261, 293, 329, 349, 392],
    counter: 0,
    step: 0,
    opacityInc: 0.02857142857,
    newOpacity: null,
    points: 0,
    speed: 1000,
    init: function () {
        $('#slider').on('change', function () {
            $('#slider-text').text($('#slider').val());
            itsChristmas.speed = $('#slider').val();
        });
        try {
            // Fix up for prefixing
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            itsChristmas.context = new AudioContext();
        } catch (e) {
            alert('Web Audio API is not supported in this browser');
        }
        itsChristmas.centerPlay();

        $('#playgame').click(function () {
            var w = $(window).width() / 2;
            w = (w - 100);
            $("#playgame").animate({
                "marginLeft": w,
                "top": "10px"
            }, "slow");
        
            var soundFactors = ['sine', 0.2, 1.2, 1.5];
            // itsChristmas.setupNewGame(100,soundFactors);
            itsChristmas.setupStages();
            if ($('#playgame i').hasClass('play')) {
                $('.points, .ptext').fadeIn(1000);

                $('#playgame i').addClass('restart fa-stop');
                $('#playgame i').removeClass('play fa-play');
                $('#playgame i').css({
                    "margin-left": "-15px"
                });
                $('.speedbox').fadeOut(500);
            } else {
                //console.log('2');
                $("*").stop(true, true);
                window.location.reload(true);
            }
        });
    },
    gameStageInfo: [
        {
            speed : 800,
            soundFactors : ['square', 0.2, 1.2, 1.5]
        },
        {
            speed : 600,
            soundFactors : ['triangle', 0.2, 1.2, 1.5]
        },
        {
            speed : 500,
            soundFactors : ['square', 0.2, 1.2, 1.5]
        }
    ],
    setupNewGame: function(speed,soundFactors,callback){
        itsChristmas.cloneAndAnimate(speed,function(){
            callback();
        });
        itsChristmas.spacebar(soundFactors);
    },
    playGame: function(index,callback) {
        $(".stage").find('em').text(index+1).end().show(500);
        setTimeout(function() {
        var game_info = itsChristmas.gameStageInfo[index];
        var game_speed = game_info.speed;
        var game_soundFactors = game_info.soundFactors;
          $(".stage").hide(500);
          itsChristmas.setupNewGame(game_speed,game_soundFactors,function(){
            callback();
        });
    }, 1500);
    },
    setupStages: function() {
        itsChristmas.playGame(0,function(){
            itsChristmas.playGame(1,function(){
                itsChristmas.playGame(2,function(){
                    console.log('end');
                });
            });

        });
    },
    centerPlay: function () {
        //center the play button pn doc
        var w = $(window).width();
        var h = $(window).height();
        var elem = $('#playgame');
        var divW = $(elem).width();
        var divH = $(elem).height();


        $(elem).css({
            "position": "absolute",
            "top": (h / 2) - (divH / 2),
            "left": (w / 2) - (divW / 2) - 60
        });

    },

    sequence: {
        1: [4, 4, 4],
        2: [4, 4, 4],
        3: [4, 6, 2, 3, 4],
        4: [4, 4, 4, null, 4, 4, 4, null, 4, 6, 2, 3, 4],
        5: [5, 5, 5, null, 5, 5, 4, 4, null, 4, 6, 6, 5, 3, 2, 99]
    },

    pointResponse: {
        1: ['Great!', 'Super!', 'Excellent!', "You're on fire!", "Ace!", '#Winning', '#ChosenOne', 'Perfect!', 'Flawless!'],
        2: ['Oh no!', 'Whoops!', 'WTF!', "Rookie alert!", "Boooo!", "#PlaySomeJustinBeiber", "Error 404"]
    },

    updateButtons: function (style) {
        for (i = 1; i < itsChristmas.buttons.length; i++) {
            itsChristmas.buttons[i].style.pointerEvents = style;
        }
    },
    nextStep: function (next) {
        //console.log(next);
        var oldStep = document.querySelector('[data-message="' + (next - 1) + '"]');
        var newStep = document.querySelector('[data-message="' + next + '"]');

        itsChristmas.counter = 0;
        itsChristmas.step++;

        oldStep.style.display = 'none';
        newStep.style.display = 'block';

        itsChristmas.checkPosition();
    },
    cloneAndAnimate: function (speed,callback) {
        itsChristmas.counter = 0;

        for (j = 1; j < 6; j++) {
            jlength = itsChristmas.sequence[j].length;
            for (i = 0; i < jlength; i++) {
                var seq;
                seq = itsChristmas.sequence[j][i];
                //console.log(i);
                if (typeof seq == 'undefined') {

                } else {
                    //
                    if (itsChristmas.sequence[j][i] == 99) {
                        console.log('last note')
                        animateClone(speed,function(){
                            $('.clone-container a').remove();
                            callback();
                        });
                        return;
                    } else {
                        //var interval = setInterval(function() {
                        itsChristmas.checkPositionNew(itsChristmas.sequence[j][i], j);
                        //}, 1000);

                        //clearInterval(interval);

                    }

                }
            }
        }
        function animateClone(speed,callback) {
            var winHeight = $(window).height();
            var clonedMargin = winHeight - 50; //- 250;
            var dropSpeed;
            if(typeof speed == "undefined")    
                dropSpeed = $('#speed').attr('value');
            else
                dropSpeed = speed;
            //default speed value 1000
                var clonedElsArray =  $($('.cloned').get().reverse());
                var numOfCloned =  clonedElsArray.length;
                clonedElsArray.each(function (i) {
                    console.log($(this),i);
                  $('#clone0').addClass('animates');
                $(this).stop().delay(i * dropSpeed).animate({
                    'margin-top': clonedMargin,
                    'top': 0,
                    'display': 'block'
                }, 2000, function(){
                    $(this).removeClass('animates');
                    $(this).prev().addClass('animates');
                    $(this).fadeOut();

                    //last note fell
                    if (i===numOfCloned-1) {
                       callback();
                    }

                });
                var _this = $(this);
                    // setTimeout(function() {
                    //     _this.addClass('animates');
                    // }, i*itsChristmas.speed);

                    // setTimeout(function() {
                    //     $(this).removeClass('animates');
                    // }, i*itsChristmas.speed+2000);

            });
        }
        //not needed
        //animateClone();
    },
    checkPositionNew: function (note, arrayNum) {
        var newNote;
        var newNoteElem;
        var oldNote;
        var nextStep;

        itsChristmas.hideCloned();
        //console.log(note);
        newNote = note;
        highlightNoteNew(note, 200);
        //animateClone();

        function highlightNoteNew(newNote, delay) {
            //console.log(newNote);
            //alert(newNote);
            var newNoteElem;

            //itsChristmas.updateButtons('none')
            //window.setTimeout(function() {
            if (newNote === null) {
                //console.log('1');
                //itsChristmas.updateButtons('auto')
                //itsChristmas.checkPositionNew('null');
            } else {
                //console.log('2');
                newNoteElem = document.querySelector('[data-note="' + newNote + '"]');
                // itsChristmas.updateButtons('auto');

                // console.log(newNote);

                var p = $(newNoteElem);
                var position = p.position();
                var newPos;
                //console.log('pos'+ position.left);
                //newPos = position.left - parseFloat(58);
                newPos = position.left - parseFloat(58);

                //console.log('l'+newPos);
                //move element clone
                var newClone = $(newNoteElem).clone().prop({
                    'id': 'clone' + itsChristmas.counter
                }).addClass('cloned').css({
                    'margin-left': newPos,
                    'width': '135px',
                    'position': 'absolute',
                    'top': '-50px'
                }).insertAfter('.clone-box');

                var winHeight = $(window).height();
                var clonedMargin = winHeight - 250;
                itsChristmas.counter++;
                //not used
                itsChristmas.hideCloned();
            }
            //}, delay);
        }
    },
    createDingNew: function (elem,soundArray) {
        // var frequency;
        // if (sound!="undefined") {
        //     frequency = $(elem).attr("data-note");
        // }
        // else {
        //     frequency = sound;
        // }
        //var frequency = $('#clone0').getAttribute('data-note');
        var noteElem = $(elem);

        //console.log('freq:' + frequency);
        //console.log(noteElem);

        if (noteElem !== null) {
            //noteElem.classList.remove('highlight');
        }

        // // [frequency, type, startTime, fadeMidTime, fadeEndTime]
        // var baseArray = [itsChristmas.frequencyArray[frequency], 'triangle', 0, 0.5, 1];
        // var depthArray = [itsChristmas.frequencyArray[frequency], 'square', 0.2, 1.2, 1.5];
        // var boingArray = [itsChristmas.frequencyArray[frequency], 'custom', 0.2, 1.2, 1.5];

        // itsChristmas.createSound(baseArray);
        // itsChristmas.createSound(depthArray);
        itsChristmas.createSound(soundArray);
    },

    createSound: function (array) {
        var context = itsChristmas.context;
        oscillator = context.createOscillator();
        gainNode = context.createGain();
        gainNode.gain.value = 1;
        oscillator.type = array[1];
        oscillator.frequency.value = array[0]; // value in hertz
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        //context.currentTime - double representing an ever-increasing hardware timestamp in seconds 
        gainNode.gain.exponentialRampToValueAtTime(1, context.currentTime + array[2]);
        gainNode.gain.exponentialRampToValueAtTime(0.1, context.currentTime + array[3]);
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + array[4]);
        oscillator.start(context.currentTime);
    },

    spacebar: function (soundArray) {
        // if spacebar pressed...
        $(document).keypress(function (event) {
            if (event.keyCode == 32) {
                
                var alreadyRan = false;
                var htop = $('.hblock').offset().top; //top pos of hblock
                var hbot = htop + $('.hblock').height(); //bottom pos of hblock
                var minY = 0;

                var sCounter = 0;
                
                for (i = 0; i < 35; i++) {

                    sCounter++;
                    //console.log(sCounter);
                    var clonedElem = '#clone' + i;
                    var yPos = $(clonedElem).offset().top;
                    
                    var staticElem = $(clonedElem);
                    //console.log(staticElem);
                    var frequency = $(clonedElem).attr("data-note");

                    if ($(clonedElem).is('.animates')) {
                        var cElem = $(clonedElem).is('.animates');
                        var curPos = $(clonedElem).offset().top;
                        $(clonedElem).hide();
                        $(clonedElem).removeClass('animates');

                        // console.log('curPos:' + curPos  + 'htop:' + htop + ' hbot:' + hbot);
                        if (curPos > htop && curPos < hbot) {
                            
                            var max = itsChristmas.pointResponse[1].length;
                            var min = 0;
                            var ran = Math.floor((Math.random() * max) + min);
                            ran = itsChristmas.pointResponse[1][ran];
                        
                            var heading = $('h1').clone().removeClass();
                            $('h1').remove();
                            $('header').append(heading);
                            $('h1').addClass('hit-msg-pop hit-msg');

                            $('.hit-msg').text(ran);
                            //console.log(ran);
                            $(clonedElem).removeClass('highlight');
                            $(clonedElem).addClass('correct');
                            var frequencyArray = [itsChristmas.frequencyArray[frequency]];
                            var depthArray = $.merge(frequencyArray, soundArray);
                            // itsChristmas.createDingNew(clonedElem,depthArray);
                            itsChristmas.createSound(depthArray);
                            itsChristmas.points += 25;
                            $('.ptext').text(itsChristmas.points);
                                console.log('correct');

                        } else {
                            $(clonedElem).removeClass('animates');
                            if ($(clonedElem).not('.correct')) {
                                $(clonedElem).removeClass('highlight');
                                $(clonedElem).addClass('error');
                                console.log('error');
                                var boingArray = [800, 'square', 0.2, 1.2, 1.3];
                                itsChristmas.createDingNew(clonedElem,boingArray);
                                //console.log('curPos:' + curPos  + 'htop:' + htop + ' hbot:' + hbot);
                                var max =  itsChristmas.pointResponse[2].length;
                                var min = 0;
                                var ran = Math.floor((Math.random() * max) + min);
                                ran = itsChristmas.pointResponse[2][ran];
                                itsChristmas.points -= 50;
                                $('.ptext').text(itsChristmas.points);

                                console.log(itsChristmas.points);
                                //console.log(ran);
                                $('.hit-msg').text(ran);
                            // }
                            }
                        }
                    }
                }
                //                
            }
        });
    },

    hideCloned: function () {
        if ($('.cloned').length) {
            var winHeight = $(window).height();
            //console.log(winHeight);
            $('.cloned').each(function () {
                var clonedItemHeight = $(this).offset().top;
                //console.log('c:'+clonedItemHeight);
                if (clonedItemHeight > 500) {
                    $(this).css({"display":"none"});
                }
            });
        }
    }
}
window.onload = itsChristmas.init();
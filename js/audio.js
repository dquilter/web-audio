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

        $('.img-snowman').css({
            "opacity": "0"
        });

        try {
            // Fix up for prefixing
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            itsChristmas.context = new AudioContext();
        } catch (e) {
            alert('Web Audio API is not supported in this browser');
        }

        itsChristmas.buttons = document.querySelectorAll('.button');

        for (i = 0; i < itsChristmas.buttons.length; i++) {
            itsChristmas.buttons[i].onclick = itsChristmas.createDing;
        }

        itsChristmas.centerPlay();

        $('#playgame').click(function () {
            var w = $(window).width() / 2;
            w = (w - 100);
            $("#playgame").animate({
                "marginLeft": w,
                "top": "10px"
            }, "slow");
            itsChristmas.autoDing();
            itsChristmas.spacebar();

            if ($('#playgame i').hasClass('play')) {
                $('.points, .ptext').fadeIn(1000);

                $('#playgame i').addClass('restart fa-stop');
                $('#playgame i').removeClass('play fa-play');
                $('#playgame i').css({
                    "margin-left": "-15px"
                });
                $('.speedbox').fadeOut(500);
            } else {
                console.log('2');
                $("*").stop(true, true);
                window.location.reload(true);
            }
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

    wrong: function () {
        console.log('Wrong!');
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

    nextStepNew: function (next) {
        //var next = next - 1;

        //if (!isNaN(next)){
        //            var oldStep = document.querySelector('[data-message="' + (next - 1) + '"]');
        //            var newStep = document.querySelector('[data-message="' + next + '"]');
        //
        //            itsChristmas.counter = 0;
        //            itsChristmas.step++;
        //
        //            oldStep.style.display = 'none';
        //            newStep.style.display = 'block';
        //
        //            itsChristmas.checkPosition();
        //}

    },



    checkPosition: function (note, sequenceNumber) {
        var newNote;
        var newNoteElem;
        var oldNote;
        var nextStep;

        //console.log(arrayVal);
        //newNote = arrayVal;

        itsChristmas.hideCloned();

        if (itsChristmas.step === 0) {

            // Let user play 5 notes on first step
            if (itsChristmas.counter < 4) {
                itsChristmas.counter++;
            } else {
                itsChristmas.nextStep(1);
            }
            //console.log(sequenceNumber);
            //itsChristmas.nextStep(sequenceNumber);

        } else {

            if (note === undefined) {
                // First note in step           
                newNote = itsChristmas.sequence[itsChristmas.step][itsChristmas.counter];
                //newNote = 4;
                newNoteElem = document.querySelector('[data-note="' + newNote + '"]');
                newNoteElem.classList.add('highlight');

                //console.log('nreNote:' + newNote + ' newNoteElem:' + newNoteElem);

            } else {

                // Subsequent notes
                oldNote = itsChristmas.sequence[itsChristmas.step][itsChristmas.counter];
                //console.log('xoldnote' +oldNote);

                // Check the right note was played
                if (parseInt(note, 10) === parseInt(oldNote, 10) || note === 'null') {
                    // Have we played all of the notes?
                    if (itsChristmas.counter + 1 !== itsChristmas.sequence[itsChristmas.step].length) {
                        // If not, highlight the new note
                        itsChristmas.counter++;
                        newNote = itsChristmas.sequence[itsChristmas.step][itsChristmas.counter];

                        if (newNote === null) {
                            highlightNote(newNote, 1200);
                        } else {
                            highlightNote(newNote, 200);

                            //                            var oldOpacity = $(".img-snowman").css("opacity");                    
                            //                            newOpacity = parseFloat(oldOpacity) + parseFloat(0.02857142857);
                            //                            
                            //                            $(".img-snowman").removeAttr("style");
                            //                            $(".img-snowman").css({"opacity":newOpacity}); 

                        }

                    } else {
                        // Otherwise, move to next step
                        nextStep = parseInt(itsChristmas.step, 10) + 1;
                        //console.log("nextstep:" + nextStep);
                        if (nextStep == 6) {
                            //$("#merry-xmas").removeAttr("style");
                            //$('#merry-xmas').css({'opacity':'1'})
                            //TweenMax.staggerTo(".box", 1, {rotation:360, y:100}, 0.2 , {css:{scale:2, opacity:1}});
                        }
                        itsChristmas.nextStep(nextStep)


                    }
                } else {
                    // They got it wrong
                    itsChristmas.wrong();
                }
            }

        }

        function highlightNote(newNote, delay) {
            //console.log("newnote:" + newNote + ' delay:' + delay);
            var newNoteElem = document.querySelector('[data-note="' + newNote + '"]');
            itsChristmas.updateButtons('none')
            window.setTimeout(function () {
                if (newNote === null) {
                    itsChristmas.updateButtons('auto')
                    itsChristmas.checkPosition('null');
                } else {
                    newNoteElem.classList.add('highlight');
                    itsChristmas.updateButtons('auto');

                    var p = $(newNoteElem);
                    var position = p.position();
                    var newPos;
                    //console.log('pos'+ position.left);
                    newPos = position.left - parseFloat(58);

                    //move element clone
                    $(newNoteElem).clone().addClass('cloned').css({
                        'margin-left': newPos,
                        'width': '135px'
                    }).insertAfter('.button-container');
                    //$(newNoteElem).closest('span[data-note="' + newNote + '"]').remove();

                    var winHeight = $(window).height();
                    //console.log(winHeight);
                    var clonedMargin = winHeight - 250;

                    $('.cloned').animate({
                        'marginTop': clonedMargin
                    }, 1000); //360px

                    itsChristmas.hideCloned();
                    //$('.cloned').remove();
                }
            }, delay);
        }

    },





    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    




    autoDing: function () {
        itsChristmas.counter = 0;

        for (j = 1; j < 6; j++) {
            jlength = itsChristmas.sequence[j].length;
            for (i = 0; i < jlength; i++) {
                var seq;
                seq = itsChristmas.sequence[j][i];
                //console.log(i);
                if (typeof seq == 'undefined') {

                } else {
                    if (itsChristmas.sequence[j][i] == 99) {
                        console.log('last note')
                        animateClone();
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

        function animateClone() {
            var winHeight = $(window).height();
            var clonedMargin = winHeight - 50; //- 250;    
            var dropSpeed = $('#speed').attr('value');

            //default speed value 1000

            $($('.cloned').get().reverse()).each(function (i) {
                $(this).delay(i * itsChristmas.speed).animate({
                    'margin-top': clonedMargin,
                    'top': 0,
                    'display': 'block'
                }, 2000);

            });
        }
        animateClone();
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
                //newNoteElem.classList.add('highlight');
                //itsChristmas.updateButtons('auto');

                //console.log(newNote);

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

                //console.log(newClone);

                //                    function runit() {
                //                        $(newClone).animate({ 'marginTop': clonedMargin}, 1000); //360px
                //                    }
                //                    
                //                    function showit() {
                //                        var n = $(newClone).queue( "fx" ); //queue name is called fx
                //                        $( "span" ).text( n.length );
                //                        setTimeout( showit, 1000 );
                //                    }


                //                    function animateClone(elem) {
                ////                        $(elem).animate(
                ////                           { 'marginTop': clonedMargin}
                ////                        , { duration: 1000, queue: true });
                //                        //$('#clone33').animate({ 'marginTop': clonedMargin}, { duration: 1000}); //360px
                //                        for (i=0; i <35; i++) {
                //                            var cloneid = '#clone' + i;
                //                            console.log(cloneid);
                //                            $(cloneid).delay(1000).animate({ 'marginTop': clonedMargin}, { duration: 1000}); //360px
                //                        }
                //                        //$('#clone34').delay(1000).animate({ 'marginTop': clonedMargin}, { duration: 1000}); //360px
                //                        
                //                    }

                //animateClone(newClone);

                //runit();
                //showit();

                itsChristmas.counter++;
                itsChristmas.hideCloned();
            }
            //}, delay);
        }
    },







    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    


    createDingNew: function (elem) {


        //var frequency = $('#clone0').getAttribute('data-note');
        var frequency = $(elem).attr("data-note");
        var noteElem = $(elem);

        //console.log('freq:' + frequency);
        //console.log(noteElem);

        if (noteElem !== null) {
            //noteElem.classList.remove('highlight');
        }

        // [frequency, type, startTime, fadeMidTime, fadeEndTime]
        var baseArray = [itsChristmas.frequencyArray[frequency], 'triangle', 0, 0.5, 1];
        var depthArray = [itsChristmas.frequencyArray[frequency], 'square', 0.2, 1.2, 1.5];

        itsChristmas.createSound(baseArray);
        itsChristmas.createSound(depthArray);
    },


    createDing: function (evt) {
        //console.log(evt);
        evt.preventDefault();
        var frequency = this.getAttribute('data-note');
        //console.log(frequency);

        var noteElem = document.querySelector('.highlight');
        if (noteElem !== null) {
            noteElem.classList.remove('highlight');
        }

        // [frequency, type, startTime, fadeMidTime, fadeEndTime]
        var baseArray = [itsChristmas.frequencyArray[frequency], 'triangle', 0, 0.5, 1];
        var depthArray = [itsChristmas.frequencyArray[frequency], 'square', 0.2, 1.2, 1.5];

        itsChristmas.createSound(baseArray);
        itsChristmas.createSound(depthArray);

        itsChristmas.checkPosition(frequency);
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

        gainNode.gain.exponentialRampToValueAtTime(1, context.currentTime + array[2]);
        gainNode.gain.exponentialRampToValueAtTime(0.1, context.currentTime + array[3]);
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + array[4]);
        oscillator.start(context.currentTime);
    },


    spacebar: function () {
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
                    console.log(sCounter);
                    var clonedElem = '#clone' + i;
                    var yPos = $(clonedElem).offset().top;
                    
                    var staticElem = $(clonedElem);
                    //console.log(staticElem);
                    
                    if ($(clonedElem).is(':animated')) {
                        
                        
                        var cElem = $(clonedElem).is(':animated');
                        var curPos = $(clonedElem).offset().top;

                        //console.log('curPos:' + curPos  + 'htop:' + htop + ' hbot:' + hbot);
                        
                        if (curPos > htop && curPos < hbot) {
                            
                            //console.log('animation');
                            
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
                            itsChristmas.createDingNew(clonedElem);
                            itsChristmas.points += 25;
                            $('.ptext').text(itsChristmas.points);

                        } else {
                            
                            //console.log('curPos:' + curPos  + 'htop:' + htop + ' hbot:' + hbot);
                            if ( staticElem == $(clonedElem) ) {//if (curPos < 0 || curPos > 540) {
                            
                                //console.log('no animation');
                                var max =  itsChristmas.pointResponse[2].length;
                                var min = 0;
                                var ran = Math.floor((Math.random() * max) + min);
                                ran = itsChristmas.pointResponse[2][ran];
                                //console.log(ran);
                                $('.hit-msg').text(ran);
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
                    //$(this).css({"display":"none"});
                }
            });
        }

    }


}

window.onload = itsChristmas.init();
/* --------------------------------------------------
   HEISENBERG RESEARCH - SCRIPTS [ANDURIL SYSTEM]
   -------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initChandelier();
    initParticles();
    initCursorCoords();
    initCatStateVis();
    initScrollEngine();
    initTerminal();
    initForm();
    initHeroTypewriter();
});

/* ==================================================
   1. REAL-TIME TELEMETRY COORDINATES (No custom cursor UI)
   ================================================== */
function initCursorCoords() {
    const coordsEl = document.querySelector('.cursor-coords');
    if (!coordsEl) return;
    
    // Check if device supports hover
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouch) {
        coordsEl.style.display = 'none';
        return;
    }
    
    window.addEventListener('mousemove', (e) => {
        coordsEl.textContent = `SYS_LOC // X: ${String(e.clientX).padStart(3, '0')} | Y: ${String(e.clientY).padStart(3, '0')}`;
    });
}

/* ==================================================
   1B. HERO TITLE TYPEWRITER EFFECT
   ================================================== */
function initHeroTypewriter() {
    const titleEl = document.querySelector('.hero-brand-title');
    const subtitleEl = document.querySelector('.hero-brand-subtitle');
    const tagEl = document.querySelector('.hero-brand-tag');
    if (!titleEl || !subtitleEl) return;
    
    const titleText = titleEl.textContent.trim();
    const subtitleText = subtitleEl.textContent.trim();
    const tagText = tagEl ? tagEl.textContent.trim() : '';
    
    // Clear elements and make visible
    titleEl.textContent = '';
    subtitleEl.textContent = '';
    if (tagEl) {
        tagEl.textContent = '';
        tagEl.style.opacity = '1';
    }
    titleEl.style.opacity = '1';
    subtitleEl.style.opacity = '1';
    
    let i = 0;
    const titleDelay = 60;
    const subtitleDelay = 40;
    const tagDelay = 30;
    
    function typeTitle() {
        if (i < titleText.length) {
            titleEl.textContent = titleText.substring(0, i + 1) + '█';
            i++;
            if (Math.random() > 0.6) {
                playSynthSound(Math.random() * 200 + 800, 'sine', 0.003, 0.012);
            }
            setTimeout(typeTitle, titleDelay);
        } else {
            titleEl.textContent = titleText; // Remove cursor
            i = 0;
            setTimeout(typeSubtitle, 350);
        }
    }
    
    function typeSubtitle() {
        if (i < subtitleText.length) {
            subtitleEl.textContent = subtitleText.substring(0, i + 1) + '█';
            i++;
            if (Math.random() > 0.6) {
                playSynthSound(Math.random() * 200 + 900, 'sine', 0.003, 0.012);
            }
            setTimeout(typeSubtitle, subtitleDelay);
        } else {
            subtitleEl.textContent = subtitleText; // Remove cursor
            i = 0;
            if (tagEl && tagText) {
                setTimeout(typeTag, 350);
            }
        }
    }
    
    function typeTag() {
        if (i < tagText.length) {
            tagEl.textContent = tagText.substring(0, i + 1) + '█';
            i++;
            if (Math.random() > 0.6) {
                playSynthSound(Math.random() * 150 + 1000, 'sine', 0.002, 0.010);
            }
            setTimeout(typeTag, tagDelay);
        } else {
            tagEl.textContent = tagText; // Remove cursor
        }
    }
    
    // Start initial sequence on delay
    setTimeout(typeTitle, 500);
}

/* ==================================================
   2. Q-DAY COUNTDOWN TIMER, CLICK TICKS, & HOVER GLITCHES
   ================================================== */
let countdownInterval = null;
let currentTimerValues = { years: 1, months: 11, days: 4, hours: 18, minutes: 12, seconds: 0 };
let lastSecondsValue = -1;

function initCountdown() {
    const targetDate = new Date('November 1, 2028 00:00:00 UTC').getTime();
    
    const yearsEl = document.getElementById('timer-years');
    const monthsEl = document.getElementById('timer-months');
    const daysEl = document.getElementById('timer-days');
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');
    
    if (!yearsEl) return;

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            currentTimerValues = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
            renderTimer();
            return;
        }
        
        const secondMs = 1000;
        const minuteMs = secondMs * 60;
        const hourMs = minuteMs * 60;
        const dayMs = hourMs * 24;
        const monthMs = dayMs * 30.4368;
        const yearMs = dayMs * 365.2422;
        
        currentTimerValues.years = Math.floor(diff / yearMs);
        currentTimerValues.months = Math.floor((diff % yearMs) / monthMs);
        currentTimerValues.days = Math.floor((diff % monthMs) / dayMs);
        currentTimerValues.hours = Math.floor((diff % dayMs) / hourMs);
        currentTimerValues.minutes = Math.floor((diff % hourMs) / minuteMs);
        currentTimerValues.seconds = Math.floor((diff % minuteMs) / secondMs);
        
        // Play click tick sound when seconds change
        if (currentTimerValues.seconds !== lastSecondsValue) {
            if (lastSecondsValue !== -1) {
                playTickSound();
            }
            lastSecondsValue = currentTimerValues.seconds;
        }
        
        renderTimer();
    }
    
    function renderTimer() {
        if (!yearsEl.classList.contains('timer-glitch')) {
            yearsEl.textContent = String(currentTimerValues.years).padStart(2, '0');
        }
        if (!monthsEl.classList.contains('timer-glitch')) {
            monthsEl.textContent = String(currentTimerValues.months).padStart(2, '0');
        }
        if (!daysEl.classList.contains('timer-glitch')) {
            daysEl.textContent = String(currentTimerValues.days).padStart(2, '0');
        }
        if (!hoursEl.classList.contains('timer-glitch')) {
            hoursEl.textContent = String(currentTimerValues.hours).padStart(2, '0');
        }
        if (!minutesEl.classList.contains('timer-glitch')) {
            minutesEl.textContent = String(currentTimerValues.minutes).padStart(2, '0');
        }
        if (!secondsEl.classList.contains('timer-glitch')) {
            secondsEl.textContent = String(currentTimerValues.seconds).padStart(2, '0');
        }
    }
    
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
    
    // Bind Hover Glitches to timer digit elements
    const timerBlocks = document.querySelectorAll('.countdown-display .time-block');
    timerBlocks.forEach(block => {
        const digitEl = block.querySelector('.digits');
        block.addEventListener('mouseenter', () => {
            triggerDigitGlitch(digitEl);
        });
    });

    // Bind Scroll Glitches
    setupScrollGlitch(timerBlocks);
}

// Interactive glitch for single digit element
function triggerDigitGlitch(el, playSound = true) {
    if (!el || el.classList.contains('timer-glitch')) return;
    
    el.classList.add('timer-glitch');
    if (playSound) {
        playSynthSound(Math.random() * 400 + 400, 'sine', 0.015, 0.05); // high tech beep
    }
    
    const originalText = el.textContent;
    let elapsed = 0;
    const duration = 250;
    const tickTime = 30;
    
    const interval = setInterval(() => {
        const letters = "0123456789X#&";
        el.textContent = letters[Math.floor(Math.random() * letters.length)] + letters[Math.floor(Math.random() * letters.length)];
        elapsed += tickTime;
        
        if (elapsed >= duration) {
            clearInterval(interval);
            el.classList.remove('timer-glitch');
            const unit = el.id.split('-')[1];
            el.textContent = String(currentTimerValues[unit]).padStart(2, '0');
        }
    }, tickTime);
}

// Page scroll triggers glitches on random elements
function setupScrollGlitch(timerBlocks) {
    let lastScrollPosition = window.scrollY;
    let scrollTriggerThreshold = 15; // px scrolled to trigger
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        const delta = Math.abs(currentScroll - lastScrollPosition);
        
        if (delta > scrollTriggerThreshold) {
            // Pick a random block to glitch
            const randomBlock = timerBlocks[Math.floor(Math.random() * timerBlocks.length)];
            const digits = randomBlock.querySelector('.digits');
            triggerDigitGlitch(digits, false); // No sound on scroll glitch
            lastScrollPosition = currentScroll;
        }
    });
}

/* ==================================================
   3. GOLDEN DILUTION REFRIGERATOR (Chandelier Canvas Engine)
   ================================================== */
function initChandelier() {
    const canvas = document.getElementById('chandelier-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const statusVal = document.getElementById('assembly-pct');
    
    let width = canvas.width = canvas.offsetWidth || 500;
    let height = canvas.height = canvas.offsetHeight || 500;
    
    function resize() {
        if (!canvas.offsetWidth) return;
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    
    // ASCII data strings
    const QUANTUM_ASCII = [
    "                                                   ,;:t000C:...,,   .:..:L08f:.L                                                      ",
    "                                                   :i:1000C:...::. . ,..:L08L:.L                                                      ",
    "                                                   :t,if0GCf1i;:1:tf;i1LLC8L1:.L                                                      ",
    "                                                   :1ti00tt1i;;:i:,:::i11ff0tG1t                                                      ",
    "                                                 Ci11i;GGi,,. ..;. .....;;tC88LttC                                                    ",
    "                                           .1,  .. ;C0f0;.  . ,.,  .. ..0:,1f8L;1,t                                                   ",
    "                                            .   t. .:ttG,L.:,...L,.   .,f;Gff8L.i,1 t                                                 ",
    "                                              :Lf1i,.ffG,,.   .          fCt80,,;:0,.,                                                ",
    "                                             ;,,L1.,:ffGi1 ,.         .:.:Gf0:. ,...;0                                                ",
    "                                             L;; f,  LL01.     ;:     ...:,00... i ;10                                                ",
    "                                     ff1ii::::,,:,,,,,,;,,,,,,,iC:.......,..,......,,,::;iii;11:,                                     ",
    "                         G8888800000GC1;;;:,,,.,:,,,..,;,,,,,,,iC;.......,..,......,,,,:;::;ttti;;itfG0888880C                        ",
    "                 ;i1L0000888888880000C1;:::::,,:::,,:itfLLLtftG:,,;Giti1fCGCLfff1;,,...,;:;:,,1;,:i;1G888888888880LfL                 ",
    "            :,:;1;;;L0008888880fLLLLft;fffffLLLLLLG;i1C:fLiiCiG:,,:0it:i1fCCLtLLffLffifC1:ittLLLLLfLLLf08888888880Cftfi1;1            ",
    "         .,,:.,::;ifiLLLLLLLLLLLLLLLLtifffLLLLLLLLC;itC:tL:;GiG,.,:0:t,;iifLf1fLffLff;LLiGLttLLLLCLLLLLLCCCCCCCLCfGfii;t;:,:C         ",
    "        ,...,,LfLLLLLLLLLLLLLLLLLLLLLt:ffLfLLLLLLLC;;f . ...t10:.,:0;:...    :ftLfLf1iG..,C;fLLLLffCLLCCCCCCCCCCCLLLLLLL:::,1         ",
    "        ,.fffLLLLLLLLLLLLLLCCLCCCCC....,C;LLLLLLiG:,tt,...,;Gt0:,.i0;f.;t.   1.tLtCf;,it,0t:fLCCCCCCCCCLCCCCCCCCCCCLLLLLLLLL1         ",
    "        LfLLLLLLLLLLLLLCCCi,,,;fLCCCCt.CLfCCCCCL:f::,tLf;;;iGt0;,,i81f.1f::,,,,.,.,,,::G.0.....fCfCCC,G.,,,,1CCCCCCCCCLLLLLLL         ",
    "         LLLLLLLLLLLLCCCC;LCCCCCCCCCCt.LftL,,,:C:i0.,i,:,1;10;8i,,t8;L,tL::ttf,   t.ti:G,0,.,tCf;CCCCCC:.:,,:.CCCCCCCCLCLLLL          ",
    "            LLLLLCLLLCCCCCCCCCLLCCCCC1,LfiLCCCtGC:0.,f.:,:;t;G0;::i0LL:tCi;11f.t.,;Gt.tG,0,,:Ct1CCCCCCCCCCCCCCCCCCCCCCLLL             ",
    "                  LLLLCCCCCCCCCCCCCCCC,t:,fCCCCCCC0,:0ii;itt:1t.,..i:i:tCf1CitCLCLC1L:LG,8C;iCCCCCCCCCCCCCCCCCCCLCL                   ",
    "                            CCLLCCCCCC,Cf;1CCCCCCC0,f..:088C11;;:,:;;itft888:ftC LCiC;LG:8L;1CCCCCCCCCCC                              ",
    "                                      , 1it       0;L:;t000Cti:;::,::;1fL080ftfC C0GG;LG:8 i1                                         ",
    "                                     ii10f;       G;C:;tG80Cti:;:.,::;tfL880f1ff C880iLG:8 1t                                         ",
    "                                    LL:f t        G;C:i1080G1i;i;;:;i1tLL080ftfG C@ 0iC0:8 it                                         ",
    "                                    LC:Lti        G;C;tfGGCG1,,;,:,.,:;1t00GLtiG;;GfG1f0,8 1f                                         ",
    "                                      ,  t        G;C:;,ifC0C ::,:  ,11L.GLi:C;GCL0,f;C0,8 1L                                         ",
    "                                   C Lf1t8      tfL1;:::;11;:;;;tt;:,:,::i1i:::;t1ttfLCGG08LC                                         ",
    "                          fi;;iittf0088C80GLLCLtt1i;i1tfffffLffttt1111tttLLLLLLfLff1i;,ii1fLCCG08888GGGLtt;i1                         ",
    "                       CCCC:;0LLtCC;0i:;L;GCGCGGi;,,:f0;G88GLLCfttttfLLLf080.;11Ct.,iC0:,:0f1GGCGGGCCLCCCCLfCC                        ",
    "                            C;10:i,1;G:;;iGGCGGCGG;,ifft1t;1tC1:,i,11C,;CCCCGfG:G,:;tf,G,8G:,CCCCCCCCCC                               ",
    "                                    10,;i;        i;1t:;i   tt0i,i,,tC:1G    C ,t1:it;;0,8 ;i                                         ",
    "                                    i0:1it        1:i1;;:  L G0;,C:,LG,iG    1;1 i1;i;18,8 ;t                                         ",
    "                                    ;0:t11        ;:11;;;  t GLi:ii,LG:10    i C i  L;f0,8 if                                         ",
    "                                    i0;1t         ;:1i;;i    LCi:Lf,C0:10    1 C 1  Cif0,8 iL                                         ",
    "                                    101ff         ;:itii1    Gti:Lf:C0:10    1 C t  CiL0,8 1L                                         ",
    "                                   @f81fft        ::;fii1   ;t0fiL;,G0;18    t C f  C1C0,0 1L                                         ",
    "                                    L8tfLL        ;:;Ltit   tf0L:L;;G0:10    t C L  C1C0,0 1L                                         ",
    "                                    C81fLf        ::;Lt1f   tC0f:f11C0;18    L G C  C1L0,0 tL                                         ",
    "                                    G8ifL       ;L;:;Ct1f   fC0L:CitG0;18    L G L  C1L0,0 tL                                         ",
    "                                    G8itL      1t 8;CCt1GfLGt00C01:fG0;18 t  L G Lf G1L0,0 tL                                         ",
    "                                     8i1L t       t;GLftL   GCCt:G:iCC;10t   C G Lf C1L0,8 tL                                         ",
    "                                      Gt  tf    i tiCL11LtfCCfCfiL11tt1t00i,LL G Cf CtC0:8 tL                                         ",
    "                                     iii;LGG   f  1ftL;i1fC00CiiiL::;itC80CiCCCi fL1Cfi0,8 1C                                         ",
    "                                     iit1fiG  t1  i;;i;i:tC80C;:iL:::;fC00LiCC t LL1GfL0,0 tC                                         ",
    "                                     ;1itfGG  tiLLG00Ct1;fLC0fi;iLi;i1tC80L1CCttC;Lif1L0,0 fC                                         ",
    "                                     ;;;,ftfCft.tiL1GLif;tt00Ci;;1:::;tC80LtCf,ft,t,fG:0,0GLGCCLCC                                    ",
    "                            GLGCtCfL1it;ifLCCGCiiLCiGtG1.Ci00. :;i  tiLG;;,;i00;;;;t;1i0:0CiGCiGGCGGfGGGGG                            ",
    "                            1ifCG1fLLifLLLCfCCGGt;1::C;tLfC00Cft1C;;1fLG80LffGiLCG;1LG0tii0Lti1Gi:1GfLLCff                            ",
    "                               G,G11fLLG00000000GCf1;;:;:;tfftt1tCfii;;iti;;;ii1i11fLLiGG0000000CC                                    ",
    "                                       ;f 1t  ,,,:G:,i:,.,iGG:,,::,,,,::,,,.L: :,;:f.i,;,,:i;                                         ",
    "                                      G;1 Cii1;;:1G,.1:i;:       Ct:.:1      ; ; ;::, : :;,1t                                         ",
    "                                       CtC:; ft;Ci0,,1:1;:       fC;,1i      i i i:i; ; :;:1L                                         ",
    "                                       G1 t    , 10,.f,i::       tGtiGL      i i 1;1; ; ;;:tC                                         ",
    "                                       f       ; t0L,L:i;:        .ti.       i t 1i 1 i ;:,tC                                         ",
    "                                       C  f    t fG1,C:1;;    :   .ti.       f f  t i 1 i:,fC                                         ",
    "                                       C        t G:,G;1;i t    f101:fiL     t t  t 1 i ;::fC                                         ",
    "                                       f         tG;,Git;1      Lt01:L1C     f f    t i 1;:tC                                         ",
    "                                       f          G;:Ctt;t      ;iiGt;  1C  Lfff  fittt 1i,tG                                         ",
    "                                          iL    LCC;,Cft:fCCCGGGGfGGtC;iGGGCLC;,LtLtGCLL1i:fG                                         ",
    "                                     @ CCCLi;i;G;LL;,CL.,ffCLCCLLLfGCfLCCCCCLGt;C.i.tifL:1:tGCCCC                                     ",
    "                                 @ CCCLCCGLLCfGGGiLi:CLCGLC0CCtCCtCLfCf1CCCCCL;ii11f1GifLf;C0iCCLCCC                                  ",
    "                                 CCC0CCLtCCLfGGLLfC1;CLCLLtLCC0CCiGLLCLiCC::tCGi1t;::,iL0ti10fGCC0CCC                                 ",
    "                                 CCCCCGLf:1f0CCCCLCf;CLLLLtLL1fLLGLLiLf1CCfCLCtCfCffifLftftLCCLCCCCft                                 ",
    "                                   ,:CLLLCLfLCCttC0f1f0iL0LLC0CC0LLL0LLCCCCGLLLLC1LL11LCLCCCCCCC;.f                                   ",
    "                                       ;iiit0LCCCCGGLCGCftLCLLLL0GiiLLLLGCGG0LLLLCL1t0GC0Gt1;G                                        ",
    "                                       fi i;      CGCti::::;;;;;;L;:,,,,,:::1:::;i  : 1 ,,,:G                                         ",
    "                                       1tt:   f   ii,::i:f      ttit1ftL     : : f  ; ; ::,;G                                         ",
    "                                       f, t       i1,::f:L      :ii;;tfC     ; ;    ; ; ::,iC                                         ",
    "                                       tL  i      i1,:;f:C      ;ttiG01i     1 f    ; ; ;;,1L                                         ",
    "                                           t      ;i,;;L:G      L;Ci0L t     t 1    ; i i;,tL                                         ",
    "                                           1      ;1,iiC:G       L110  f     t f  : ; 1 1i:tL                                         ",
    "                                       8i  i      11,i1C:LLCCLftCL1;iCCCGLCCC1itG1;;; i:;1:ft                                         ",
    "                                       fC Lt :;f;ii1,1ft:;tfCCCCffL;;GLLCCCCCi:ttC,.1C1,;t:L1                                         ",
    "                                        LCCiLCCCCC:1,1LCtfLitCCtfL:ifLLiCCiCC1i;i,ffi,i:;t:LiCC                                       ",
    "                                      CCfCCLLtCCCC:t:1CCtfLCCCCLLLffff1;CCCLC1C:i:C;,1fC;f:CiCCCC                                     ",
    "                                     CCf:CCL8CGG;C:1:tGL1tLtCCfLLfffffGLLL:;CtCt1t0t;CLCtL;1tCCCC                                     ",
    "                                     CCC,CLLLCCCLC:f;tGfGCLLLLLffff00ffLCC;;tCG;::i;;;ffGLiLCCCCC                                     ",
    "                                      ,CLLiG1;iCf;iC;fG1ftfLLLfffffffffLLLLLLLCLfffti1f1iCtfCCCCC                                     ",
    "                                       i:GLLLLLLC1tGi;L0tffLLLLLLLfffLLLLLLLLLL1CtLLLLfttLLLC,L                                       ",
    "                                        ;  i:iLCLCGCfLGCLf1CCtLLfft8fffCCGiLffftLGCfLLff;::it                                         ",
    "                                       C,      CfLf1tCCL::tLLLLfftttffffL,CftffLi;1LtL, ,;:1f                                         ",
    "                                        iL,   i   ,i:::t:1f1;ii;:;.:::::;;f  , : t  ; : ,;;iL                                         ",
    "                                                  ,1::;f:1t      ft;,t,f     , ;    : : :;iiL                                         ",
    "                                                  ,i::;L:tt      1f:::f,     : :    , : :i;:L                                         ",
    "                                                  ,;:,;L:f1      :    11     : ;    1 : :ti:L                                         ",
    "                                                  :;::;L:f1     L;LLLLfL     ; i      :f:f1,L                                         ",
    "                                                  :;::if:L1    LL:L1LLfCt    ; i      :f:L1,G                                         ",
    "                                                  :;::1f,Ci      :Gi,1:i     i i      ;t,C1,G                                         ",
    "                                                  ;;::t1,Ci    ;:,C;:tf:;    1 1 f    ;1,Ci,G                                         ",
    "                                                  i;::ft,CiCCCC,;;it,:G:,LCCC1L1LCC   :i:Gt,                                          ",
    "                                                LLi;::Lt,fLiCCC,t0Li,iCC:fLLC1itt1fffCi1iG1:                                          ",
    "                                             LLLLLi;::Ci;tfLCCLfL0C1;tGCtCCC,1;tf,i.t.ii1G1;                                          ",
    "                                          CLLLLLLLi;::G;tfff:LLfffit;;iii1fLLt11;:,.;:1:.G11t                                         ",
    "                                         LLLLLCCCL1;::C;ttfLLLLfftt1i1t:fLCC,1L:i1.,i;;i:C1tLL                                        ",
    "                                        LLLLLLLLLL1;::G;ftfLLLLLftt;11ttfLLCC1CC1::,G1,t,C1LLLL                                       ",
    "                                        LLLLL;CCCf;;::G;ttffLLLffttt1t,ffL:LfLL,f::,Lt;i:Ct;;tL                                       ",
    "                                        LLLLttff1L:i::GitfitfLLff;tttCtffL::1LG1iit;;;tCCCttLLL                                       ",
    "                                        fLLLLCttLGii::0iffGfffLtft1tttiitt:1tLii;;f:;;fitfti:tt                                       ",
    "                                         iLfLLLfLL;t;;G;fttffffffttttttfffffftftttt;CLti;tf1fL                                        ",
    "                                           1LLLLLf;G:,G,tttttffffttttttfffffLffG:;L:Lif1i1t1                                          ",
    "                                             1tfL;GL;:fG1ff;L11tt,t:t1t:LLttt1Lt11tit;1ftL                                            ",
    "                                                tttCLfCLff;LftfttCtCttt10LGtttf1it111t                                                ",
    "                                                     tiiii,Lfttt1;fC1ttti1:i;;;iiC                                                    ",
    "                                                               CCCCLLCC                                                               ",
    "                                                                                                                                      "
];
    
    const rows = QUANTUM_ASCII.length;
    const cols = QUANTUM_ASCII[0].length;
    
    // Initialize binary matrix for flickering
    let binaryMatrix = [];
    for (let r = 0; r < rows; r++) {
        binaryMatrix[r] = [];
        for (let c = 0; c < cols; c++) {
            const char = QUANTUM_ASCII[r][c];
            if (char === ' ') {
                binaryMatrix[r][c] = ' ';
            } else {
                binaryMatrix[r][c] = Math.random() > 0.5 ? '1' : '0';
            }
        }
    }
    
    // 3D rotation angles
    let angleY = 0; // Azimuth (yaw)
    let angleX = 0; // Elevation (pitch)
    
    // Drag rotation controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        
        angleY += dx * 0.004;
        angleX += dy * 0.004;
        
        // Clamp tilt to keep model visible and readable
        angleY = Math.max(-0.6, Math.min(0.6, angleY));
        angleX = Math.max(-0.4, Math.min(0.4, angleX));
        
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    let assembledLines = 0;
    let scanY = 0;
    
    // Telemetry data pulses
    let pulses = [
        { y: 0, speed: 0.5, color: { r: 255, g: 150, b: 0 } },  // Orange data packet
        { y: -35, speed: 0.7, color: { r: 0, g: 229, b: 255 } }  // Cyan data packet
    ];
    
    // Component color mapper
    function getCharColor(r, c, char) {
        let color = { r: 0, g: 255, b: 102 }; // Default neon green
        
        // Top Flange areas (rows 0-11)
        if (r <= 11) {
            color = { r: 255, g: 215, b: 60 }; // Gold
        }
        // Upper Chamber (rows 12-31)
        else if (r <= 31) {
            if (c > 50 && c < 84) {
                color = { r: 220, g: 130, b: 70 }; // Center Column: Copper
            } else {
                // Alternating silver columns and gold plates
                color = (c % 18 < 3) ? { r: 200, g: 210, b: 220 } : { r: 255, g: 215, b: 60 };
            }
        }
        // Mid Chamber (rows 32-51)
        else if (r <= 51) {
            if (c > 62 && c < 72) {
                color = { r: 220, g: 130, b: 70 }; // Center support: Copper
            } else if (c < 30 || c > 104) {
                color = { r: 0, g: 255, b: 102 }; // Coaxial feed lines: Green
            } else {
                color = { r: 255, g: 215, b: 60 }; // Coils: Gold
            }
        }
        // Canister Shroud & QPU Core (rows 52-105)
        else {
            // Highlight QPU Core area
            if (r >= 74 && r <= 94 && c > 54 && c < 80) {
                color = { r: 0, g: 229, b: 255 }; // Glowing Cyan QPU Block
            } else {
                color = { r: 160, g: 133, b: 40 }; // Canister mesh: Shaded Gold
            }
        }
        return color;
    }
    
    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        // Spring back to center when not dragging
        if (!isDragging) {
            angleY += (0 - angleY) * 0.08;
            angleX += (0 - angleX) * 0.08;
        }
        
        // Assembly loading sequence
        if (assembledLines < rows) {
            assembledLines += 0.8;
            if (assembledLines > rows) assembledLines = rows;
            const pct = Math.floor((assembledLines / rows) * 100);
            if (statusVal) statusVal.textContent = `${pct}% - ASSEMBLING BINARY CORE...`;
        } else {
            if (statusVal) {
                statusVal.textContent = "100% OPERATIONAL // HEISENBERG CORE: ACTIVE";
                statusVal.style.color = "var(--color-neon)";
            }
        }
        
        // Update scan Y
        scanY += 0.35;
        if (scanY >= rows) scanY = 0;
        
        // Update pulses
        pulses.forEach(p => {
            p.y += p.speed;
            if (p.y >= rows) p.y = -20;
        });
        
        // Fit ASCII to canvas size with 5% margin
        const padX = width * 0.05;
        const padY = height * 0.05;
        const availW = width - padX * 2;
        const availH = height - padY * 2;
        
        const charW = availW / cols;
        const charH = availH / rows;
        
        const fontSize = Math.max(3.5, charH * 1.1);
        ctx.font = `bold ${fontSize}px "Share Tech Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const maxDrawRow = Math.floor(assembledLines);
        
        // Draw the character matrix
        for (let r = 0; r < maxDrawRow; r++) {
            // Update binary state (flicker)
            for (let c = 0; c < cols; c++) {
                if (QUANTUM_ASCII[r][c] !== ' ' && Math.random() > 0.975) {
                    binaryMatrix[r][c] = binaryMatrix[r][c] === '1' ? '0' : '1';
                }
            }
            
            for (let c = 0; c < cols; c++) {
                const char = binaryMatrix[r][c];
                if (char === ' ') continue;
                
                // Get standard colors
                let color = getCharColor(r, c, char);
                let opacity = 0.55;
                
                // --- Telemetry Pulses ---
                pulses.forEach(p => {
                    if (Math.abs(r - p.y) < 3) {
                        // Cable tracks are on the sides (c < 30 or c > 104) or center column (c around 67)
                        const isWirePath = (c < 30 || c > 104 || (c > 62 && c < 72));
                        if (isWirePath) {
                            color = p.color;
                            opacity = 0.95;
                        }
                    }
                });
                
                // --- Laser Scan Line Highlight ---
                const scanDiff = Math.abs(r - scanY);
                if (scanDiff < 2.5) {
                    const scanFactor = 1 - (scanDiff / 2.5);
                    color = { r: 255, g: 255, b: 255 }; // Glow white
                    opacity = 0.6 + 0.4 * scanFactor;
                }
                
                // Character base coordinates
                let cx = padX + c * charW + charW / 2;
                let cy = padY + r * charH + charH / 2;
                
                // Offset relative to center for 3D rotation
                let dx = cx - width / 2;
                let dy = cy - height / 2;
                let dz = 0;
                
                // 3D rotation projection
                // Y-axis rotation (yaw)
                let rx1 = dx * Math.cos(angleY) - dz * Math.sin(angleY);
                let rz1 = dx * Math.sin(angleY) + dz * Math.cos(angleY);
                
                // X-axis rotation (pitch)
                let ry2 = dy * Math.cos(angleX) - rz1 * Math.sin(angleX);
                let rz2 = dy * Math.sin(angleX) + rz1 * Math.cos(angleX);
                
                // Perspective division
                const cameraDist = 450;
                const perspective = cameraDist / (cameraDist + rz2);
                
                const drawX = width / 2 + rx1 * perspective;
                const drawY = height / 2 + ry2 * perspective;
                
                // Render character with perspective styling
                const finalSize = Math.max(3, fontSize * perspective);
                ctx.font = `bold ${finalSize}px "Share Tech Mono", monospace`;
                ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * perspective})`;
                
                ctx.fillText(char, drawX, drawY);
            }
        }
        
        // Draw the scanning line across the model
        if (assembledLines === rows) {
            const lineY = padY + scanY * charH;
            const grad = ctx.createLinearGradient(padX, lineY, padX + cols * charW, lineY);
            grad.addColorStop(0, 'rgba(0, 255, 102, 0)');
            grad.addColorStop(0.2, 'rgba(0, 255, 102, 0.15)');
            grad.addColorStop(0.5, 'rgba(0, 255, 102, 0.45)');
            grad.addColorStop(0.8, 'rgba(0, 255, 102, 0.15)');
            grad.addColorStop(1, 'rgba(0, 255, 102, 0)');
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(padX, lineY);
            ctx.lineTo(padX + cols * charW, lineY);
            ctx.stroke();
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

/* ==================================================
   4. QUANTUM VACUUM VEIL (Subtle Particles Canvas)
   ================================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5 + 0.3;
            this.vy = -(Math.random() * 0.4 + 0.1);
            this.opacity = Math.random() * 0.25 + 0.05;
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 255, 102, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        
        update() {
            this.y += this.vy;
            if (this.y < 0) {
                this.y = height;
                this.x = Math.random() * width;
            }
        }
    }
    
    const count = 60;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==================================================
   5. WIGNER FUNCTION COEHERENCE CHART VISUALIZATION
   ================================================== */
function initCatStateVis() {
    const canvas = document.getElementById('cat-state-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = canvas.offsetWidth || 400;
    let height = canvas.height = canvas.offsetHeight || 300;
    
    let isHovered = false;
    let mousePos = { x: width / 2, y: height / 2 };
    
    window.addEventListener('resize', () => {
        width = canvas.width = canvas.offsetWidth || 400;
        height = canvas.height = canvas.offsetHeight || 300;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mousePos.x = e.clientX - rect.left;
        mousePos.y = e.clientY - rect.top;
        isHovered = true;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isHovered = false;
    });
    
    let tick = 0;
    
    function draw() {
        tick++;
        ctx.fillStyle = '#080a09';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Draw coordinate axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
        ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height);
        ctx.stroke();
        
        let alphaOffset = 70;
        let speedMult = isHovered ? 2.2 : 1.0;
        let oscillation = Math.sin(tick * 0.035 * speedMult) * 5;
        
        let targetX1 = centerX - alphaOffset;
        let targetX2 = centerX + alphaOffset;
        let targetY = centerY;
        
        // Ripple interference patterns at origin
        const rippleCount = 8;
        const rWidth = 12;
        ctx.lineWidth = 2.5;
        
        for (let r = -rippleCount; r <= rippleCount; r++) {
            const phase = Math.cos(r * 1.15 + tick * 0.06 * speedMult);
            const intensity = Math.abs(phase);
            
            const x = centerX + r * rWidth;
            const dist = Math.abs(r) / rippleCount;
            const gaussianFade = Math.exp(-Math.pow(dist * 1.6, 2));
            
            ctx.strokeStyle = phase > 0 
                ? `rgba(0, 255, 102, ${gaussianFade * intensity * 0.45})` 
                : `rgba(0, 120, 50, ${gaussianFade * intensity * 0.3})`;
            
            ctx.beginPath();
            ctx.moveTo(x, centerY - 55 - oscillation);
            ctx.lineTo(x, centerY + 55 + oscillation);
            ctx.stroke();
        }
        
        // Coherent states blobs
        drawBlob(targetX1, targetY + oscillation, 28, 'rgba(0, 255, 102, 0.25)');
        drawBlob(targetX2, targetY - oscillation, 28, 'rgba(0, 255, 102, 0.25)');
        
        // Central dashed envelope ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, alphaOffset, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw crosshair targets
        drawGridCrosshair(targetX1, targetY + oscillation);
        drawGridCrosshair(targetX2, targetY - oscillation);
        
        requestAnimationFrame(draw);
    }
    
    function drawBlob(x, y, r, color) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, 'rgba(0, 255, 102, 0.55)');
        grad.addColorStop(0.3, 'rgba(0, 255, 102, 0.3)');
        grad.addColorStop(0.75, color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function drawGridCrosshair(x, y) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y);
        ctx.moveTo(x, y - 6); ctx.lineTo(x, y + 6);
        ctx.stroke();
    }
    
    draw();
}

/* ==================================================
   6. SCROLL ENGINE & TYPEWRITER TRIGGERS
   ================================================== */
function initScrollEngine() {
    const sections = document.querySelectorAll('.scroll-section');
    
    function handleScroll() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Visibility margins
            if (scrollY + viewportHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
                const fraction = (scrollY + viewportHeight - sectionTop) / (viewportHeight + sectionHeight);
                const clamped = Math.max(0, Math.min(1, fraction));
                
                // Update scroll percentage variable for CSS transitions
                section.style.setProperty('--scroll-pct', clamped.toFixed(4));
                
                // Trigger typewriters on sections once they enter the view
                if (clamped > 0.18 && clamped < 0.9) {
                    section.classList.add('active');
                    triggerTypewriters(section);
                } else {
                    section.classList.remove('active');
                }
            } else {
                section.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initialize variables on load
}

function triggerTypewriters(section) {
    const typewriters = section.querySelectorAll('.typewriter-placeholder');
    
    typewriters.forEach(el => {
        if (el.classList.contains('typed')) return;
        el.classList.add('typed');
        
        const rawText = el.innerHTML;
        el.innerHTML = '';
        el.style.opacity = 1;
        el.classList.add('typewriter-active');
        
        const parseMarkup = rawText.replace(/\*\*/g, '##BOLD##');
        const chunkArr = parseMarkup.split('');
        
        let typedHTML = "";
        let isBold = false;
        let i = 0;
        const delay = parseInt(el.getAttribute('data-delay')) || 12;
        
        function type() {
            if (i < chunkArr.length) {
                const checkString = chunkArr.slice(i, i + 8).join('');
                if (checkString.startsWith('##BOLD##')) {
                    isBold = !isBold;
                    i += 8;
                }
                
                if (i < chunkArr.length) {
                    const char = chunkArr[i];
                    if (isBold) {
                        typedHTML += `<strong>${char}</strong>`;
                    } else {
                        typedHTML += char;
                    }
                    el.innerHTML = typedHTML;
                    i++;
                    
                    // Tiny high-tech keyboard click
                    if (Math.random() > 0.65) {
                        playSynthSound(Math.random() * 200 + 800, 'sine', 0.005, 0.015);
                    }
                    setTimeout(type, delay);
                }
            } else {
                el.innerHTML = rawText;
                el.classList.remove('typewriter-active');
            }
        }
        type();
    });
}

/* ==================================================
   7. TELEMETRY OPERATIONAL CONSOLE (Terminal Commands)
   ================================================== */
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const consoleBody = document.getElementById('console-body');
    const promptContainer = document.getElementById('prompt-container');
    
    if (!input || !consoleBody) return;
    
    const commands = {
        'help': () => {
            logLine('AVAILABLE SHELL INTERACTIVE COMMANDS:', 'text-green');
            logLine('  status      - Display current cryogenic refrigerator telemetry levels.');
            logLine('  stabilize   - Call microwave pumps to suppress cavity phase-flips.');
            logLine('  diagnose    - Scan Josephson junction channels.');
            logLine('  decrypt     - Secure post-quantum defense compiled stream targets.');
            logLine('  clear       - Clear screen logs.');
        },
        'status': () => {
            logLine('RETRIEVING CRYOGENIC OVERWATCH READOUT...');
            setTimeout(() => {
                logLine('  BASE CHIP TEMP             : 10.42 mK [NOMINAL]', 'text-green');
                logLine('  TWO-PHOTON STABILIZER PUMP : LOCKED @ +14.2 dBm', 'text-green');
                logLine('  SNAIL JOSEPHSON CORES      : 0.185 [LOCKED PARAMETER]');
                logLine('  FPGA QEC CONTROL LATENCY   : 92 ns [OPTIMAL]', 'text-green');
                logLine('  SYSTEM ERROR THRESHOLD     : SUPPRESSED BY 2-PHOTON COAX', 'text-green');
            }, 200);
        },
        'stabilize': () => {
            logLine('CALIBRATING MICROWAVE QEC COHERENCE PUMP...', 'text-warning');
            
            // Play a sharp activation synth sweep
            playSynthSound(300, 'sine', 0.08, 0.15);
            setTimeout(() => playSynthSound(600, 'sine', 0.06, 0.12), 150);
            setTimeout(() => playSynthSound(900, 'sine', 0.04, 0.1), 300);
            
            setTimeout(() => {
                logLine('[SYS] RESOLVING MICROWAVE COAXIAL VOLTAGE DRIFTS...');
            }, 300);
            
            setTimeout(() => {
                logLine('SYSTEM LOCKED. BIT-FLIP HARDWARE SHIELD FULLY ENGAGED.', 'text-green');
            }, 800);
        },
        'diagnose': () => {
            logLine('SCANNING IMPEDANCE CHANNELS...');
            
            let id = 1;
            function runDiagnostic() {
                if (id <= 4) {
                    logLine(`  CHANNEL CH_0${id}: NO COMPILER COHERENCE DRIFT DETECTED`, 'text-green');
                    playSynthSound(400 + id * 100, 'sine', 0.015, 0.03);
                    id++;
                    setTimeout(runDiagnostic, 200);
                } else {
                    logLine('DIAGNOSTICS COMPLETE. RESONATOR PILE REPORTING NOMINAL.', 'text-green');
                }
            }
            setTimeout(runDiagnostic, 200);
        },
        'decrypt': () => {
            logLine('TESTING POST-QUANTUM DECRYPTION ACCELERATOR...', 'text-warning');
            
            let ticks = 0;
            const limit = 10;
            
            function traceBinary() {
                if (ticks < limit) {
                    const binStream = Array.from({length: 30}, () => Math.round(Math.random())).join('');
                    logLine(`  [DECODE_STREAM] COMPILE: ${binStream}`);
                    playSynthSound(Math.random() * 400 + 600, 'sine', 0.005, 0.01);
                    ticks++;
                    setTimeout(traceBinary, 60);
                } else {
                    logLine('DECRYPTION PROTOCOL TEST SUCCESSFUL.', 'text-green');
                    logLine('DECRYPTED ARCHITECTURE DOSSIER KEY:', 'text-green');
                    logLine('  >> [HEISENBERG RESEARCH: FAULT-TOLERANT QEC PLATFORM SECURED FOR DEFENSE SYSTEMS]', 'text-warning');
                }
            }
            setTimeout(traceBinary, 300);
        },
        'clear': () => {
            const logs = consoleBody.querySelectorAll('.log-line');
            logs.forEach(l => l.remove());
        }
    };
    
    function dispatchCommand(cmdStr) {
        const clean = cmdStr.trim().toLowerCase();
        logLine(`HEISENBERG:~$ ${cmdStr}`);
        
        if (clean === '') return;
        
        if (commands[clean]) {
            commands[clean]();
        } else {
            logLine(`ERR: Telemetry shell error. Command '${cmdStr}' not found. Type 'help'.`, 'text-warning');
            playSynthSound(150, 'sawtooth', 0.04, 0.15); // error tick
        }
        
        consoleBody.scrollTop = consoleBody.scrollHeight;
    }
    
    function logLine(txt, styleClass = '') {
        const line = document.createElement('div');
        line.className = 'log-line';
        if (styleClass) line.classList.add(styleClass);
        line.textContent = txt;
        
        consoleBody.insertBefore(line, promptContainer);
        consoleBody.scrollTop = consoleBody.scrollHeight;
    }
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const textVal = input.value;
            input.value = '';
            dispatchCommand(textVal);
            playSynthSound(800, 'sine', 0.01, 0.02); // quick enter beep
        } else {
            // Typing beep (subtle keyboard click)
            if (Math.random() > 0.6) {
                playSynthSound(Math.random() * 200 + 800, 'sine', 0.003, 0.015);
            }
        }
    });
    
    const frame = document.querySelector('.terminal-frame');
    frame.addEventListener('click', () => {
        input.focus();
    });
}

/* ==================================================
   8. WEB AUDIO API SYNTHESIZER SOUND ENGINE
   ================================================== */
// Empty audio stubs to run completely silent
function playTickSound() {}
function playSynthSound() {}

/* ==================================================
   9. CLEARANCE TRANSMISSION PORTAL
   ================================================== */
function initForm() {
    // Comms portal form hook
}

function triggerFormSubmission() {
    const submitBtn = document.getElementById('submit-btn');
    const submitText = submitBtn.querySelector('.btn-text');
    const name = document.getElementById('operator-name').value;
    const email = document.getElementById('operator-email').value;
    const org = document.getElementById('operator-org').value;
    const interest = document.getElementById('clearance-level').value;
    const message = document.getElementById('encryption-request').value;
    
    submitBtn.disabled = true;
    submitText.textContent = "ENCRYPTING DATA CHANNEL...";
    playSynthSound(900, 'sine', 0.03, 0.12);
    
    let state = 0;
    const interval = setInterval(() => {
        if (state < 3) {
            submitText.textContent = `TRANSMITTING ENVELOPE LAYER 0${state + 1}...`;
            playSynthSound(600 + state * 100, 'sine', 0.02, 0.06);
            state++;
        } else {
            clearInterval(interval);
            submitText.textContent = "TRANSMISSION COMPLETE // DISPATCHED";
            submitBtn.style.backgroundColor = '#00ff66';
            submitBtn.style.color = '#030303';
            submitBtn.style.borderColor = '#00ff66';
            playSynthSound(1000, 'sine', 0.05, 0.3);
            
            // Log command
            const consoleInput = document.getElementById('terminal-input');
            if (consoleInput) {
                const body = document.getElementById('console-body');
                const prompt = document.getElementById('prompt-container');
                const log = document.createElement('div');
                log.className = 'log-line text-warning';
                log.textContent = `[COMMS] SECURE SUBMISSION TRANSMITTED FROM OPERATOR: ${name.toUpperCase()}. CALIBRATING GATEWAY LINK...`;
                body.insertBefore(log, prompt);
            }

            // Submit form to Formsubmit.co silently in the background
            fetch("https://formsubmit.co/ajax/atharvkaushik1910@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Name: name,
                    Email: email,
                    Organization: org,
                    "Area of Interest": interest,
                    Message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Transmission dispatch confirmed:", data);
            })
            .catch(error => {
                console.error("Transmission gateway error:", error);
            });
        }
    }, 600);
}

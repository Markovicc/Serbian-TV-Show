

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["chartist"], function (Chartist) {
      return (root.returnExportsGlobal = factory(Chartist));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("chartist"));
  } else {
    root['Chartist.plugins.tooltip'] = factory(Chartist);
  }
}(this, function (Chartist) {

  /**
   * Chartist.js plugin to display a data label on top of the points in a line chart.
   *
   */
  /* global Chartist */
  (function (window, document, Chartist) {
    'use strict';

    var defaultOptions = {
      currency: undefined,
      currencyFormatCallback: undefined,
      tooltipOffset: {
        x: 0,
        y: -20
      },
      anchorToPoint: false,
      appendToBody: false,
      class: undefined,
      pointClass: 'ct-point'
    };

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.tooltip = function (options) {
      options = Chartist.extend({}, defaultOptions, options);

      return function tooltip(chart) {
        var tooltipSelector = options.pointClass;
        if (chart instanceof Chartist.Bar) {
          tooltipSelector = 'ct-bar';
        } else if (chart instanceof Chartist.Pie) {
          // Added support for donut graph
          if (chart.options.donut) {
            tooltipSelector = 'ct-slice-donut';
          } else {
            tooltipSelector = 'ct-slice-pie';
          }
        }

        var $chart = chart.container;
        var $toolTip = $chart.querySelector('.chartist-tooltip');
        if (!$toolTip) {
          $toolTip = document.createElement('div');
          $toolTip.className = (!options.class) ? 'chartist-tooltip' : 'chartist-tooltip ' + options.class;
          if (!options.appendToBody) {
            $chart.appendChild($toolTip);
          } else {
            document.body.appendChild($toolTip);
          }
        }
        var height = $toolTip.offsetHeight;
        var width = $toolTip.offsetWidth;

        hide($toolTip);

        function on(event, selector, callback) {
          $chart.addEventListener(event, function (e) {
            if (!selector || hasClass(e.target, selector))
              callback(e);
          });
        }

        on('mouseover', tooltipSelector, function (event) {
          var $point = event.target;
          var tooltipText = '';

          var isPieChart = (chart instanceof Chartist.Pie) ? $point : $point.parentNode;
          var seriesName = (isPieChart) ? $point.parentNode.getAttribute('ct:meta') || $point.parentNode.getAttribute('ct:series-name') : '';
          var meta = $point.getAttribute('ct:meta') || seriesName || '';
          var hasMeta = !!meta;
          var value = $point.getAttribute('ct:value');

          if (options.transformTooltipTextFnc && typeof options.transformTooltipTextFnc === 'function') {
            value = options.transformTooltipTextFnc(value);
          }

          if (options.tooltipFnc && typeof options.tooltipFnc === 'function') {
            tooltipText = options.tooltipFnc(meta, value);
          } else {
            if (options.metaIsHTML) {
              var txt = document.createElement('textarea');
              txt.innerHTML = meta;
              meta = txt.value;
            }

            meta = '<span class="chartist-tooltip-meta">' + meta + '</span>';

            if (hasMeta) {
              tooltipText += meta + '<br>';
            } else {
              // For Pie Charts also take the labels into account
              // Could add support for more charts here as well!
              if (chart instanceof Chartist.Pie) {
                var label = next($point, 'ct-label');
                if (label) {
                  tooltipText += text(label) + '<br>';
                }
              }
            }

            if (value) {
              if (options.currency) {
                if (options.currencyFormatCallback != undefined) {
                  value = options.currencyFormatCallback(value, options);
                } else {
                  value = options.currency + value.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
                }
              }
              value = '<span class="chartist-tooltip-value">' + value + '</span>';
              tooltipText += value;
            }
          }

          if(tooltipText) {
            $toolTip.innerHTML = tooltipText;
            setPosition(event);
            show($toolTip);

            // Remember height and width to avoid wrong position in IE
            height = $toolTip.offsetHeight;
            width = $toolTip.offsetWidth;
          }
        });

        on('mouseout', tooltipSelector, function () {
          hide($toolTip);
        });

        on('mousemove', null, function (event) {
          if (false === options.anchorToPoint)
            setPosition(event);
        });

        function setPosition(event) {
          height = height || $toolTip.offsetHeight;
          width = width || $toolTip.offsetWidth;
          var offsetX = - width / 2 + options.tooltipOffset.x;
          var offsetY = - height + options.tooltipOffset.y;
          var anchorX, anchorY;

          if (!options.appendToBody) {
            var box = $chart.getBoundingClientRect();
            var left = event.pageX - box.left - window.pageXOffset ;
            var top = event.pageY - box.top - window.pageYOffset ;

            if (true === options.anchorToPoint && event.target.x2 && event.target.y2) {
              anchorX = parseInt(event.target.x2.baseVal.value);
              anchorY = parseInt(event.target.y2.baseVal.value);
            }

            $toolTip.style.top = (anchorY || top) + offsetY + 'px';
            $toolTip.style.left = (anchorX || left) + offsetX + 'px';
          } else {
            $toolTip.style.top = event.pageY + offsetY + 'px';
            $toolTip.style.left = event.pageX + offsetX + 'px';
          }
        }
      };
    };

    function show(element) {
      if(!hasClass(element, 'tooltip-show')) {
        element.className = element.className + ' tooltip-show';
      }
    }

    function hide(element) {
      var regex = new RegExp('tooltip-show' + '\\s*', 'gi');
      element.className = element.className.replace(regex, '').trim();
    }

    function hasClass(element, className) {
      return (' ' + element.getAttribute('class') + ' ').indexOf(' ' + className + ' ') > -1;
    }

    function next(element, className) {
      do {
        element = element.nextSibling;
      } while (element && !hasClass(element, className));
      return element;
    }

    function text(element) {
      return element.innerText || element.textContent;
    }

  } (window, document, Chartist));

  return Chartist.plugins.tooltip;

}));


var chart5 = new Chartist.Line('#chart5', {
  labels: [  0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12,
        13,  14,  15,  16,  17,  18,  19,  20,  21,  22,  23,  24,  25,
        26,  27,  28,  29,  30,  31,  32,  33,  34,  35,  36,  37,  38,
        39,  40,  41,  42,  43,  44,  45,  46,  47,  48,  49,  50,  51,
        52,  53,  54,  55,  56,  57,  58,  59,  60,  61,  62,  63,  64,
        65,  66,  67,  68,  69,  70,  71,  72,  73,  74,  75,  76,  77,
        78,  79,  80,  81,  82,  83,  84,  85,  86,  87,  88,  89,  90,
        91,  92,  93,  94,  95,  96,  97,  98,  99, 100, 101, 102, 103,
       104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
       117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129,
       130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142,
       143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
       156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168,
       169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181,
       182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194,
       195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207,
       208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220,
       221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233,
       234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246,
       247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259,
       260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272,
       273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285,
       286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298,
       299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309],
  series: [
  [
    {"meta":"@ovdecamil2, RT @Zlikiliki: Balkanski 007! #glumčina #SenkeNadBalkanom #Goran_Bogdan https:\/\/t.co\/g686UvuOAP","value":3},{"meta":"@mishconi, Диван омаж Воји Танкосићу у #SenkeNadBalkanom. Његово херојство је изнад свих подела, издаја његовог гроба је неопростива.","value":3},{"meta":"@ovdecamil2, RT @senkenadblknm: Gledaćete u poslednjoj epizodi...\n\nNedelja u 20:05h na RTS1\nRTCG 20:05h\nRTRS 20:15h\n#senkenadbalkanom https:\/\/t.co\/HIOcy…","value":3},{"meta":"@dedadjinaj, RT @senkenadblknm: Gledaćete u poslednjoj epizodi...\n\nNedelja u 20:05h na RTS1\nRTCG 20:05h\nRTRS 20:15h\n#senkenadbalkanom https:\/\/t.co\/HIOcy…","value":3},{"meta":"@zastavnick, Ne mogu ni da zamislim koliko bi bolja bila serija Senke nad Balkanom. Da je režirao Radoš Bajić, a producirao sin mu.","value":3},{"meta":"@ALOnovine, Tajkun pojačava reklamu pred kampanju https:\/\/t.co\/5nxOP6kcyb","value":3},{"meta":"@irena_tviter, RT @pirat_mae: Vi koji ste na \"pizda ti materina\" sa elitom...\n#SenkeNadBalkanom","value":3},{"meta":"@Zlikiliki, Balkanski 007! #glumčina #SenkeNadBalkanom #Goran_Bogdan https:\/\/t.co\/g686UvuOAP","value":3},{"meta":"@dacaonedaca, RT @Zlikiliki: Bjelogrliću da se dodeli orden, pehar, zlatna medalja i sve ostalo za ovu seriju #SenkeNadBalkanom","value":3},{"meta":"@justvosp, RT @Dasubo75: Jeste Voja Tankosić, samo je pokazana slika Vojvode Vuka #senkenadbalkanom https:\/\/t.co\/gtHJok58vu","value":3},{"meta":"@pirat_mae, RT @alexismarkovic: U #SenkeNadBalkanom napeto kao u korsetu.\nJedva čekam sledeću nedelju.","value":3},{"meta":"@MIviceva, E da, zaboravih, Papahagi je vođa Tula #SenkeNadBalkanom","value":3},{"meta":"@irena_tviter, RT @Lady_Diksy: Divna ~ Ogi Radivojevic #SenkeNadBalkanom \nhttps:\/\/t.co\/PfMzbVWn5I","value":3},{"meta":"@irena_tviter, RT @PavleGrbovic: Žarko Laušević,  Goran Bogdan i Nenad Jezdić  svake nedelje drže čas glume \n#senkenadbalkanom","value":3},{"meta":"@pirat_mae, RT @aleksiusgenius: Mislio sam da se kod nas vise nikada nece snimiti vrhunska serija ili film. Onda su se dogodile #SenkeNadBalkanom","value":3},{"meta":"@irena_tviter, #SenkeNadBalkanom ja ne znam da li bi ovaj Kavaca uopste mogao da u nekoj ulozi igra nekoga ko nije zao 😳 \nČovek ima ozbiljno zao izraz lica","value":3},{"meta":"@pirat_mae, RT @Zlikiliki: Scena u kojoj Alimpije (Kičić) negira da je Kaluđer, a vrti brojanicu! #odlično #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @Marethewriter: Dzejms Bond je imaginarna pizda, a Mustafa Golubić je bio tata svog zanata. #SenkeNadBalkanom","value":3},{"meta":"@nalimcili, Maestralni Voja Brajovic #SenkeNadBalkanom https:\/\/t.co\/M1kL1LhJsk","value":3},{"meta":"@Zlikiliki, Bjelogrliću da se dodeli orden, pehar, zlatna medalja i sve ostalo za ovu seriju #SenkeNadBalkanom","value":3},{"meta":"@MIviceva, Do 9 #SenkeNadBalkanom od 10 #taboo","value":3},{"meta":"@007alex91, Ispada da je i Kaludjer bio jedan od austrougarskih vojnika koji su trazili tajni grob Voje Tankosica #SenkeNadBalkanom","value":3},{"meta":"@justvosp, Napadaju me botovi neke politicke stranke sto sam za monarhiju\n #senkenadbalkanom","value":3},{"meta":"@MIviceva, RT @Dasubo75: Jeste Voja Tankosić, samo je pokazana slika Vojvode Vuka #senkenadbalkanom https:\/\/t.co\/gtHJok58vu","value":3},{"meta":"@dacaonedaca, RT @senkenadblknm: Gledaćete u poslednjoj epizodi...\n\nNedelja u 20:05h na RTS1\nRTCG 20:05h\nRTRS 20:15h\n#senkenadbalkanom https:\/\/t.co\/HIOcy…","value":3},{"meta":"@PavleGrbovic, Žarko Laušević,  Goran Bogdan i Nenad Jezdić  svake nedelje drže čas glume \n#senkenadbalkanom","value":3},{"meta":"@dedadjinaj, @gordankicic Nema na čemu! Hvala tebi što glumiš tako da je privilegija gledati!\nSvaka čast!\nAli već rekoh,podela j… https:\/\/t.co\/7OppX5PcCr","value":3},{"meta":"@filip_trener, RT @senkenadblknm: Gledaćete u poslednjoj epizodi...\n\nNedelja u 20:05h na RTS1\nRTCG 20:05h\nRTRS 20:15h\n#senkenadbalkanom https:\/\/t.co\/HIOcy…","value":3},{"meta":"@DraganGulic, Prijatni primeri glume u seriji Senke nad Balkanom... Ok, tu je i Kičić. :)","value":3},{"meta":"@justvosp, RT @koljamarusja: Au, kakva epizoda #SenkeNadBalkanom . Gospodo mrzitelji serije, možete Bjeli da pljunete pod prozor.","value":3},{"meta":"@zeleniocaj, \"GLEDAOCI SU UPLAŠENI KOLIČINOM SEKSA U SENKE NAD BALKANOM\"\n\nnek prebace malo na Parove i Zadrugu da se smire","value":3},{"meta":"@justvosp, RT @b_cko: Трећа сезона је смештена пред сам почетак Другог светског рата и распад Краљевине Југославије. #SenkeNadBalkanom #info","value":3},{"meta":"@justvosp, RT @Egochetnik: Nebojša Dugalić u #SenkeNadBalkanom fantastičan u ulozi Generala Živkovića.","value":3},{"meta":"@hestegsarkazam, RT @SonOfKyusss: Nije ni Tane sisao vesla da im preda original Longinovog koplja...\n#SenkeNadBalkanom","value":3},{"meta":"@nebisinidemO, Никада нисам нешто волео Гордана Кичића, али Алимпија Мирића глуми за Оскара. Пс: Бјелогрлићу свака част.. #SenkeNadBalkanom","value":3},{"meta":"@zucerov00, RT @senkenadblknm: Gledaćete u poslednjoj epizodi...\n\nNedelja u 20:05h na RTS1\nRTCG 20:05h\nRTRS 20:15h\n#senkenadbalkanom https:\/\/t.co\/HIOcy…","value":3},{"meta":"@justvosp, RT @Nepanick: Mustafu obučavala CIA u Fargo?\n#SenkeNadBalkanom https:\/\/t.co\/Oz6pJ4wpwP","value":3},{"meta":"@justvosp, RT @Marethewriter: Dzejms Bond je imaginarna pizda, a Mustafa Golubić je bio tata svog zanata. #SenkeNadBalkanom","value":3},{"meta":"@novoselo389, RT @srpskaistorija: Војвода Вук, а не Воја Танкосић. #SenkeNadBalkanom #istorija #srbija #velikirat https:\/\/t.co\/Hw6H0xDsyF","value":3},{"meta":"@jelenasuma, RT @VeseliUmetnik: Ovaj utisak koji ostavlja #SenkeNadBalkanom odavno nisam osetio gledajući neku seriju.","value":3},{"meta":"@Lady_Diksy, Divna ~ Ogi Radivojevic #SenkeNadBalkanom \nhttps:\/\/t.co\/PfMzbVWn5I","value":3},{"meta":"@AMC__AMC, RT @alpetrovic23: Krista najbolje odigrala u kutiji. #SenkeNadBalkanom","value":3},{"meta":"@MonaLisa1797, Maja dok ulazi u Drustvo Tule spremna da ih rasturi iznutra #SenkeNadBalkanom https:\/\/t.co\/2DmuWz9Cl1","value":3},{"meta":"@Lanmika44, Kontam da je fora posedovati neku Maju. Vidite kako je krenulo Feldina #kkcz  i inspektora Tanasijevića #SenkeNadBalkanom","value":3},{"meta":"@hestegsarkazam, RT @chupelenge: ,,Тајне саме долазе да би биле откривене.\" #SenkeNadBalkanom","value":3},{"meta":"@GocaV, RT @senkenadblknm: Gledaćete u poslednjoj epizodi...\n\nNedelja u 20:05h na RTS1\nRTCG 20:05h\nRTRS 20:15h\n#senkenadbalkanom https:\/\/t.co\/HIOcy…","value":3},{"meta":"@justvosp, Daboga se vratila monarhija\n #senkenadbalkanom","value":3},{"meta":"@DankoRunic, Hvala ekipi predstave #Hotel88 na fantastičnom provodu, sjajan tekst, talentovani glumci i ambijent @88RoomsHotel P… https:\/\/t.co\/oMkgEQk2ln","value":3},{"meta":"@Petkovic_A, RT @senkenadblknm: Gledaćete u poslednjoj epizodi...\n\nNedelja u 20:05h na RTS1\nRTCG 20:05h\nRTRS 20:15h\n#senkenadbalkanom https:\/\/t.co\/HIOcy…","value":3},{"meta":"@alpetrovic23, U kojoj epizodi umire Nina Sinačar #SenkeNadBalkanom #tlzp","value":3},{"meta":"@StajaPoUgovoru, Dakle kvota i dalje raste u #SenkeNadBalkanom da epizoda prođe bez mrtve glave. 😂😂😂😂","value":3},{"meta":"@senkenadblknm, Gledaćete u poslednjoj epizodi...\n\nNedelja u 20:05h na RTS1\nRTCG 20:05h\nRTRS 20:15h\n#senkenadbalkanom https:\/\/t.co\/HIOcy0EDLE","value":3},{"meta":"@zoranhudak, RT @alpetrovic23: Krista najbolje odigrala u kutiji. #SenkeNadBalkanom","value":3},{"meta":"@marcomilic, Nedelja veče - 1\/3 #SenkeNadBalkanom 1\/3 #tlzp 1\/3 #Vikinzi","value":3},{"meta":"@Lulame17, Inspektor Pletikosić.\n\nJebač presretač.\n\n😋\n\n#SenkeNadBalkanom","value":3},{"meta":"@Bokins82, Kako je zanimljivo čitati sve ove tvitove, svako ima svoju #teritoriju . #SenkeNadBalkanom","value":3},{"meta":"@ovdecamil2, RT @Zlikiliki: Scena u kojoj Alimpije (Kičić) negira da je Kaluđer, a vrti brojanicu! #odlično #SenkeNadBalkanom","value":3},{"meta":"@Dasubo75, Jeste Voja Tankosić, samo je pokazana slika Vojvode Vuka #senkenadbalkanom https:\/\/t.co\/gtHJok58vu","value":3},{"meta":"@Marethewriter, Dzejms Bond je imaginarna pizda, a Mustafa Golubić je bio tata svog zanata. #SenkeNadBalkanom","value":3},{"meta":"@Zlikiliki, Scena u kojoj Alimpije (Kičić) negira da je Kaluđer, a vrti brojanicu! #odlično #SenkeNadBalkanom","value":3},{"meta":"@Nepanick, Mustafu obučavala CIA u Fargo?\n#SenkeNadBalkanom https:\/\/t.co\/Oz6pJ4wpwP","value":3},{"meta":"@ovdecamil2, Na kraju ih Tane napada, opšti rat. Ali pre toga obračun Rusa sa VMRO DPMNE što se i vidi iz najave sledeće epizode #SenkeNadBalkanom","value":3},{"meta":"@justvosp, Sta imaju zajednicko Tane ,Mustafa i  Krojac?\nZa Kralja i Otadzinu\nKralj Petar na bojistu  1914\n #senkenadbalkanom https:\/\/t.co\/y5nqilqRAJ","value":3},{"meta":"@aleksiusgenius, Mislio sam da se kod nas vise nikada nece snimiti vrhunska serija ili film. Onda su se dogodile #SenkeNadBalkanom","value":3},{"meta":"@zlatanovicmarko, Slika Milosa Obrenovica u sobi Djordja Karadjordjevica #SenkeNadBalkanom","value":3},{"meta":"@Egochetnik, Nebojša Dugalić u #SenkeNadBalkanom fantastičan u ulozi Generala Živkovića.","value":3},{"meta":"@Zlikiliki, Interesantno je da doktorka pominje Sirotište Kraljice Natalije u doba kada vladaju Karađorđevići! Tada je sve bilo… https:\/\/t.co\/XufHqUkz5M","value":3},{"meta":"@Nepanick, #SenkeNadBalkanom OST hit za Srpsku novu godinu, ko da gledam.","value":3},{"meta":"@BugarinDebeli, RT @Lanmika44: Jos jedna pobeda Alimpija trenera #kkcz  i Alimpija Mirića Kaluđera #SenkeNadBalkanom","value":3},{"meta":"@dusicakrasojev1, RT @polupanimozak26: Još kad bih ja znao šta su vam te senke nad balkanom","value":3},{"meta":"@MarijaRatkovic, #SenkeNadBalkanom imaju toliko lošu kolor korekciju da bukvalno SENKE NE POSTOJE","value":3},{"meta":"@SrceodK, Ovaj Sebastijan Kavaca je prste da poližeš... morala sam da kažem samo da gledam i odmorim oči #senkenadbalkanom","value":3},{"meta":"@Maci981, Cudi me da u #SenkeNadBalkanom nije bilo uloge za Ljubu Bandovica ili Nikolu Koju?","value":3},{"meta":"@_licina, senke nad balkanom su nešto najbolje što se desilo srpskoj televiziji od nastupa ane nikolić sa romale romali na beoviziji.","value":3},{"meta":"@PostmodernistaS, Nisam ja te sreće da ova bliznakinja Jelene Gavrilović bude sledeća #SenkeNadBalkanom","value":3},{"meta":"@justvosp, RT @ElMagiko19: Inspektor Tane do kraja serije.....#SenkeNadBalkanom","value":3},{"meta":"@ovdecamil2, Mariji Bergam leti glava #SenkeNadBalkanom","value":3},{"meta":"@b_cko, Трећа сезона је смештена пред сам почетак Другог светског рата и распад Краљевине Југославије. #SenkeNadBalkanom #info","value":3},{"meta":"@alexismarkovic, U #SenkeNadBalkanom napeto kao u korsetu.\nJedva čekam sledeću nedelju.","value":3},{"meta":"@justvosp, RT @srpskaistorija: Војвода Вук, а не Воја Танкосић. #SenkeNadBalkanom #istorija #srbija #velikirat https:\/\/t.co\/Hw6H0xDsyF","value":3},{"meta":"@b_cko, Друга сезона обрађује период пред убиство краља Александра Карађорђевића у Марсељу 1934. године и завршава се чином… https:\/\/t.co\/76uve95YGX","value":3},{"meta":"@koljamarusja, Au, kakva epizoda #SenkeNadBalkanom . Gospodo mrzitelji serije, možete Bjeli da pljunete pod prozor.","value":3},{"meta":"@saksija3, RT @_Smirnoff_Ice_: jes' pederski ali:\nu seriji bolji frajeri nego zenske\n#SenkeNadBalkanom","value":3},{"meta":"@justvosp, RT @thedjenka: Alimpije Mirić je iz Trstenika. #SenkeNadBalkanom","value":3},{"meta":"@b_cko, Прва сезона покрива период непосредно пред убиство хрватског народног посланика Стјепана Радића у Народној Скупштин… https:\/\/t.co\/rJQLWrrwgF","value":3},{"meta":"@milan851, RT @srpskaistorija: Војвода Вук, а не Воја Танкосић. #SenkeNadBalkanom #istorija #srbija #velikirat https:\/\/t.co\/Hw6H0xDsyF","value":3},{"meta":"@justvosp, RT @Lanmika44: Sranje je što Kaluđer neće je.. makedonsko devojče #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @DejanPataki: Meni je serija odlicna. Odavno nista bolje na maternjem jeziku nisam gledao.\n#SenkeNadBalkanom","value":3},{"meta":"@justvosp, RT @_Smirnoff_Ice_: jes' pederski ali:\nu seriji bolji frajeri nego zenske\n#SenkeNadBalkanom","value":3},{"meta":"@muchka72, RT @polupanimozak26: Još kad bih ja znao šta su vam te senke nad balkanom","value":3},{"meta":"@StajaPoUgovoru, Eh da pitam...\n\nDa li je i ova epizoda #SenkeNadBalkanom prošla bez ubijene osobe?\n\n🤔","value":3},{"meta":"@pirat_mae, RT @Nasko_El_grande: Koliko različitih ličnosti i događaja je Bjela uspeo da uglavi zajedno i napravi sjajnu seriju. #SenkeNadBalkanom","value":3},{"meta":"@nekad_bio, RT @alpetrovic23: Krista najbolje odigrala u kutiji. #SenkeNadBalkanom","value":3},{"meta":"@MladenAleksic85, RT @srpskaistorija: Војвода Вук, а не Воја Танкосић. #SenkeNadBalkanom #istorija #srbija #velikirat https:\/\/t.co\/Hw6H0xDsyF","value":3},{"meta":"@alpetrovic23, RT @thedjenka: Alimpije Mirić je iz Trstenika. #SenkeNadBalkanom","value":3},{"meta":"@_Smirnoff_Ice_, jes' pederski ali:\nu seriji bolji frajeri nego zenske\n#SenkeNadBalkanom","value":3},{"meta":"@Nasko_El_grande, Koliko različitih ličnosti i događaja je Bjela uspeo da uglavi zajedno i napravi sjajnu seriju. #SenkeNadBalkanom","value":3},{"meta":"@Lanmika44, Sranje je što Kaluđer neće je.. makedonsko devojče #SenkeNadBalkanom","value":3},{"meta":"@polupanimozak26, Još kad bih ja znao šta su vam te senke nad balkanom","value":3},{"meta":"@marcomilic, Ako se ne varam, sledeće nedelje je poslednja epizoda prve sezone #SenkeNadBalkanom","value":3},{"meta":"@thedjenka, Alimpije Mirić je iz Trstenika. #SenkeNadBalkanom","value":3},{"meta":"@Zlikiliki, Scena u kafani, u Jatagan mali, a za stolom sede Goran Bogdan, Jezdić, Bjela i Miloš Samolov i onaj mali orkestar… https:\/\/t.co\/Zn8L7tM0p4","value":3},{"meta":"@Egochetnik, Gordan Kičić ipak u poslednje dve epizode odigrao fantastično, nije više samo Sumpor. #SenkeNadBalkanom","value":3},{"meta":"@millissent, #ThuleSociety #SenkeNadBalkanom","value":3},{"meta":"@hodajucawisdom, RT @Venera_Svoja: Dobar Goran Bogdan, dobaaar! 👏👏👏 #SenkeNadBalkanom","value":3},{"meta":"@Nepanick, RT @alpetrovic23: Kičić pokidao u seriji i onda puste najavu za Ludu noć i prospe mleko #SenkeNadBalkanom","value":3},{"meta":"@srpskaistorija, Војвода Вук, а не Воја Танкосић. #SenkeNadBalkanom #istorija #srbija #velikirat https:\/\/t.co\/Hw6H0xDsyF","value":3},{"meta":"@esenciija, Priča da je Kičić promašio profesiju ne da nije na mestu nego je sramna i dolazi od bezveznjakovića i neznalica.… https:\/\/t.co\/FlPDrZkzTv","value":3},{"meta":"@onako_sa_strane, Jos sam po utiskom #SenkeNadBalkanom pa mi je Tijana ko Mustafa Golubic #tlzp","value":3},{"meta":"@el_ellena, RT @alpetrovic23: Krista najbolje odigrala u kutiji. #SenkeNadBalkanom","value":3},{"meta":"@harold_smit, Ne gledam #SenkeNadBalkanom, svakako hocu nekom prilikom, ali primecujem da su na tviteru sve sami poznavaoci istor… https:\/\/t.co\/Px4pxwnRbN","value":3},{"meta":"@nepodnosljiva, Onesvestiću se #SenkeNadBalkanom https:\/\/t.co\/KKuNluGIHZ","value":3},{"meta":"@hodajucawisdom, RT @jjmedic89: Koliko si dobar frajer od nula do Sebastijan Kavaca? Ajme! #SenkeNadBalkanom","value":3},{"meta":"@Blayachim, RT @Svemirdonac: Zarku Lausevicu dovoljno bukvalno jedna scena da izdominira i pokaze ko je najbolji glumac na Balkanu.  #SenkeNadBalkanom","value":3},{"meta":"@sprej_za_nos, RT @Zovem_se_Ines: Kosa i frizura Marije Bergam u #SenkeNadBalkanom bukvalno goals","value":3},{"meta":"@sprej_za_nos, RT @escobarns: Više preokreta u #SenkeNadBalkanom nego u mom životu.","value":3},{"meta":"@muchka72, Gledate neke #SenkeNadBalkanom \nA živimo u mraku","value":3},{"meta":"@Nepanick, Dakle, jebe lep.\n#Pletikosić #SenkeNadBalkanom","value":3},{"meta":"@ElMagiko19, Inspektor Tane do kraja serije.....#SenkeNadBalkanom","value":3},{"meta":"@sprej_za_nos, RT @BusPuklaBum: Princ je lud. Ali nije glup.\n #SenkeNadBalkanom","value":3},{"meta":"@Egochetnik, RT @alpetrovic23: Krista najbolje odigrala u kutiji. #SenkeNadBalkanom","value":3},{"meta":"@zokibb, Ja mislim da se na kraju Vučić dokopao ovog koplja. #SenkeNadBalkanom","value":3},{"meta":"@ovdecamil2, Voja Brajović je glavni Thula po meni, siguran sam 50% zbog onog \"vi ste master ...\" nešto tamo kada mu Austrijanac… https:\/\/t.co\/cXyOBEMq8l","value":3},{"meta":"@Zlikiliki, Iako nemam baš neko mišljenje o Žarku Lauševiću zbog onog skandala, ne poričem da je glumčina par excellence! #SenkenadBalkanom","value":3},{"meta":"@DejanPataki, Meni je serija odlicna. Odavno nista bolje na maternjem jeziku nisam gledao.\n#SenkeNadBalkanom","value":3},{"meta":"@ukii_kg, Koliko covek treba biti glup pa porediti \"Senke nad Balkanom\" sa \"Selo gori a baba se ceslja\"?","value":3},{"meta":"@Blayachim, RT @acadoske: Mustafa Golubić &gt;&gt;&gt; Tom Hardi #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @Dalibor_sb: JE BO TE!!!! Ko sad da doceka sledecu nedelju?? #SenkeNadBalkanom","value":3},{"meta":"@Marethewriter, Posle svake epizode, mora da se \"kopa\" po netu malo o Tulima, malo o Golubiću. A Golubic bio baš zajeban igrač. #SenkeNadBalkanom","value":3},{"meta":"@justvosp, RT @Dalibor_sb: JE BO TE!!!! Ko sad da doceka sledecu nedelju?? #SenkeNadBalkanom","value":3},{"meta":"@Venera_Svoja, Dobar Goran Bogdan, dobaaar! 👏👏👏 #SenkeNadBalkanom","value":3},{"meta":"@Lanmika44, Jos jedna pobeda Alimpija trenera #kkcz  i Alimpija Mirića Kaluđera #SenkeNadBalkanom","value":3},{"meta":"@justvosp, Sanjala sam da mi @Dejan018 fejvao neki tvit a da nema veze sa   #senkenadbalkanom","value":3},{"meta":"@Blayachim, RT @BusPuklaBum: Princ je lud. Ali nije glup.\n #SenkeNadBalkanom","value":3},{"meta":"@Zlikiliki, Ali staviti Mariju Bergam i Gorana Bogdana u istu scenu je smešno... #SenkenadBalkanom Ta žena više glumata nego što glumi!","value":3},{"meta":"@jjmedic89, Koliko si dobar frajer od nula do Sebastijan Kavaca? Ajme! #SenkeNadBalkanom","value":3},{"meta":"@tanjadjv, RT @chupelenge: ,,Тајне саме долазе да би биле откривене.\" #SenkeNadBalkanom","value":3},{"meta":"@skljuc, Glumište je dobilo ime koje će se tek vinuti u visine. Andriju Kuzmanovića.\n\n#SenkeNadBalkanom","value":3},{"meta":"@justvosp, RT @mlekce: Kapa dole @Dejan018 i ekipa #SenkeNadBalkanom. Jedva čekam iduću nedelju!","value":3},{"meta":"@pirat_mae, RT @mare_djole: Svaka rec je suvisna, serija sama govori vise od 1000 reci.#SenkeNadBalkanom","value":3},{"meta":"@acadoske, Ispisuje se iz #SenkeNadBalkanom upisuje se u dekolte Nine Seničar #tlzp","value":3},{"meta":"@nidjevez_e, Meni je drago i sto sam konacno vidio kako izgleda glas koji cita trejlere i tv najave po hrvatskim televizijama. #Kavaca #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @LecaShargarepa: Sve su smandrljai u seriju. I opet je izvanredna. #SenkeNadBalkanom","value":3},{"meta":"@ovdecamil2, RT @mindinmotionmkd: Многу јака епизодава. #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @SonOfKyusss: Nije ni Tane sisao vesla da im preda original Longinovog koplja...\n#SenkeNadBalkanom","value":3},{"meta":"@zli_blizanac, Gledam ove Senke nad Balkanom i ni cigara mi ne treba eto koliko mi je zabavna","value":3},{"meta":"@justvosp, RT @mare_djole: Svaka rec je suvisna, serija sama govori vise od 1000 reci.#SenkeNadBalkanom","value":3},{"meta":"@ovdecamil2, RT @snepintrtl: #SenkeNadBalkanom - \"Kurvo,peri pičku,da se jebeš,majku ti jebem jebenu.\"Hašiš,kurac,Rusi.sise.dupe.\"Karađorđeviđi.Beograd.…","value":3},{"meta":"@justvosp, RT @BusPuklaBum: Još samo jedna epizoda. Već sam tužna, baš sam uživala. I u gledanju i u komentarisanju 😀\n #SenkeNadBalkanom","value":3},{"meta":"@chupelenge, Маја Двидовић се у последњој епизоди љуби с Габријелом Махтом!\n Е, па ја ћу да је скратим за главу! #SenkeNadBalkanom","value":3},{"meta":"@nepodnosljiva, Glas Sebastiana Cavazze je čist afrodizijak #SenkeNadBalkanom","value":3},{"meta":"@justvosp, RT @MiskoBrigada: Krojač Mustafa i Tane kakva ekipa 👊👊 #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @ovdecamil2: Avakumović ili Voja? #SenkeNadBalkanom","value":3},{"meta":"@justvosp, RT @SonOfKyusss: Nije ni Tane sisao vesla da im preda original Longinovog koplja...\n#SenkeNadBalkanom","value":3},{"meta":"@Dalibor_sb, JE BO TE!!!! Ko sad da doceka sledecu nedelju?? #SenkeNadBalkanom","value":3},{"meta":"@justvosp, Ma unistili ste nam vojsku.Serija pokazuje koliko je prijateljstvo medju ljudima kada su ratovali za Kralja i Otadzinu\n #senkenadbalkanom","value":3},{"meta":"@BanjacMilisav, Na kraju to bi mogao biti sukob naših tajnih udruženja ponovo reintegrisanih belorukaca i crnorukaca sa jedne stran… https:\/\/t.co\/QarydlAHRZ","value":3},{"meta":"@pirat_mae, A posle #SenkeNadBalkanom Kaludjer i Trnavac djuskaju u #LudaNoc\n😁","value":3},{"meta":"@mlekce, Kapa dole @Dejan018 i ekipa #SenkeNadBalkanom. Jedva čekam iduću nedelju!","value":3},{"meta":"@Nepanick, Sve glave pod jednu šljivu.\n#SenkeNadBalkanom","value":3},{"meta":"@dedadjinaj, @gordankicic ,rekao bih da ti se u seriji #SenkeNadBalkanom  ne piše baš dobro😋?!?\nAlimpija igraš maestralno,ali sm… https:\/\/t.co\/ELhG7Sv9dY","value":3},{"meta":"@saksija3, RT @justvosp: Krojac Mustafa Tane toe ta ekipa\n🔜🗡️🗡️🗡️\n #senkenadbalkanom","value":3},{"meta":"@marcomilic, RT @GocaV: Маја ће да руши систем изнутра. #SenkenadBalkanom","value":3},{"meta":"@MutavoPile, Zavrsile se #SenkeNadBalkanom p predjoh na #tlzp\nSta se desavalo pre ovo troje?","value":3},{"meta":"@SonOfKyusss, Nije ni Tane sisao vesla da im preda original Longinovog koplja...\n#SenkeNadBalkanom","value":3},{"meta":"@LecaShargarepa, Sve su smandrljai u seriju. I opet je izvanredna. #SenkeNadBalkanom","value":3},{"meta":"@marcomilic, RT @esenciija: Kapa dole za priču oko Tankosića! #SenkeNadBalkanom","value":3},{"meta":"@laninja_bl, Gledali smo večeras #meso #senkenadbalkanom i to sa svojom četvorogodišnjom ćetkom koja se inače izbeči kad čuje ps… https:\/\/t.co\/1fSr4iZlI7","value":3},{"meta":"@BusPuklaBum, RT @alpetrovic23: Krista najbolje odigrala u kutiji. #SenkeNadBalkanom","value":3},{"meta":"@zokibb, Zeznuto je kad su scenarista i producent ista osoba, pa čim zastane para, nekom glumcu ode glava... :D\n#SenkeNadBalkanom","value":3},{"meta":"@BusPuklaBum, RT @justvosp: Krojac Mustafa Tane toe ta ekipa\n🔜🗡️🗡️🗡️\n #senkenadbalkanom","value":3},{"meta":"@justvosp, RT @pirat_mae: Ovde zivi Stanko Pletikosic?\nJo, jo...\n\nNeprikosnoveni Marko Nikolic\n#SenkeNadBalkanom","value":3},{"meta":"@ovdecamil2, RT @soljinac: Pomažem oko spremanja slave, seku se kolači, držim oštricu u ruci, a uskoro počinju #SenkeNadBalkanom","value":3},{"meta":"@MiskoBrigada, Krojač Mustafa i Tane kakva ekipa 👊👊 #SenkeNadBalkanom","value":3},{"meta":"@GnomacGG, #SenkeNadBalkanom = #SranjeNaBalkanu","value":3},{"meta":"@ovdecamil2, RT @MladenAleksic85: Ha, mozda se vidimo u crkvi... #SenkeNadBalkanom","value":3},{"meta":"@MladenBest, RT @chupelenge: Покољу се па пију заједно, Српска посла ;)\n#SenkeNadBalkanom","value":3},{"meta":"@pravac_hamburg, ne sećam se da sam ikad gledao netalentovaniju glumicu od ove Ive Kevre koja je glumila ženu Dr. Avakumovića. Jel n… https:\/\/t.co\/Q4a1QJVUqi","value":3},{"meta":"@ovdecamil2, RT @trazecizvezdicu: Ovo se zove gluma. Imenom i prezimenom Žarko Laušević. #SenkeNadBalkanom","value":3},{"meta":"@BusPuklaBum, Još samo jedna epizoda. Već sam tužna, baš sam uživala. I u gledanju i u komentarisanju 😀\n #SenkeNadBalkanom","value":3},{"meta":"@ovdecamil2, RT @Knjigosaurus: Laušević pokidao sa glumom i ulogom princa Đorđa!\n#SenkeNadBalkanom","value":3},{"meta":"@justvosp, RT @JovanColoveic: “To nije Vaše pravo, već obaveza.”\n#SenkeNadBalkanom","value":3},{"meta":"@Blayachim, Mustafa!  #SenkeNadBalkanom","value":3},{"meta":"@bidzonse, Divna je baš divna!\nOgi Radivojević - Divna https:\/\/t.co\/01iqZdxy4x\n#SenkeNadBalkanom","value":3},{"meta":"@mare_djole, Svaka rec je suvisna, serija sama govori vise od 1000 reci.#SenkeNadBalkanom","value":3},{"meta":"@ovdecamil2, RT @BusPuklaBum: Princ je lud. Ali nije glup.\n #SenkeNadBalkanom","value":3},{"meta":"@justvosp, RT @esenciija: Kapa dole za priču oko Tankosića! #SenkeNadBalkanom","value":3},{"meta":"@ovdecamil2, RT @abrovinodz: Kakva epizoda jebote #SenkeNadBalkanom","value":3},{"meta":"@tzv_Bojana, Nije mi glupo da svake nedelje tvitnem oduševljenje serijom #SenkeNadBalkanom","value":3},{"meta":"@slaxkg, Bogami, Bjela zakopao baš, baš duboko... \n#SenkeNadBalkanom","value":3},{"meta":"@nepodnosljiva, RT @pjevacica_mala: Ovaj Sebastian Kavaca.\nHalo vatrogasci??\n\n#senkenadbalkanom","value":3},{"meta":"@justvosp, RT @alpetrovic23: Куде су Македонци? #SenkeNadBalkanom","value":3},{"meta":"@chupelenge, RT @Ujka_Carli: Saću se napijem uz ovu:\n\n\"O divnaaaa,o divna,noci besanaaaaa...\"\n\n#SenkeNadBalkanom","value":3},{"meta":"@lega_loo, \"Senke nad Balkanom\" je jebeni masterpis!!!","value":3},{"meta":"@pirat_mae, RT @justvosp: Krojac Mustafa Tane toe ta ekipa\n🔜🗡️🗡️🗡️\n #senkenadbalkanom","value":3},{"meta":"@RaquelGato, RT @pjevacica_mala: Ovaj Sebastian Kavaca.\nHalo vatrogasci??\n\n#senkenadbalkanom","value":3},{"meta":"@ovdecamil2, Avakumović ili Voja? #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @Dana_Perina: Zabole me glavudža od mozganja #SenkeNadBalkanom","value":3},{"meta":"@justvosp, Krojac Mustafa Tane toe ta ekipa\n🔜🗡️🗡️🗡️\n #senkenadbalkanom","value":3},{"meta":"@Slobodan1991, Uskladiti makedonski VMRO, Pavelića, komuniste, ruske migrante, nacističko tajno društvo \"Tuli\", princa Đorđa u ova… https:\/\/t.co\/YzTNNA1t73","value":3},{"meta":"@LecaShargarepa, Kakva vrhunska gluma! Iz scene u scenu me svaki glumac oduševljava. #SenkeNadBalkanom","value":3},{"meta":"@alpetrovic23, Krista najbolje odigrala u kutiji. #SenkeNadBalkanom","value":3},{"meta":"@poleksija, Najbolja epizoda do sada. #SenkeNadBalkanom","value":3},{"meta":"@Blayachim, Divna #Magnifico #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @dobrila_m: Ovo samo Bjela moze da uradi - okupi takvu ekipu glumaca I napravi pricu od koje se dugo, dugo oporavljas! #SenkeNadBalkanom…","value":3},{"meta":"@pirat_mae, RT @chupelenge: Покољу се па пију заједно, Српска посла ;)\n#SenkeNadBalkanom","value":3},{"meta":"@Petkovic_A, #SenkeNadBalkanom 👏🏻👏🏻👏🏻👏🏻👏🏻👏🏻👏🏻👏🏻👏🏻👏🏻👏🏻","value":3},{"meta":"@pirat_mae, RT @pavlovic9: #SenkeNadBalkanom vrh.... Sad ce Krojac na Kaludjera...\nBravo @Dejan018","value":3},{"meta":"@alpetrovic23, Куде су Македонци? #SenkeNadBalkanom","value":3},{"meta":"@mgaga__, Uzbudjenje #SenkeNadBalkanom  ko da ceka sledecu nedelju","value":3},{"meta":"@Blayachim, Auuu..... #SenkeNadBalkanom","value":3},{"meta":"@CikaDule, RT @Solisio: Rakija nikog na put nije izvela.\nkultno. #SenkeNadBalkanom","value":3},{"meta":"@marcomilic, RT @GdjicaDalovej: Provalio ih Đole, idemooo! #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @ovcaCrna: Ozbiljan hit za razbijanje kafane #SenkeNadBalkanom","value":3},{"meta":"@MladenBest, Maja me u svakoj epizodi #SenkeNadBalkanom iznenadi, ne znam koji joj je...","value":3},{"meta":"@dedadjinaj, U kući u kojoj je Maja Davidović,je sniman i film \"Pre rata\",po Nušićevim komedijama\"Pokojnik\" i\"Ožalošćena porodica\"\n#SenkeNadBalkanom","value":3},{"meta":"@esenciija, Kapa dole za priču oko Tankosića! #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @BusPuklaBum: Princ je lud. Ali nije glup.\n #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @Ujka_Carli: Saću se napijem uz ovu:\n\n\"O divnaaaa,o divna,noci besanaaaaa...\"\n\n#SenkeNadBalkanom","value":3},{"meta":"@justboka, Bravo, sto puta Bravo, za seriju!!! #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @PrincOdKrcagova: -Princ je lud.\n-Ali, nije glup.\n#SenkeNadBalkanom","value":3},{"meta":"@GocaV, Маја ће да руши систем изнутра. #SenkenadBalkanom","value":3},{"meta":"@CikaDule, Dobre, baš dobre #SenkeNadBalkanom","value":3},{"meta":"@ElMagiko19, Umoči ga Pletikosić konačno 😃\n#SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @alpetrovic23: Pa dao ti je Bjela koplje. #SenkeNadBalkanom","value":3},{"meta":"@stevan1967, E jbg .....taman se zakuvalo ...#SenkeNadBalkanom ....opasnooo!!","value":3},{"meta":"@pirat_mae, RT @escobarns: Više preokreta u #SenkeNadBalkanom nego u mom životu.","value":3},{"meta":"@BanjacMilisav, Genijalno #SenkeNadBalkanom \n\nGENIJALNO!!!!","value":3},{"meta":"@pirat_mae, RT @MlaDacika: #MarkoNikolić kralj! #SenkeNadBalkanom","value":3},{"meta":"@JovanColoveic, “To nije Vaše pravo, već obaveza.”\n#SenkeNadBalkanom","value":3},{"meta":"@abrovinodz, Kakva epizoda jebote #SenkeNadBalkanom","value":3},{"meta":"@acadoske, Pele zajeban lik #SenkeNadBalkanom","value":3},{"meta":"@onako_sa_strane, RT @onako_sa_strane: Ako neko poznaje ovog Bjelogrlica neka mu cestita na #SenkeNadBalkanom .","value":3},{"meta":"@GdjicaDalovej, Opa, plot twist! \n\n#SenkeNadBalkanom","value":3},{"meta":"@odmilionjedan, Znao sam da je Voja Brajovic tata 😂 #senkenadbalkanom","value":3},{"meta":"@MlaDacika, Auuuu! Kad će nedelja????? #SenkeNadBalkanom","value":3},{"meta":"@BusPuklaBum, Ček, a deda zabavlja praunuče dok se ovi krešu? Ccc!\n #SenkeNadBalkanom","value":3},{"meta":"@nenad_d1977, u 2018. hoću da budem mršav i da mi odelo stoji kao ovom Slovencu u #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, 'Oće l' Maja da krkne doktora sa kopljem?\n#SenkeNadBalkanom","value":3},{"meta":"@lipovica01, Ipak je Boris Kavaca bio bolja faca #SenkenadBalkanom","value":3},{"meta":"@DordeStojkovic, u svakoj sceni muzicka tema. da nije malo mnogo? #SenkeNadBalkanom","value":3},{"meta":"@zap_lola, RT @soljinac: Pomažem oko spremanja slave, seku se kolači, držim oštricu u ruci, a uskoro počinju #SenkeNadBalkanom","value":3},{"meta":"@Zovem_se_Ines, Kosa i frizura Marije Bergam u #SenkeNadBalkanom bukvalno goals","value":3},{"meta":"@bluesharp93, \"O divna o divna noci besana\njedino ti nisi me napustila\"\nsvetska serija 😀\n#SenkeNadBalkanom","value":3},{"meta":"@MlaDacika, #MarkoNikolić kralj! #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, Ovde zivi Stanko Pletikosic?\nJo, jo...\n\nNeprikosnoveni Marko Nikolic\n#SenkeNadBalkanom","value":3},{"meta":"@Grobaris1970, RT @escobarns: Više preokreta u #SenkeNadBalkanom nego u mom životu.","value":3},{"meta":"@chupelenge, Море, мени су сви у овој серији сумњиви!\n#SenkeNadBalkanom","value":3},{"meta":"@acadoske, Ko je ubiven od ženskih likova? #SenkeNadBalkanom @tanja_henry","value":3},{"meta":"@escobarns, Više preokreta u #SenkeNadBalkanom nego u mom životu.","value":3},{"meta":"@gpuaca, Mustafa Golubić kao dobrovoljac u odredu Vojvode Vuka! #SenkeNadBalkanom https:\/\/t.co\/UhIVVjBHKY","value":3},{"meta":"@ivan_raonic, #SenkeNadBalkanom kako ste krenuli, do kraja serije neće nikome ostati glava na ramenima 😀","value":3},{"meta":"@naporna, Veceras ste zakucani pred ekranom, svi gledate #SenkeNadBalkanom","value":3},{"meta":"@alpetrovic23, Pa dao ti je Bjela koplje. #SenkeNadBalkanom","value":3},{"meta":"@trazecizvezdicu, Po kojem kriterijumu su birali ove netalentovane glumice??? #SenkeNadBalkanom","value":3},{"meta":"@zgrozena_vrsta, Kolika si faca na skali od jedan do Goran Bogdan? #SenkeNadBalkanom","value":3},{"meta":"@_impresionista, Treba pružiti ruku Bjelogrliću za ovu seriju. Može se zameriti štošta ali te ipak natera da nedeljom odložiš sve ob… https:\/\/t.co\/aTdoUhFOFU","value":3},{"meta":"@pirat_mae, Cacnuli su Mustafi zivac, sve ce gi potepa\n#SenkeNadBalkanom","value":3},{"meta":"@soljinac, Biće krvi ovde, tek. #SenkeNadBalkanom","value":3},{"meta":"@NTanackovic94, Ognjen Radivojevic opet pokidao s pesmom kao u Jagodicima... #SenkeNadBalkanom","value":3},{"meta":"@AnadjurSamJa, RT @GdjicaDalovej: Ove agente kao da je Gašić postavio, toliko su profi, gotovo nevidljivi. #samokažem #SenkeNadBalkanom","value":3},{"meta":"@zokibb, Ode glava dok kažeš sex...\n#SenkeNadBalkanom","value":3},{"meta":"@PolovniBunt, Bjela pobi sve dobre ribe u #SenkeNadBalkanom 😊","value":3},{"meta":"@djpetarmarko, #SenkeNadBalkanom i ovaj Bogdan je fenomenalan","value":3},{"meta":"@blesa_blesica, #SenkeNadBalkanom \nUbiše i Kristu.\nPa mamu vam jebem!!","value":3},{"meta":"@Padaviar2, Ubice moga oca, Meso, Senke nad Balkanom, Nemanjići...al nas je krenulo.","value":3},{"meta":"@marcomilic, Glava po epizodi. #SenkeNadBalkanom","value":3},{"meta":"@Fredy_the_house, Šta su senke nad balkanom?","value":3},{"meta":"@nenad_d1977, utepaše ovu jer ne zna da glumi. #SenkeNadBalkanom","value":3},{"meta":"@GdjicaDalovej, Ove agente kao da je Gašić postavio, toliko su profi, gotovo nevidljivi. #samokažem #SenkeNadBalkanom","value":3},{"meta":"@PrincOdKrcagova, -Princ je lud.\n-Ali, nije glup.\n#SenkeNadBalkanom","value":3},{"meta":"@DuhHodidjeda, Чекај у материну, откуд Кичић са Аустријанцима?\n #senkenadbalkanom","value":3},{"meta":"@Ujka_Carli, Saću se napijem uz ovu:\n\n\"O divnaaaa,o divna,noci besanaaaaa...\"\n\n#SenkeNadBalkanom","value":3},{"meta":"@BusPuklaBum, Princ je lud. Ali nije glup.\n #SenkeNadBalkanom","value":3},{"meta":"@zokibb, Panduri i kriminalci za istim stolom, samo političari fale, pa da bude k'o i sad... #SenkeNadBalkanom","value":3},{"meta":"@marcomilic, Svaka epizoda navede na novo saznanje. #SenkeNadBalkanom","value":3},{"meta":"@nenad_d1977, RT @GdjicaDalovej: Milos Samolov zaslužuje bar jedan tvit. ❤\n\n#SenkeNadBalkanom","value":3},{"meta":"@ovcaCrna, Ozbiljan hit za razbijanje kafane #SenkeNadBalkanom","value":3},{"meta":"@GdjicaDalovej, Milos Samolov zaslužuje bar jedan tvit. ❤\n\n#SenkeNadBalkanom","value":3},{"meta":"@upravnikkk, Mustafa Golubić je bio JAK LIK #SenkeNadBalkanom moraću da pročitam knjigu o njemu, jebote a imam popis, fuck","value":3},{"meta":"@pavlovic9, #SenkeNadBalkanom vrh.... Sad ce Krojac na Kaludjera...\nBravo @Dejan018","value":3},{"meta":"@NataaPoli, Moglo bi se uz ovu pesmu u kafani. #SenkenadBalkanom","value":3},{"meta":"@Dissidente__, Odlično izvođenje pesme Ogija Radivojevića - Divna u seriji #SenkeNadBalkanom","value":3},{"meta":"@chupelenge, Покољу се па пију заједно, Српска посла ;)\n#SenkeNadBalkanom","value":3},{"meta":"@SasaDj70, #SenkeNadBalkanom  moćna serija!💪👍","value":3},{"meta":"@MladenAleksic85, Pa cekaj, ko je na slici??  #SenkeNadBalkanom","value":3},{"meta":"@dezareo, \"Rakija nikog na put nije izvela\" natpis u kafani u Jatagan Mali #SenkeNadBalkanom :)","value":3},{"meta":"@DLavonja, Kad smo ti i ja imali problem? \nTi i ja, nikad! #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, Op evo i nastavka Divne noci... milina\n#SenkeNadBalkanom","value":3},{"meta":"@Solisio, Rakija nikog na put nije izvela.\nkultno. #SenkeNadBalkanom","value":3},{"meta":"@svetislavtisa, наравно, говоримо о овој коју пјевају Пејаковић и Мањифико, не Огијева верзија #SenkeNadBalkanom","value":3},{"meta":"@Pesakudusi, Ma kakvi Sebastijan Kavaca i Goran Bogdan, ubedljivo najbolji frajer u seriji \"Senke nad Balkanom\" je Milos Timotij… https:\/\/t.co\/NkROPVjXfN","value":3},{"meta":"@nidjevez_e, I svake nedjelje isto. Kicic je i ovakav i onakav, Bogdan isto, Bergamovu ne vole  žene, ali oko sljedećih tipova s… https:\/\/t.co\/ztQLZeWb0T","value":3},{"meta":"@TicaJevtic, A gde bi se najvaznija pitanja resavala nego u kafani #SenkeNadBalkanom","value":3},{"meta":"@Pinguletina, Inače najbolje mesto za sakriti Koplje sudbine je definitivno Smederevac #SenkeNadBalkanom","value":3},{"meta":"@GdjicaDalovej, Komunistički agent kao mirotvorac pa ljubav 😁\n\n#SenkeNadBalkanom","value":3},{"meta":"@Dissidente__, Ruke k sebi da ja red ne zavodim #SenkeNadBalkanom","value":3},{"meta":"@rastko_lakeshow, Rakija nikog na put nije izvela. #SenkeNadBalkanom","value":3},{"meta":"@saksija3, RT @Zovem_se_Ines: Rakija nikog na put nije izvela #SenkeNadBalkanom","value":3},{"meta":"@MirjanaIvanovna, #SenkeNadBalkanom Zarko Lausevic =ljubav","value":3},{"meta":"@ZvezdaskoSrce, \"Rakija nikog na put nije izvela\"\nDela, Boga ti...\n#SenkeNadBalkanom","value":3},{"meta":"@lanaks, \"Tajne same dolaze da budu otkrivene!\" \n#senkenadbalkanom","value":3},{"meta":"@allfama, Kad su najbolji komadi u #SenkeNadBalkanom Slovenac, Makedonac i Hrvat, ergo, vraćajte nam Jugoslaviju!","value":3},{"meta":"@NTanackovic94, Nikad od Avakumovica Tula #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, E moj Tane sto si bio covek dok nisi pio...\n#SenkeNadBalkanom","value":3},{"meta":"@BusPuklaBum, Golubić i Krojač su mi baš strava kombinacija, mogla bih stalno zajedno da ih gledam \n#SenkeNadBalkanom","value":3},{"meta":"@lanaks, \"Imamo li još neke tajne koje treba da otkrijemo?\" \n\n#senkenadbalkanom","value":3},{"meta":"@dobrila_m, Ovo samo Bjela moze da uradi - okupi takvu ekipu glumaca I napravi pricu od koje se dugo, dugo oporavljas!… https:\/\/t.co\/owfTPciPsM","value":3},{"meta":"@posrnulaLady, RT @Svemirdonac: Zarku Lausevicu dovoljno bukvalno jedna scena da izdominira i pokaze ko je najbolji glumac na Balkanu.  #SenkeNadBalkanom","value":3},{"meta":"@pirat_mae, RT @Zovem_se_Ines: Rakija nikog na put nije izvela #SenkeNadBalkanom","value":3}
  ]
  ]
}, {
  low: 0,
  high: 8,
  fullWidth: true,
  axisX: {
    showLabel: false,
    showGrid: false,
    offset: 0
  },
  axisY: {
    showLabel: false,
    showGrid: false,
    offset: 0
  },
  plugins: [
    Chartist.plugins.tooltip()
      ]
});

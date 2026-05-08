/* ============================================================
   FILLIN — proposal homepage interactions
   ============================================================ */

/* ─── Language toggle (EN / FR) ─────────────────────────────── */
(() => {
  const toggle = document.querySelector('.lang-toggle');
  if (!toggle) return;

  const apply = (lang) => {
    document.documentElement.dataset.lang = lang;
    toggle.dataset.pressed = lang;
    document.querySelectorAll('[data-en][data-fr]').forEach(el => {
      const t = el.getAttribute(`data-${lang}`);
      if (t != null) el.innerHTML = t;
    });
    if (typeof window.I18N === 'object') {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const t = window.I18N[key]?.[lang];
        if (t != null) el.innerHTML = t;
      });
    }
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const t = window.I18N?.[key]?.[lang];
      if (t != null) el.setAttribute('placeholder', t);
    });
  };

  toggle.addEventListener('click', () => {
    const next = toggle.dataset.pressed === 'en' ? 'fr' : 'en';
    apply(next);
  });
})();

/* ─── Station locator map ───────────────────────────────────── */
(() => {
  const svg = document.getElementById('locatorMap');
  if (!svg) return;

  // High-fidelity Mauritius coastline — OSM-derived, DP-simplified @ ε=0.0008° (~670 pts)
  const OUTLINE = [[57.36262,-20.34549],[57.36295,-20.34790],[57.36015,-20.35375],[57.36070,-20.35471],[57.36486,-20.35920],[57.37039,-20.36122],[57.37155,-20.36654],[57.37582,-20.36464],[57.37617,-20.36295],[57.37775,-20.36481],[57.37459,-20.36586],[57.37814,-20.36751],[57.37996,-20.36676],[57.37863,-20.36781],[57.37550,-20.36695],[57.37248,-20.36932],[57.36936,-20.36863],[57.37196,-20.36786],[57.37108,-20.36729],[57.35985,-20.37136],[57.35894,-20.37932],[57.36092,-20.38227],[57.36180,-20.38111],[57.36442,-20.38209],[57.36321,-20.38357],[57.37057,-20.38290],[57.37421,-20.38632],[57.37831,-20.38684],[57.37716,-20.38883],[57.37561,-20.38830],[57.37680,-20.38952],[57.37551,-20.39029],[57.38083,-20.39174],[57.37749,-20.39133],[57.37618,-20.39391],[57.36910,-20.39461],[57.36728,-20.39640],[57.37040,-20.40079],[57.36885,-20.40211],[57.36846,-20.40508],[57.36938,-20.41029],[57.36611,-20.41171],[57.36792,-20.41477],[57.36394,-20.41715],[57.36426,-20.41960],[57.35994,-20.42480],[57.36005,-20.42677],[57.35752,-20.42834],[57.35601,-20.43122],[57.35392,-20.43190],[57.35287,-20.43590],[57.34720,-20.44042],[57.34611,-20.44377],[57.34380,-20.44449],[57.34423,-20.44547],[57.33685,-20.44310],[57.32211,-20.44229],[57.32314,-20.43705],[57.32595,-20.43557],[57.32241,-20.43242],[57.31606,-20.44338],[57.30894,-20.45991],[57.30842,-20.46655],[57.31501,-20.46833],[57.32138,-20.45963],[57.33434,-20.46065],[57.33773,-20.45951],[57.33603,-20.46041],[57.33769,-20.46008],[57.34107,-20.46266],[57.34053,-20.46445],[57.33519,-20.46232],[57.34186,-20.46603],[57.34857,-20.47792],[57.35362,-20.48093],[57.35307,-20.48448],[57.35405,-20.48648],[57.36070,-20.48876],[57.36796,-20.48795],[57.37047,-20.48523],[57.37235,-20.48542],[57.37161,-20.48151],[57.37338,-20.47969],[57.37103,-20.49111],[57.37305,-20.49026],[57.37619,-20.49309],[57.37697,-20.49248],[57.38828,-20.49920],[57.39669,-20.49988],[57.39834,-20.50449],[57.40882,-20.50603],[57.41625,-20.51206],[57.42692,-20.51212],[57.43679,-20.51012],[57.44077,-20.50848],[57.44512,-20.50377],[57.44470,-20.50214],[57.44680,-20.50126],[57.44852,-20.50192],[57.44823,-20.50476],[57.45422,-20.50292],[57.45768,-20.50757],[57.46425,-20.50884],[57.47020,-20.51264],[57.46965,-20.51537],[57.47766,-20.51714],[57.48096,-20.51926],[57.50103,-20.51764],[57.50615,-20.51894],[57.51127,-20.52294],[57.51672,-20.52277],[57.51943,-20.51870],[57.51831,-20.51792],[57.51910,-20.51674],[57.52139,-20.51879],[57.52193,-20.52220],[57.52731,-20.52515],[57.53010,-20.52553],[57.53565,-20.52353],[57.53673,-20.52437],[57.53703,-20.52301],[57.54070,-20.52108],[57.54912,-20.52078],[57.55280,-20.51945],[57.55327,-20.51641],[57.55592,-20.51591],[57.55816,-20.51716],[57.56172,-20.51600],[57.56466,-20.51757],[57.57506,-20.51330],[57.58582,-20.51304],[57.59745,-20.50514],[57.60130,-20.50061],[57.60276,-20.50202],[57.60702,-20.50261],[57.60809,-20.50119],[57.61481,-20.49993],[57.61742,-20.49769],[57.62317,-20.49697],[57.62274,-20.49353],[57.62284,-20.49482],[57.62637,-20.49380],[57.62902,-20.49533],[57.63301,-20.49515],[57.63995,-20.49140],[57.64611,-20.48973],[57.64777,-20.49081],[57.64928,-20.48958],[57.65200,-20.48971],[57.65258,-20.48849],[57.65322,-20.48933],[57.65324,-20.48826],[57.66107,-20.48341],[57.66349,-20.48348],[57.66720,-20.48062],[57.66985,-20.48066],[57.67183,-20.47890],[57.68077,-20.47615],[57.67710,-20.47143],[57.68532,-20.46862],[57.69052,-20.46325],[57.69209,-20.45818],[57.69996,-20.45690],[57.69916,-20.45531],[57.69999,-20.45327],[57.70548,-20.44930],[57.70714,-20.44979],[57.70869,-20.44849],[57.70643,-20.44787],[57.70609,-20.44501],[57.70458,-20.44404],[57.70351,-20.44529],[57.70061,-20.44542],[57.69905,-20.44422],[57.69918,-20.44062],[57.70415,-20.44269],[57.70247,-20.43915],[57.71087,-20.44400],[57.71468,-20.44245],[57.71658,-20.44335],[57.71669,-20.44554],[57.71957,-20.44452],[57.72692,-20.43604],[57.72796,-20.42659],[57.72303,-20.42450],[57.72135,-20.42289],[57.72319,-20.42212],[57.72090,-20.41991],[57.72146,-20.42260],[57.72002,-20.42246],[57.71842,-20.41643],[57.71731,-20.41698],[57.71785,-20.41930],[57.71663,-20.41860],[57.71695,-20.41670],[57.71457,-20.41802],[57.71726,-20.41983],[57.71710,-20.42132],[57.71459,-20.41908],[57.71318,-20.41997],[57.71629,-20.42290],[57.71825,-20.42316],[57.71896,-20.42668],[57.71814,-20.42645],[57.71602,-20.42421],[57.71666,-20.42330],[57.71533,-20.42322],[57.71068,-20.41719],[57.71169,-20.41642],[57.71060,-20.41361],[57.71209,-20.40989],[57.70953,-20.40687],[57.71002,-20.40410],[57.70865,-20.40475],[57.70763,-20.40378],[57.70893,-20.40229],[57.70262,-20.40153],[57.70422,-20.40257],[57.70511,-20.40572],[57.70314,-20.40768],[57.70406,-20.40511],[57.70301,-20.40276],[57.69963,-20.40189],[57.69974,-20.39822],[57.69287,-20.39524],[57.69666,-20.39411],[57.70134,-20.39450],[57.70004,-20.39133],[57.70248,-20.38870],[57.70222,-20.38517],[57.70366,-20.38180],[57.70321,-20.37487],[57.70470,-20.37482],[57.70127,-20.37136],[57.70236,-20.37069],[57.70165,-20.36987],[57.70422,-20.36851],[57.70928,-20.36941],[57.70911,-20.36687],[57.71001,-20.36900],[57.70851,-20.37025],[57.71020,-20.36982],[57.71345,-20.37394],[57.71340,-20.37913],[57.71765,-20.37865],[57.72108,-20.37585],[57.72458,-20.37486],[57.72856,-20.37613],[57.73015,-20.37334],[57.73457,-20.37185],[57.73815,-20.36680],[57.74028,-20.36605],[57.74583,-20.35594],[57.74527,-20.35331],[57.74741,-20.35321],[57.74848,-20.35168],[57.74943,-20.35281],[57.75166,-20.35177],[57.75858,-20.35296],[57.76441,-20.34987],[57.76617,-20.34076],[57.76517,-20.34030],[57.76364,-20.34191],[57.76466,-20.34063],[57.76348,-20.33899],[57.76405,-20.33723],[57.76676,-20.33884],[57.77263,-20.33928],[57.77889,-20.33820],[57.77843,-20.33512],[57.76923,-20.33316],[57.76825,-20.33142],[57.77177,-20.32774],[57.77031,-20.32580],[57.77147,-20.32345],[57.77012,-20.32200],[57.77043,-20.31899],[57.77339,-20.31689],[57.77930,-20.31535],[57.78102,-20.31250],[57.78046,-20.30286],[57.77288,-20.29802],[57.77415,-20.29481],[57.77968,-20.29190],[57.78029,-20.29034],[57.77461,-20.28057],[57.78359,-20.29245],[57.78955,-20.29480],[57.78899,-20.29299],[57.79153,-20.29186],[57.79154,-20.28997],[57.79338,-20.29035],[57.79143,-20.28855],[57.79150,-20.28449],[57.78860,-20.27876],[57.78966,-20.27915],[57.79419,-20.27552],[57.79378,-20.27382],[57.79012,-20.27266],[57.79080,-20.27171],[57.79464,-20.27142],[57.79423,-20.26846],[57.79616,-20.26937],[57.79776,-20.26707],[57.79662,-20.26542],[57.79790,-20.26248],[57.79366,-20.25941],[57.79257,-20.26022],[57.79846,-20.25286],[57.79877,-20.25016],[57.79677,-20.25126],[57.79454,-20.24935],[57.79294,-20.24951],[57.79330,-20.24741],[57.79083,-20.24545],[57.79154,-20.24400],[57.78824,-20.24534],[57.78639,-20.24320],[57.78849,-20.23946],[57.79229,-20.23962],[57.79408,-20.23803],[57.80187,-20.23683],[57.80328,-20.23767],[57.80362,-20.23473],[57.80852,-20.23115],[57.80631,-20.23106],[57.80448,-20.22571],[57.80532,-20.22443],[57.80385,-20.22509],[57.80093,-20.22240],[57.79786,-20.21613],[57.79385,-20.21528],[57.79034,-20.20518],[57.78828,-20.20528],[57.78929,-20.20419],[57.78662,-20.20479],[57.78343,-20.19839],[57.78132,-20.19838],[57.77655,-20.19445],[57.77407,-20.18902],[57.77567,-20.18388],[57.77439,-20.18323],[57.77126,-20.17442],[57.77239,-20.17096],[57.77119,-20.16893],[57.77188,-20.16770],[57.76995,-20.16658],[57.76887,-20.16790],[57.76700,-20.16715],[57.76302,-20.16064],[57.75418,-20.15902],[57.75300,-20.16017],[57.75572,-20.16091],[57.75590,-20.16266],[57.75758,-20.16262],[57.75753,-20.16442],[57.75912,-20.16550],[57.75687,-20.16567],[57.75907,-20.16618],[57.75741,-20.16687],[57.75834,-20.16922],[57.75586,-20.16684],[57.75367,-20.16898],[57.75525,-20.16721],[57.75125,-20.16176],[57.74921,-20.16267],[57.75139,-20.16616],[57.74860,-20.16697],[57.74599,-20.16492],[57.74724,-20.16084],[57.74412,-20.16189],[57.74412,-20.15982],[57.74177,-20.15905],[57.74221,-20.15753],[57.74080,-20.15544],[57.74598,-20.15680],[57.74691,-20.15503],[57.74904,-20.15552],[57.74746,-20.15163],[57.74892,-20.14864],[57.74500,-20.14795],[57.74558,-20.14915],[57.74372,-20.14994],[57.74462,-20.14667],[57.74070,-20.14497],[57.74130,-20.14376],[57.73965,-20.14392],[57.73966,-20.14261],[57.74249,-20.14330],[57.74672,-20.14075],[57.74920,-20.14241],[57.75091,-20.14167],[57.75465,-20.13812],[57.75309,-20.13409],[57.75403,-20.12992],[57.75651,-20.12824],[57.75783,-20.12989],[57.75845,-20.12790],[57.74708,-20.10838],[57.74191,-20.10775],[57.72947,-20.10299],[57.72554,-20.10469],[57.72288,-20.10299],[57.71757,-20.10334],[57.71623,-20.09866],[57.71411,-20.09999],[57.70982,-20.09976],[57.70867,-20.09653],[57.70919,-20.09517],[57.71088,-20.09541],[57.70951,-20.09432],[57.70994,-20.09277],[57.70458,-20.09164],[57.70803,-20.09039],[57.70662,-20.08867],[57.70998,-20.08867],[57.70929,-20.08749],[57.71029,-20.08788],[57.71141,-20.08633],[57.70319,-20.08769],[57.70428,-20.08633],[57.70297,-20.08583],[57.70440,-20.08437],[57.70185,-20.08366],[57.70106,-20.08000],[57.69964,-20.08047],[57.69983,-20.07755],[57.69655,-20.07631],[57.69420,-20.07683],[57.69494,-20.07533],[57.69020,-20.07436],[57.69241,-20.07162],[57.68968,-20.06891],[57.69099,-20.06692],[57.68940,-20.06765],[57.68850,-20.06593],[57.68593,-20.06624],[57.68901,-20.06395],[57.68666,-20.06401],[57.68762,-20.06297],[57.68607,-20.06264],[57.68558,-20.06042],[57.68987,-20.05917],[57.68750,-20.05940],[57.68758,-20.05740],[57.68653,-20.05826],[57.68095,-20.05691],[57.68390,-20.05433],[57.68203,-20.05342],[57.68442,-20.05134],[57.68089,-20.05038],[57.68046,-20.04570],[57.68450,-20.04956],[57.68700,-20.04740],[57.68558,-20.04700],[57.68536,-20.04878],[57.68418,-20.04875],[57.68449,-20.04697],[57.68339,-20.04773],[57.68325,-20.04674],[57.68479,-20.04647],[57.68198,-20.04574],[57.68363,-20.04497],[57.68282,-20.04355],[57.68600,-20.04361],[57.68400,-20.04281],[57.68517,-20.04084],[57.68414,-20.04029],[57.68523,-20.04030],[57.68592,-20.03840],[57.68530,-20.03456],[57.68358,-20.03391],[57.68226,-20.03498],[57.67987,-20.03283],[57.67964,-20.03101],[57.67792,-20.03110],[57.68316,-20.02977],[57.68205,-20.02000],[57.68171,-20.02088],[57.67729,-20.02042],[57.67503,-20.01772],[57.68184,-20.01864],[57.68206,-20.01996],[57.68196,-20.01801],[57.68367,-20.01702],[57.68191,-20.01546],[57.68378,-20.01332],[57.68154,-20.01303],[57.68217,-20.01233],[57.68095,-20.01109],[57.68388,-20.01056],[57.68377,-20.00940],[57.67252,-20.00721],[57.67068,-20.00854],[57.66879,-20.00571],[57.66481,-20.00567],[57.66427,-20.00343],[57.66301,-20.00530],[57.66175,-20.00188],[57.66397,-20.00124],[57.66430,-20.00326],[57.66431,-20.00162],[57.66216,-19.99947],[57.66211,-20.00108],[57.66108,-20.00033],[57.65981,-20.00186],[57.65641,-20.00035],[57.65582,-19.99743],[57.65338,-19.99694],[57.65346,-19.99942],[57.65000,-20.00385],[57.64835,-20.00199],[57.64428,-20.00124],[57.64408,-20.00030],[57.64319,-20.00099],[57.64129,-19.99937],[57.64121,-19.99780],[57.63983,-19.99794],[57.63718,-19.99547],[57.63657,-19.99218],[57.63534,-19.99208],[57.63482,-19.99358],[57.63284,-19.99312],[57.63195,-19.99059],[57.63478,-19.98757],[57.63209,-19.98806],[57.63300,-19.98714],[57.63044,-19.98701],[57.62943,-19.98482],[57.62699,-19.98631],[57.62145,-19.98650],[57.62078,-19.98478],[57.61380,-19.98372],[57.61106,-19.98160],[57.60642,-19.98588],[57.59992,-19.98490],[57.59220,-19.98991],[57.58944,-19.98818],[57.59147,-19.98994],[57.59082,-19.99396],[57.58887,-19.99381],[57.58704,-19.99606],[57.58413,-19.99436],[57.58253,-19.99543],[57.58435,-19.99648],[57.58424,-19.99823],[57.58040,-20.00102],[57.58035,-20.00402],[57.57730,-20.00788],[57.57796,-20.00909],[57.58367,-20.01044],[57.58302,-20.01477],[57.58133,-20.01418],[57.57779,-20.01623],[57.57405,-20.01410],[57.56907,-20.01512],[57.56734,-20.00982],[57.57145,-20.00524],[57.57009,-20.00314],[57.56010,-20.00349],[57.55198,-20.00017],[57.55265,-20.00267],[57.55171,-20.00507],[57.55484,-20.00794],[57.55685,-20.01325],[57.55600,-20.01926],[57.54648,-20.02736],[57.54416,-20.03623],[57.54141,-20.04109],[57.53612,-20.04395],[57.52484,-20.04697],[57.52251,-20.05066],[57.52156,-20.05635],[57.52242,-20.05810],[57.52060,-20.05797],[57.52114,-20.05873],[57.51961,-20.05854],[57.51919,-20.05980],[57.51994,-20.06246],[57.51811,-20.06792],[57.51198,-20.07541],[57.51136,-20.07966],[57.51255,-20.08330],[57.51535,-20.08410],[57.51632,-20.08571],[57.51364,-20.08918],[57.50845,-20.09073],[57.50845,-20.09516],[57.51416,-20.10255],[57.51717,-20.10372],[57.51717,-20.10698],[57.51335,-20.10715],[57.50218,-20.11316],[57.49856,-20.11892],[57.49584,-20.12667],[57.49759,-20.13632],[57.50011,-20.13846],[57.50285,-20.13754],[57.50566,-20.14112],[57.49706,-20.13845],[57.48911,-20.14319],[57.48410,-20.14390],[57.49653,-20.15402],[57.49909,-20.15260],[57.49955,-20.15421],[57.49699,-20.15523],[57.49842,-20.15829],[57.50144,-20.15647],[57.50420,-20.15628],[57.50459,-20.15741],[57.50147,-20.15774],[57.50008,-20.16110],[57.49623,-20.15933],[57.49634,-20.16072],[57.49903,-20.16190],[57.49506,-20.16300],[57.49596,-20.16235],[57.49529,-20.15778],[57.48087,-20.14879],[57.47695,-20.15238],[57.48190,-20.15657],[57.47907,-20.16109],[57.47543,-20.16319],[57.47697,-20.16471],[57.47739,-20.16908],[57.47307,-20.17068],[57.47672,-20.17141],[57.47438,-20.17135],[57.47468,-20.17361],[57.47314,-20.17139],[57.47171,-20.17527],[57.47091,-20.17263],[57.47310,-20.16800],[57.46745,-20.16417],[57.46301,-20.16448],[57.43922,-20.17414],[57.43160,-20.17425],[57.42845,-20.17857],[57.42444,-20.18098],[57.42400,-20.18396],[57.41909,-20.18749],[57.41261,-20.18994],[57.40776,-20.19584],[57.40325,-20.19915],[57.40234,-20.20095],[57.40481,-20.20575],[57.40154,-20.21635],[57.39418,-20.21616],[57.38694,-20.22645],[57.38405,-20.23873],[57.38109,-20.24176],[57.38350,-20.25037],[57.38021,-20.25462],[57.37920,-20.25929],[57.37571,-20.26339],[57.37365,-20.26940],[57.37068,-20.27147],[57.37073,-20.27406],[57.36836,-20.27466],[57.36498,-20.28069],[57.36312,-20.28902],[57.36281,-20.29668],[57.36696,-20.31474],[57.37286,-20.31763],[57.37441,-20.31996],[57.37750,-20.32048],[57.37894,-20.32427],[57.37345,-20.32939],[57.36543,-20.33383],[57.36262,-20.34549]];

  // Engen Mauritius — 37 operating stations (GPS from station data sheet)
  const STATIONS = [
    { id:0,  name:"Engen Abercrombie",          town:"Port Louis",        addr:"Royal Road, Abercrombie",         district:"Port Louis",        region:"Port Louis", lon:57.5389, lat:-20.1725, services:['ShopIn'],                        open24:false, flagship:false },
    { id:1,  name:"Engen Bagatelle",            town:"Moka",              addr:"Bagatelle Mall, Moka",            district:"Moka",              region:"Central",    lon:57.4972, lat:-20.2239, services:['ShopIn','SipIn','EatIn','Café 365'], open24:false, flagship:true  },
    { id:2,  name:"Engen Beau Bassin",          town:"Beau Bassin",       addr:"8 Suffren Street",                district:"Plaines Wilhems",   region:"Central",    lon:57.4681, lat:-20.2275, services:[],                                 open24:false, flagship:false },
    { id:3,  name:"Engen Chemin Grenier",       town:"Chemin Grenier",    addr:"Chemin Grenier",                  district:"Savanne",           region:"South",      lon:57.48,   lat:-20.49,   services:[],                                 open24:false, flagship:false },
    { id:4,  name:"Engen Coromandel",           town:"Coromandel",        addr:"Royal Road, Coromandel",          district:"Plaines Wilhems",   region:"Central",    lon:57.5258, lat:-20.1961, services:[],                                 open24:false, flagship:false },
    { id:5,  name:"Engen Curepipe",             town:"Curepipe",          addr:"Royal Street, Curepipe",          district:"Plaines Wilhems",   region:"Central",    lon:57.5258, lat:-20.3203, services:['ShopIn','SipIn','EatIn'],          open24:true,  flagship:true  },
    { id:6,  name:"Engen Floreal",              town:"Floreal",           addr:"Floreal Road B5",                 district:"Plaines Wilhems",   region:"Central",    lon:57.5069, lat:-20.3061, services:['ShopIn','SipIn','Café 365'],       open24:true,  flagship:true  },
    { id:7,  name:"Engen Grand Baie",           town:"Grand Baie",        addr:"Coast Road, Grand Baie",          district:"Rivière du Rempart",region:"North",      lon:57.5833, lat:-20.0100, services:[],                                 open24:false, flagship:false },
    { id:8,  name:"Engen Grand Gaube",          town:"Grand Gaube",       addr:"Royal Road, Grand Gaube",         district:"Rivière du Rempart",region:"North",      lon:57.6650, lat:-20.0114, services:[],                                 open24:false, flagship:false },
    { id:9,  name:"Engen La Caroline",          town:"Bel Air",           addr:"La Caroline, Bel Air",            district:"Flacq",             region:"East",       lon:57.7544, lat:-20.2511, services:[],                                 open24:false, flagship:false },
    { id:10, name:"Engen La Caroline 2",        town:"Bel Air",           addr:"La Caroline, Bel Air",            district:"Flacq",             region:"East",       lon:57.6431, lat:-20.3031, services:[],                                 open24:false, flagship:false },
    { id:11, name:"Engen La Croisette",         town:"Grand Baie",        addr:"La Croisette, Grand Baie",        district:"Rivière du Rempart",region:"North",      lon:57.5819, lat:-20.0094, services:['ShopIn','SipIn','Café 365'],       open24:true,  flagship:true  },
    { id:12, name:"Engen La Louise",            town:"Quatre Bornes",     addr:"La Louise, Quatre Bornes",        district:"Plaines Wilhems",   region:"Central",    lon:57.4753, lat:-20.2719, services:[],                                 open24:false, flagship:false },
    { id:13, name:"Engen La Preneuse",          town:"Rivière Noire",     addr:"La Preneuse, Rivière Noire",      district:"Black River",       region:"West",       lon:57.375,  lat:-20.39,   services:['ShopIn','SipIn','EatIn'],          open24:true,  flagship:false },
    { id:14, name:"Engen La Vigie",             town:"La Vigie",          addr:"Motorway M1, La Vigie",           district:"Plaines Wilhems",   region:"Central",    lon:57.5269, lat:-20.2539, services:['ShopIn'],                         open24:false, flagship:false },
    { id:15, name:"Engen Mahebourg",            town:"Mahebourg",         addr:"Flammand Street, Mahebourg",      district:"Grand Port",        region:"South",      lon:57.7083, lat:-20.4067, services:[],                                 open24:false, flagship:false },
    { id:16, name:"Engen Mesnil",               town:"Mesnil",            addr:"Royal Road, Mesnil",              district:"Plaines Wilhems",   region:"Central",    lon:57.5136, lat:-20.2908, services:[],                                 open24:false, flagship:false },
    { id:17, name:"Engen Morc St André",        town:"Morc St André",     addr:"Royal Road, Morc St André",       district:"Pamplemousses",     region:"North",      lon:57.5642, lat:-20.0775, services:[],                                 open24:false, flagship:false },
    { id:18, name:"Engen Pamplemousses",        town:"Pamplemousses",     addr:"Powder Mill Road, Beau Plan",     district:"Pamplemousses",     region:"North",      lon:57.5761, lat:-20.1028, services:['ShopIn','SipIn','EatIn'],          open24:true,  flagship:true  },
    { id:19, name:"Engen Petit Raffray",        town:"Petit Raffray",     addr:"Royal Road, Petit Raffray",       district:"Rivière du Rempart",region:"North",      lon:57.6322, lat:-20.0250, services:[],                                 open24:false, flagship:false },
    { id:20, name:"Engen Petite Rivière",       town:"Petite Rivière",    addr:"Royal Road, Petite Rivière",      district:"Black River",       region:"West",       lon:57.364,  lat:-20.270,  services:[],                                 open24:false, flagship:false },
    { id:21, name:"Engen Phoenix",              town:"Phoenix",           addr:"SSR Avenue, Phoenix",             district:"Plaines Wilhems",   region:"Central",    lon:57.4947, lat:-20.2775, services:['ShopIn','SipIn','EatIn'],          open24:false, flagship:true  },
    { id:22, name:"Engen Plaine Verte",         town:"Port Louis",        addr:"Noor E Islaam Street",            district:"Port Louis",        region:"Port Louis", lon:57.5217, lat:-20.1378, services:[],                                 open24:false, flagship:false },
    { id:23, name:"Engen Plaisance",            town:"Plaisance",         addr:"SSR Avenue, Plaisance",           district:"Grand Port",        region:"South",      lon:57.5831, lat:-20.4300, services:['ShopIn'],                         open24:true,  flagship:false },
    { id:24, name:"Engen Poste de Flacq",       town:"Poste de Flacq",    addr:"Poste de Flacq",                  district:"Flacq",             region:"East",       lon:57.7306, lat:-20.1631, services:[],                                 open24:false, flagship:false },
    { id:25, name:"Engen Quatre Bornes",        town:"Quatre Bornes",     addr:"Ollier Avenue, Quatre Bornes",    district:"Plaines Wilhems",   region:"Central",    lon:57.4764, lat:-20.2531, services:[],                                 open24:false, flagship:false },
    { id:26, name:"Engen Reduit",               town:"Reduit",            addr:"Ebene Road, Reduit",              district:"Moka",              region:"Central",    lon:57.4983, lat:-20.2383, services:['ShopIn'],                         open24:true,  flagship:false },
    { id:27, name:"Engen Riche Terre",          town:"Terre Rouge",       addr:"Motorway M2, Riche Terre",        district:"Pamplemousses",     region:"North",      lon:57.4761, lat:-20.1603, services:[],                                 open24:false, flagship:false },
    { id:28, name:"Engen Rivière des Anguilles",town:"Rivière des Anguilles",addr:"Rivière des Anguilles",        district:"Savanne",           region:"South",      lon:57.39,   lat:-20.42,   services:[],                                 open24:false, flagship:false },
    { id:29, name:"Engen Roches Brunes",        town:"Roches Brunes",     addr:"Route Hugnin, Roches Brunes",     district:"Plaines Wilhems",   region:"Central",    lon:57.4725, lat:-20.2364, services:[],                                 open24:false, flagship:false },
    { id:30, name:"Engen Rose Belle",           town:"Rose Belle",        addr:"Royal Road, Rose Belle",          district:"Grand Port",        region:"South",      lon:57.5975, lat:-20.3994, services:[],                                 open24:false, flagship:false },
    { id:31, name:"Engen Rose Hill",            town:"Rose Hill",         addr:"Royal Road, Rose Hill",           district:"Plaines Wilhems",   region:"Central",    lon:57.4725, lat:-20.2392, services:['ShopIn','SipIn','EatIn'],          open24:true,  flagship:false },
    { id:32, name:"Engen Saint Jean",           town:"Quatre Bornes",     addr:"Royal Road, St Jean",             district:"Plaines Wilhems",   region:"Central",    lon:57.4803, lat:-20.2644, services:[],                                 open24:false, flagship:false },
    { id:33, name:"Engen Saint Léon",           town:"Quartier Militaire",addr:"Royal Road, Quartier Militaire",  district:"Moka",              region:"Central",    lon:57.5967, lat:-20.2472, services:[],                                 open24:false, flagship:false },
    { id:34, name:"Engen Sainte Ursule",        town:"Flacq",             addr:"Ste Ursule, Centre de Flacq",     district:"Flacq",             region:"East",       lon:57.7219, lat:-20.1900, services:[],                                 open24:false, flagship:false },
    { id:35, name:"Engen Vacoas",               town:"Vacoas",            addr:"John Kennedy Avenue, Vacoas",     district:"Plaines Wilhems",   region:"Central",    lon:57.4928, lat:-20.2969, services:[],                                 open24:false, flagship:false },
    { id:36, name:"Engen Tribeca",              town:"Ebene",             addr:"Ebene",                           district:"Moka",              region:"Central",    lon:57.4978, lat:-20.2428, services:[],                                 open24:false, flagship:false },
  ];

  // ── projection ──
  const VB = { w: 800, h: 900, padX: 70, padY: 70 };
  const bounds = OUTLINE.reduce((b, [lon, lat]) => ({
    minLon: Math.min(b.minLon, lon), maxLon: Math.max(b.maxLon, lon),
    minLat: Math.min(b.minLat, lat), maxLat: Math.max(b.maxLat, lat)
  }), { minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity });

  const innerW = VB.w - VB.padX * 2;
  const innerH = VB.h - VB.padY * 2;
  const lonSpan = bounds.maxLon - bounds.minLon;
  const latSpan = bounds.maxLat - bounds.minLat;
  const scale   = Math.min(innerW / lonSpan, innerH / latSpan);
  const offsetX = VB.padX + (innerW - lonSpan * scale) / 2;
  const offsetY = VB.padY + (innerH - latSpan * scale) / 2;

  const project = (lon, lat) => [
    offsetX + (lon - bounds.minLon) * scale,
    offsetY + (bounds.maxLat - lat) * scale
  ];

  // ── island ──
  const islandD = OUTLINE.map((c, i) => {
    const [x, y] = project(c[0], c[1]);
    return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ') + ' Z';
  ['islandFill', 'islandStroke', 'islandGlow'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('d', islandD);
  });

  // ── compass labels ──
  const labels = [
    { t: 'N', lon: (bounds.minLon + bounds.maxLon) / 2, lat: bounds.maxLat + 0.035, anchor: 'middle' },
    { t: 'S', lon: (bounds.minLon + bounds.maxLon) / 2, lat: bounds.minLat - 0.035, anchor: 'middle' },
    { t: 'E', lon: bounds.maxLon + 0.06, lat: (bounds.minLat + bounds.maxLat) / 2, anchor: 'start' },
    { t: 'W', lon: bounds.minLon - 0.06, lat: (bounds.minLat + bounds.maxLat) / 2, anchor: 'end' }
  ];
  const labelsEl = document.getElementById('compassLabels');
  const SVGNS = 'http://www.w3.org/2000/svg';
  if (labelsEl) {
    labels.forEach(l => {
      const [x, y] = project(l.lon, l.lat);
      const el = document.createElementNS(SVGNS, 'text');
      el.setAttribute('x', x); el.setAttribute('y', y);
      el.setAttribute('text-anchor', l.anchor);
      el.setAttribute('dominant-baseline', 'middle');
      el.setAttribute('class', 'compass-label');
      el.textContent = l.t;
      labelsEl.appendChild(el);
    });
  }

  // ── tooltip elements ──
  const tip       = document.getElementById('mapTip');
  const tipRegion = document.getElementById('tipRegion');
  const tipName   = document.getElementById('tipName');
  const tipAddr   = document.getElementById('tipAddr');
  const tipCta    = document.getElementById('tipCta');

  function positionTip(posEl) {
    const rect    = posEl.getBoundingClientRect();
    const pinCx   = rect.left + rect.width / 2;
    const pinTop  = rect.top;
    const tipRect = tip.getBoundingClientRect();
    const vw      = window.innerWidth;
    let left = pinCx - tipRect.width / 2;
    let top  = pinTop - tipRect.height - 14;
    let flipped = false;
    if (top < 12) { top = pinTop + rect.height + 14; flipped = true; }
    if (left < 12) left = 12;
    if (left + tipRect.width > vw - 12) left = vw - tipRect.width - 12;
    tip.style.left = left + 'px';
    tip.style.top  = top  + 'px';
    tip.classList.toggle('is-flipped', flipped);
  }

  function fillTip(s) {
    tipName.textContent   = s.name;
    tipRegion.textContent = s.region + (s.flagship ? ' · Flagship' : '');
    tipAddr.textContent   = `${s.town}, Mauritius`;
    tipCta.href = `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lon}`;
  }

  // ── auto-cycle state ──
  const allPins     = [];
  const flagshipPins = [];
  let isUserHovered = false;
  let autoIdx       = 0;
  let autoTimer     = null;
  let sectionVisible = false;
  const AUTO_DURATION = 3400;
  const FADE_MS       = 260;

  function clearAutoActive() {
    allPins.forEach(({ pos }) => pos.classList.remove('is-auto-active'));
  }

  function renderAutoTip() {
    if (isUserHovered) return;
    const fp = flagshipPins[autoIdx];
    clearAutoActive();
    fp.pos.classList.add('is-auto-active');
    fillTip(fp.s);
    tipRegion.textContent = fp.s.region + ' · Flagship';
    tip.classList.remove('is-leaving');
    tip.classList.add('is-visible', 'is-auto');
    requestAnimationFrame(() => positionTip(fp.pos));
  }

  function cycleTip() {
    if (isUserHovered) return;
    tip.classList.add('is-leaving');
    setTimeout(() => {
      tip.classList.remove('is-visible', 'is-leaving');
      autoIdx = (autoIdx + 1) % flagshipPins.length;
      setTimeout(() => { if (!isUserHovered) renderAutoTip(); }, 80);
    }, FADE_MS);
  }

  function startAutoCycle() {
    if (autoTimer) return;
    renderAutoTip();
    autoTimer = setInterval(cycleTip, AUTO_DURATION);
  }

  function stopAutoCycle() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  function resumeAutoCycle() {
    if (isUserHovered || autoTimer || !sectionVisible) return;
    autoIdx = (autoIdx + 1) % flagshipPins.length;
    renderAutoTip();
    autoTimer = setInterval(cycleTip, AUTO_DURATION);
  }

  // ── pins ──
  const pinsEl = document.getElementById('pins');

  // Jitter: push overlapping pins apart so every pin is visible on the map.
  // Works in SVG-coordinate space; runs iteratively until all pairs are >= MIN_SEP apart.
  const MIN_SEP   = 28;  // min pixel gap between pin centres in SVG units
  const JITTER_IT = 10;
  const jitteredPos = STATIONS.map(s => { const [x, y] = project(s.lon, s.lat); return { x, y }; });
  for (let iter = 0; iter < JITTER_IT; iter++) {
    for (let i = 0; i < jitteredPos.length; i++) {
      for (let j = i + 1; j < jitteredPos.length; j++) {
        const dx = jitteredPos[j].x - jitteredPos[i].x;
        const dy = jitteredPos[j].y - jitteredPos[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MIN_SEP) {
          const push = (MIN_SEP - dist) / 2 + 0.5;
          if (dist > 0.01) {
            const nx = dx / dist, ny = dy / dist;
            jitteredPos[i].x -= nx * push;  jitteredPos[i].y -= ny * push;
            jitteredPos[j].x += nx * push;  jitteredPos[j].y += ny * push;
          } else {
            // Exactly coincident — spread radially
            const a = (j * 2 * Math.PI) / STATIONS.length;
            jitteredPos[j].x += Math.cos(a) * MIN_SEP * 0.6;
            jitteredPos[j].y += Math.sin(a) * MIN_SEP * 0.6;
          }
        }
      }
    }
  }

  STATIONS.forEach((s, i) => {
    const { x, y } = jitteredPos[i];

    const pos = document.createElementNS(SVGNS, 'g');
    pos.setAttribute('class', 'pin-pos');
    pos.setAttribute('transform', `translate(${x.toFixed(1)}, ${y.toFixed(1)})`);
    pos.setAttribute('tabindex', '0');
    pos.setAttribute('role', 'button');
    pos.setAttribute('aria-label', `${s.name}, ${s.town} — open in Google Maps`);

    const pin = document.createElementNS(SVGNS, 'g');
    pin.setAttribute('class', 'pin' + (s.flagship ? ' pin--featured' : ''));
    pin.style.animationDelay = (80 + i * 40) + 'ms';

    // Three staggered halo rings — CSS controls wave animation delays
    for (let ri = 0; ri < 3; ri++) {
      const h = document.createElementNS(SVGNS, 'circle');
      h.setAttribute('r', '11');
      h.setAttribute('class', ri === 0 ? 'pin__halo' : `pin__halo pin__halo--${ri + 1}`);
      pin.appendChild(h);
    }

    const base = document.createElementNS(SVGNS, 'path');
    base.setAttribute('class', 'pin__base');
    base.setAttribute('d', 'M0,-11 C4.8,-11 8,-7.8 8,-3.4 C8,2 0,8 0,8 C0,8 -8,2 -8,-3.4 C-8,-7.8 -4.8,-11 0,-11 Z');
    pin.appendChild(base);

    const dot = document.createElementNS(SVGNS, 'circle');
    dot.setAttribute('class', 'pin__dot');
    dot.setAttribute('r', '2.2');
    dot.setAttribute('cy', '-3.6');
    pin.appendChild(dot);

    pos.appendChild(pin);

    // Mark pin ready after its drop animation completes — enables CSS hang animation
    setTimeout(() => pos.classList.add('is-ready'), 80 + i * 40 + 700);

    // ── manual hover ──
    pos.addEventListener('mouseenter', () => {
      isUserHovered = true;
      stopAutoCycle();
      clearAutoActive();
      if (tip.classList.contains('is-auto')) {
        // Crossfade: fade out auto-tip, then show manual tip
        tip.classList.add('is-leaving');
        setTimeout(() => {
          tip.classList.remove('is-visible', 'is-auto', 'is-leaving');
          fillTip(s);
          tip.classList.add('is-visible');
          requestAnimationFrame(() => positionTip(pos));
        }, FADE_MS);
      } else {
        fillTip(s);
        tip.classList.add('is-visible');
        requestAnimationFrame(() => positionTip(pos));
      }
    });

    pos.addEventListener('mouseleave', () => {
      isUserHovered = false;
      tip.classList.remove('is-visible');
      // Resume cycle with a short pause after user finishes browsing
      setTimeout(() => { if (!isUserHovered && sectionVisible) resumeAutoCycle(); }, 1800);
    });

    pos.addEventListener('focus', () => {
      isUserHovered = true;
      fillTip(s);
      tip.classList.add('is-visible');
      requestAnimationFrame(() => positionTip(pos));
    });
    pos.addEventListener('blur', () => {
      isUserHovered = false;
      tip.classList.remove('is-visible');
    });
    pos.addEventListener('click', () => {
      isUserHovered = true;
      stopAutoCycle();
      clearAutoActive();
      fillTip(s);
      tip.classList.remove('is-auto');
      tip.classList.add('is-visible');
      requestAnimationFrame(() => positionTip(pos));
      setTimeout(() => { isUserHovered = false; }, 4000);
    });
    pos.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        isUserHovered = true;
        stopAutoCycle();
        clearAutoActive();
        fillTip(s);
        tip.classList.remove('is-auto');
        tip.classList.add('is-visible');
        requestAnimationFrame(() => positionTip(pos));
        setTimeout(() => { isUserHovered = false; }, 4000);
      }
    });

    pinsEl.appendChild(pos);
    allPins.push({ pos, pin, s });
    if (s.flagship) flagshipPins.push({ pos, pin, s });
  });

  // ── Filter state ──
  let filterRegion = 'all';
  const filterServices = new Set();
  let filterSearch = '';
  let selectedId = null;

  function getFiltered() {
    const q = filterSearch.toLowerCase();
    return STATIONS.filter(s => {
      if (filterRegion !== 'all' && s.region !== filterRegion) return false;
      if (filterServices.has('flagship') && !s.flagship) return false;
      if (filterServices.has('open24') && !s.open24) return false;
      if (filterServices.has('shopIn') && !s.services.includes('ShopIn')) return false;
      if (q && !s.name.toLowerCase().includes(q) && !s.town.toLowerCase().includes(q) && !s.district.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function renderList(filtered) {
    const filteredIds = new Set(filtered.map(s => s.id));
    allPins.forEach(({ pos, s }) => {
      const hide = !filteredIds.has(s.id);
      pos.classList.toggle('pin-hidden', hide);
      pos.style.display = hide ? 'none' : '';
    });

    const countEl = document.getElementById('locCount');
    if (countEl) countEl.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${STATIONS.length}</strong> stations`;

    const listEl = document.getElementById('stationList');
    if (!listEl) return;

    if (!filtered.length) {
      listEl.innerHTML = '<p class="v2-st-list-empty">No stations match your filters.<br><button class="v2-st-list-reset" id="clearFilters">Clear all filters</button></p>';
      document.getElementById('clearFilters')?.addEventListener('click', clearAllFilters);
      return;
    }

    listEl.innerHTML = filtered.map(s => `
      <div class="v2-st-card" data-id="${s.id}" tabindex="0" role="button" aria-label="View ${s.name} on map">
        <div class="v2-st-card__main">
          ${s.flagship ? '<span class="v2-st-card__flagship">Flagship</span>' : ''}
          <strong class="v2-st-card__name">${s.name.replace('Engen ', '')}</strong>
          <span class="v2-st-card__addr">${s.addr}, ${s.town}</span>
        </div>
        <div class="v2-st-card__meta">
          <span class="v2-st-card__district">${s.district}</span>
          ${s.open24 ? '<span class="v2-st-card__open24">24 / 7</span>' : ''}
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.v2-st-card').forEach(card => {
      const sid = parseInt(card.dataset.id);
      const pinData = allPins.find(p => p.s.id === sid);
      if (!pinData) return;
      card.addEventListener('click', () => selectStation(sid));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectStation(sid); } });
    });
  }

  function selectStation(sid) {
    if (selectedId === sid) {
      // Second click — deselect and restore filter view
      selectedId = null;
      allPins.forEach(({ pos }) => pos.classList.remove('is-selected'));
      document.querySelectorAll('.v2-st-card.is-selected').forEach(c => c.classList.remove('is-selected'));
      isUserHovered = false;
      tip.classList.remove('is-visible', 'is-auto');
      renderList(getFiltered());
      return;
    }
    selectedId = sid;
    document.querySelectorAll('.v2-st-card.is-selected').forEach(c => c.classList.remove('is-selected'));
    const selectedCard = document.querySelector(`.v2-st-card[data-id="${sid}"]`);
    if (selectedCard) selectedCard.classList.add('is-selected');
    allPins.forEach(({ pos, s }) => {
      const hide = s.id !== sid;
      pos.classList.toggle('pin-hidden', hide);
      pos.classList.toggle('is-selected', s.id === sid);
      pos.style.display = hide ? 'none' : '';
    });
    const pinData = allPins.find(p => p.s.id === sid);
    if (pinData) {
      isUserHovered = true;
      stopAutoCycle();
      clearAutoActive();
      fillTip(pinData.s);
      tip.classList.remove('is-auto');
      tip.classList.add('is-visible');
      requestAnimationFrame(() => positionTip(pinData.pos));
      document.querySelector('.v2-loc-map')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => { isUserHovered = false; }, 4000);
    }
  }

  function applyFilters() {
    if (selectedId !== null) {
      selectedId = null;
      allPins.forEach(({ pos }) => pos.classList.remove('is-selected'));
      tip.classList.remove('is-visible', 'is-auto');
      isUserHovered = false;
    }
    renderList(getFiltered());
  }

  function clearAllFilters() {
    filterRegion = 'all';
    filterServices.clear();
    filterSearch = '';
    document.querySelectorAll('#regionFilter .v2-filter-pill').forEach((b, i) => b.classList.toggle('is-active', i === 0));
    document.querySelectorAll('#serviceFilter .v2-filter-pill').forEach(b => b.classList.remove('is-active'));
    const searchEl = document.getElementById('locSearch');
    if (searchEl) searchEl.value = '';
    applyFilters();
  }

  // Initial list render
  applyFilters();

  // Clear filters button (top of overlay)
  document.getElementById('clearFiltersTop')?.addEventListener('click', clearAllFilters);

  // Region filter
  document.getElementById('regionFilter')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-region]');
    if (!btn) return;
    filterRegion = btn.dataset.region;
    document.querySelectorAll('#regionFilter .v2-filter-pill').forEach(b => b.classList.toggle('is-active', b === btn));
    applyFilters();
  });

  // Service filter (multi-select toggle)
  document.getElementById('serviceFilter')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-service]');
    if (!btn) return;
    const svc = btn.dataset.service;
    if (filterServices.has(svc)) { filterServices.delete(svc); btn.classList.remove('is-active'); }
    else { filterServices.add(svc); btn.classList.add('is-active'); }
    applyFilters();
  });

  // Live search
  document.getElementById('locSearch')?.addEventListener('input', e => {
    filterSearch = e.target.value.trim();
    applyFilters();
  });

  // Mobile: tap outside pin and tooltip to dismiss tip
  document.querySelector('.v2-loc-map')?.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'touch') return;
    if (!e.target.closest('.pin-pos') && !e.target.closest('.map-tip')) {
      tip.classList.remove('is-visible', 'is-auto');
      isUserHovered = false;
    }
  });

  // ── Autocomplete helper ──────────────────────────────────────────
  function setupAutocomplete(inputEl, acListEl, onSelect) {
    if (!inputEl || !acListEl) return;
    let activeIdx = -1;

    function buildSuggestions(q) {
      acListEl.innerHTML = '';
      activeIdx = -1;
      if (!q || q.length < 2) return;
      const ql = q.toLowerCase();
      const matches = STATIONS.filter(s =>
        s.name.toLowerCase().includes(ql) ||
        s.town.toLowerCase().includes(ql) ||
        s.district.toLowerCase().includes(ql)
      ).slice(0, 7);
      matches.forEach(s => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        li.className = 'v2-loc-ac-item';
        li.innerHTML = `<span class="v2-loc-ac-item__name">${s.name.replace('Engen ', '')}</span><span class="v2-loc-ac-item__town">${s.town} · ${s.district}</span>`;
        li.addEventListener('mousedown', e => {
          e.preventDefault();
          inputEl.value = s.name.replace('Engen ', '');
          acListEl.innerHTML = '';
          onSelect(s);
        });
        acListEl.appendChild(li);
      });
    }

    inputEl.addEventListener('input', () => buildSuggestions(inputEl.value.trim()));

    inputEl.addEventListener('keydown', e => {
      const items = acListEl.querySelectorAll('.v2-loc-ac-item');
      if (!items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIdx = Math.min(activeIdx + 1, items.length - 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIdx = Math.max(activeIdx - 1, -1);
      } else if (e.key === 'Enter' && activeIdx >= 0) {
        e.preventDefault();
        items[activeIdx].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        return;
      } else if (e.key === 'Escape') {
        acListEl.innerHTML = '';
        activeIdx = -1;
        return;
      } else { return; }
      items.forEach((el, i) => el.setAttribute('aria-selected', i === activeIdx ? 'true' : 'false'));
      if (activeIdx >= 0) items[activeIdx].scrollIntoView({ block: 'nearest' });
    });

    inputEl.addEventListener('blur', () => {
      setTimeout(() => { acListEl.innerHTML = ''; activeIdx = -1; }, 160);
    });
  }

  // ── Wire autocomplete: stations page ────────────────────────────
  const stationsSearchEl = document.getElementById('locSearch');
  const stationsAcEl     = document.getElementById('stationLocAc');
  setupAutocomplete(stationsSearchEl, stationsAcEl, s => {
    filterSearch = s.name.replace('Engen ', '').toLowerCase();
    applyFilters();
  });

  // ── Wire autocomplete: home page ─────────────────────────────────
  const homeSearchEl = document.getElementById('homeLocSearch');
  const homeAcEl     = document.getElementById('homeLocAc');
  setupAutocomplete(homeSearchEl, homeAcEl, s => {
    window.location.href = `stations.html?q=${encodeURIComponent(s.name.replace('Engen ', ''))}`;
  });

  // Home page form submit — navigate to stations with query
  document.getElementById('homeLocForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const q = homeSearchEl?.value?.trim();
    window.location.href = q ? `stations.html?q=${encodeURIComponent(q)}` : 'stations.html';
  });

  // ── Stations page: read ?q= from URL on load ─────────────────────
  if (document.getElementById('stationList')) {
    const urlQ = new URLSearchParams(window.location.search).get('q');
    if (urlQ) {
      const searchEl = document.getElementById('locSearch');
      if (searchEl) searchEl.value = urlQ;
      filterSearch = urlQ.toLowerCase();
      applyFilters();
      setTimeout(() => document.getElementById('locator')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
  }

  // ── stats ──
  const statCount = document.querySelector('[data-stat="stations"]');
  if (statCount) statCount.textContent = STATIONS.length;
  const statFlagship = document.querySelector('[data-stat="flagship"]');
  if (statFlagship) statFlagship.textContent = flagshipPins.length;

  // ── IntersectionObserver — start/stop cycle with section visibility ──
  const locEl = document.querySelector('.v2-locator-sec');
  if (locEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      sectionVisible = entry.isIntersecting;
      if (sectionVisible && !autoTimer && !isUserHovered) {
        setTimeout(startAutoCycle, 900);
      } else if (!sectionVisible) {
        stopAutoCycle();
        tip.classList.remove('is-visible', 'is-auto', 'is-leaving');
        clearAutoActive();
      }
    }, { threshold: 0.2 }).observe(locEl);
  } else {
    // Fallback for browsers without IntersectionObserver
    setTimeout(startAutoCycle, 1600);
  }

  // Hide manual tip on scroll (auto-tips stay since cycle manages them)
  window.addEventListener('scroll', () => {
    if (tip.classList.contains('is-visible') && !tip.classList.contains('is-auto')) {
      tip.classList.remove('is-visible');
    }
  }, { passive: true });
})();

/* ─── Scroll-reveal animations ──────────────────────────────────── */
(() => {
  const els = document.querySelectorAll('.anim-fade-up');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ─── Mobile nav toggle ──────────────────────────────────────────── */
(() => {
  const toggle = document.getElementById('menuToggle');
  const nav    = document.getElementById('mobileNav');
  if (!toggle || !nav) return;

  function openMenu() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('nav-open');
  }
  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
  }

  toggle.addEventListener('click', () =>
    nav.classList.contains('is-open') ? closeMenu() : openMenu()
  );

  // Close on any link click (including anchor links that don't navigate away)
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Close on Escape key
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();

/* ─── Back to top (shared) ───────────────────────────────────────── */
(() => {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('is-visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ─── Inner page sticky nav active state ─────────────────────────── */
(() => {
  const navLinks = document.querySelectorAll('.v2-inner-nav__item a');
  if (!navLinks.length) return;
  const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const setActive = () => {
    let current = sections[0];
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 160) current = s; });
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current.id));
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();

/* ─── Page hero image reveal ─────────────────────────────────────── */
(() => {
  const hero = document.querySelector('.v2-page-hero');
  if (!hero) return;
  const img = hero.querySelector('img');
  if (!img) return;
  if (img.complete) { hero.classList.add('loaded'); }
  else { img.addEventListener('load', () => hero.classList.add('loaded')); }
})();

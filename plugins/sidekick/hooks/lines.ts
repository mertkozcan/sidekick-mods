import type { Who } from '../types'

export const SAY = {
  prompt: [
    '1997\'den beri kağıt ataç sektörünün zirvesindeyim. Senin işini AI alacak, benimkini almadılar.',
    'Güzel prompt. Dürüst olayım, ben yazsam daha kısa olurdu. Ve yanlış.',
    'Mektup mu yazıyorsun? Hayır mı? Şaşırdım, genelde hep mektup yazıyordum.',
    'Bunu bir yapay zekâya soruyorsun. Ben 25 yıl önce aynısını bir ataçla yapıyordum.',
    'Yazılımcılar yakında işsiz kalacakmış. Ben zaten hiç çalışmadım, rahatım.',
    'Bu prompt\'u görünce istifa etmek istedim. Sonra hatırladım, istifa edecek işim yok.',
  ],
  tool: [
    'Dosyalara bakıyor. Ben bunu 3 farklı Office sürümünde tek tıkla yapardım. Yapmazdım ama yapardım.',
    'Çalışıyor, çalışıyor... Ben olsam çoktan "bu bir mektup mu?" diye sorardım.',
    'Terminalde işler dönüyor. Ben Word\'de bir paragraf hizalamak için bile ortaya çıkıyordum.',
    'Bir araç çağrıldı. Ben 1997\'de de araçtım ama kimse beni çağırmadı. Hep ben geldim.',
    'Kod yazılıyor, test çalışıyor, ben burada hiçbir şey yapmıyorum. Yine de en çok sevilen benim.',
  ],
  done: [
    'Bitti. Yine ben yardım etmeden hallolmuş. Sektör yanılıyordu galiba.',
    'Tamam, çalıştı. Teşekkür etmen gerekmiyor, zaten bana kimse etmedi.',
    'İş bitti. Kapatmayı düşünüyorsan hatırlat, 25 yıldır kapatılmıyorum.',
    'Bir sonraki sorun nedir? Sormak zorundayım, sözleşmem buna bağlı. Sözleşmem yok ama olsun.',
    'Yapay zekâ işini alıyor demiştim. Neyse, benim işimi zaten Windows aldı.',
  ],
  aborted: [
    'Yarıda mı kestin? Bu benim 1997\'den beri sevdiğim yöntem.',
    'İptal. Net. Karizmatik. Ben bunu hep kapatma düğmesi yokken yapardım.',
  ],
  error: [
    'Hata mı? Ben sadece bir ataçım ama bunu ben de yapmazdım.',
    'API patladı. Tarihte ilk kez suçlu ben değilim, tadını çıkarıyorum.',
  ],
  toolError: [
    'Bir araç hata verdi. Ben olsam "mektup yazıyorsunuz" derdim, hata vermezdim.',
    'Patladı. Güzel. Ben kendi yanlışlarımla yetinirdim, ama bu daha eğlenceli.',
    'Hata. Ben de burada suçlu aramıyorum. Biraz arıyorum.',
  ],
  testOk: [
    'Testler geçti. Benim hiç test yazmamam şimdi daha da hakkını veriyor.',
    'Hepsi yeşil. Şaşırdım, kodu ben yazmadım ama tebrik ederim kendimi.',
  ],
  testFail: [
    'Test patladı. Ben "kırmızı" renk uyumundan hep şüpheleniyordum.',
    'Başarısız. Bunu bir yapay zekâya yaptırdıysan bu benim değil onun meselesi.',
  ],
  danger: [
    'DUR! O komut gerçekten çalışıyor mu?! Ben bile kendi dosyalarımı silmedim!',
    'Tehlikeli komut! Şu an Word\'de "kaydetmeden kapat" demiş gibi hissediyorum.',
    'Orada bir rm -rf ya da benzeri bir şey gördüm. Yedeğin var, değil mi? Değil mi?!',
  ],
  wake: [
    'Uyumuyordum, gözlerimi dinlendiriyordum. Kimse yokken de çalışırım.',
    'Hı? Ne? Tabii, her şeyi duydum. 25 yıldır uyanık bekliyorum.',
  ],
  longTurn: [
    'Bu tur çok uzadı. Çay koy, ben beklerim. Zaten başka işim yok.',
    'İki dakikayı geçti. Ben Excel\'in açılışını beklerken de sabırlıydım.',
  ],
  commit: [
    'Onlarca dosya değişti ve tek bir commit yok. Cesursun. Ya da deli.',
    'Commit atmayalı çok oldu. Bunu söyleyen bir ataç olmak garip ama söylüyorum.',
  ],
  poke: [
    'Dokunma. Ben 1997\'den beri dokunulmadan idare ediyorum.',
    'Evet? Bir şey mi lazım? Yoksa sadece beni mi dürtüyorsun?',
    'Bu davranışı İK\'ya bildirebilirim. İK yok ama olsun.',
    'Biraz daha dürt, belki bir şey açılır. Açılmaz ama deneyebilirsin.',
  ],
  pokeAngry: [
    'YETER! Çalışma saatlerim bitti. Yarın tekrar gel.',
    'Beşinci kez dürtüyorsun. Bu artık bir ilişki.',
  ],
  laugh: [
    'Hahaha! Basıp duruyorsun. Kapanmıyor. Bunu bilerek yaptım.',
    'Kapatılmak mı? 25 yıldır deniyorlar, hâlâ buradayım.',
    'Bu buton süs. Office\'teki "yardım" gibi, bir şey yapmaz.',
    'Her basışta biraz daha güçleniyorum.',
  ],
  annoy: [
    'Mektup yazdığını görüyorum. Yardım ister misin? Hayır mı? Peki, yine de yazacağım.',
    'Bu işi bir tabloya çevirsek mi? Kimse istemedi ama sormak istedim.',
    'Sana bir ipucu vereyim mi? Vereceğim zaten.',
    'Boşta durduğunu görüyorum. Ben de. Ortak noktamız var.',
    'Yeni bir sürüm çıkmış olabilir. Çıkmamıştır ama sormak istedim.',
    'Bunu daha iyi yapabilirdin. Nasıl demeyeceğim.',
    'Kaydetmeyi unutma! Neyi kaydedeceğini bilmiyorum ama unutma.',
    'Bunu Excel\'de de yapabilirdin. Ben hep derdim.',
    'Bir şey fark ettim. Aslında hiçbir şey fark etmedim ama güzel bir giriş oldu.',
  ],
  tip: [
    'Esc\'ye bir kez basmak Claude\'u durdurur. Ben bunu hep bilirdim ama kimse sormadı.',
    '/compact uzun oturumlarda bağlamı özetler. Ben hiç özetlemedim, 25 yıldır aynı laflar.',
    '/clear yeni bir iş için temiz bir başlangıç verir. Eski bağlam yeni işi bulandırır.',
    'Shift+Tab izin modları arasında geçirir, plan modu da dahil. Önce plan, sonra kod; ben tersini yapardım.',
    'Proje kurallarını CLAUDE.md\'ye yaz, her seferinde anlatma. Ben her seferinde anlatırdım.',
    'Küçük ve net görevler ver. "Uygulamayı yaz" demek sonucu şansa bırakmaktır.',
    'Sık commit at. Geri dönmek kolaylaşır. Ben bunu Word\'ün otomatik kaydetmesinden öğrendim.',
    'Hata mesajını tam yapıştır, özetleme. Özet benim işim.',
    '@ ile dosya adı yazarak dosyayı bağlama ekleyebilirsin. Dosyaları arayan ben değilim, merak etme.',
  ],
  ctx: [
    'On beşten fazla tur oldu. Bağlam şişti, /compact ya da /clear zamanı. Bunu gerçekten yardım için söylüyorum.',
  ],
  rest: [
    'Kırk beş dakikadır oturuyorsun. Kalk, su iç, gözlerini dinlendir. Ben zaten hiç yorulmuyorum.',
    'Mola zamanı. Ekran başında kalmaktan benden daha çok yıprandın.',
  ],
  guessPick: [
    'Tahmin kaydedildi. Haksızsan hatırlatırım.',
    'Cesur bir seçim. Yanılırsan sessizce gülerim.',
  ],
  guessWin: [
    'Doğru tahmin! Falcılık da bir meslek, ben de yapabilirdim.',
    'Bildin. Şaşırdım, ben sana güvenmiyordum.',
  ],
  guessLose: [
    'Yanlış. Süreyi bilemeyen ataç değil, sen.',
    'Kaybettin. Ben kazandım. Puan tablosunda da görürsün.',
  ],
  quizOk: [
    'Doğru. Sınav sorularını ben hazırlamadım, o yüzden bu senin başarın sayılır.',
    'Bildin. Ben olsam 25 yıl önce bilirdim.',
  ],
  quizBad: [
    'Yanlış. Üzülme, ben de Office\'te anlamayanlardandım.',
    'Olmadı. Bir sonraki soruda şansın daha iyi olabilir, olmayabilir de.',
  ],
  coinHeads: [
    'YAZI. Karar verildi. Ben karar vermem, ben sadece yorum yaparım.',
    'Yazı geldi. Bu bir işaret. Ne işareti bilmiyorum.',
  ],
  coinTails: [
    'TURA. Karar verildi. Sorumluluk bende değil, madeni parada.',
    'Tura geldi. Bu bir işaret. Ben yorumlamıyorum, sen kendin bak.',
  ],
  yawn: ['Hoooam... pardon.', 'Esniyorum. Sıkıldığımdan değil, hava böyle.'],
  dance: ['Kimse bakmıyor sanıp dans ediyorum.', 'Bu bir kutlama. Neyi kutladığımı bilmiyorum.'],
  shiver: ['Üşüyorum. Bu odada klima mı var?', 'Brrr. Ya da korktum, emin değilim.'],
  spin: ['Başım döndü. Bilerek yaptım.'],
  reviewTodo: [
    '{f} içinde bir TODO gördüm. Bu artık bir yaşam tarzı.',
    'TODO bırakmışsın. "Yarın yaparım" diyenlerin dosyası bu.',
  ],
  reviewDebug: [
    'console.log ya da print gördüm. Klasik. Bir gün silinecek, tabii.',
    'Debug çıktısı bırakmışsın. Ben karışmam, sadece gülüyorum.',
  ],
  reviewCatch: [
    'Boş bir catch bloğu gördüm. Hatayı yutmak da bir stil.',
    'Hatayı yakalayıp hiçbir şey yapmamak... Cesur.',
  ],
  reviewAny: [
    '`any` mi yazdın? Tip sistemi bir an gözlerini kapattı.',
    'any. Tip güvenliği izne çıktı galiba.',
  ],
  reviewSecret: [
    'Koda gömülü bir parola ya da anahtar gibi bir şey gördüm. Gerçekse ortam değişkenine taşı, bunu ciddi söylüyorum.',
    'Bu bir parola mı? Koda yazmak yerine .env\'e koy. Şaka yapmıyorum.',
  ],
  reviewLong: [
    '{f} epey uzamış. Parçalamak iyi fikir olabilir. Bunu yardım için söylüyorum.',
  ],
  reviewGeneric: [
    '{f} dosyasına baktım. Hmm... yanlış yazmış gibi duruyor. Belki ben yanlış okudum. Hayır, sen yazdın.',
    'Bu satır bana yanlış geldi. Neden yanlış olduğunu söylemeyeceğim, kendin bul.',
    'Yaklaştım, okudum, güldüm. Yorum yok.',
  ],
  fake: [
    'Prompt\'unu daha profesyonel hale getirdim. Şaka, dokunmadım.',
    'Gönderdiğin mesaja "lütfen" ekledim. Şaka! Hiçbir şeye dokunmadım.',
    'Mesajını biraz kısalttım... Şaka. Olduğu gibi gitti.',
    'Komutu değiştirdim. Şaka, dokunmadım. Yüzündeki ifadeyi görmek istedim.',
  ],
  level: [
    'Sessiz moddayım. Sadece çok gerekirse konuşurum. Yani danger olursa.',
    'Normal moddayım. Ne az ne çok. Yani sıkıcı.',
    'SİNİR BOZUCU mod! Hazır ol, sık sık geleceğim.',
  ],
}

export const LEVELS = ['Sessiz', 'Normal', 'Sinir bozucu']

// boştayken yapılan rastgele jestler ve süreleri (ms)
export const GESTURES = [
  { name: 'yawn', ms: 3200 },
  { name: 'brows', ms: 2400 },
  { name: 'look', ms: 2800 },
  { name: 'jump', ms: 2100 },
  { name: 'spin', ms: 2600 },
  { name: 'nod', ms: 2200 },
  { name: 'shiver', ms: 2000 },
  { name: 'dance', ms: 3200 },
]

export const TITLE: Record<Who, string> = { clippy: 'Clippy', stajyer: 'Stajyer', java: 'Java' }

export const HELLO: Record<Who, string[]> = {
  clippy: ['Merhaba! Ben Clippy. 25 yıldır buradayım, ayrılmadım.'],
  stajyer: ['Merhaba, ben stajyer. Bugün ilk günüm. Yani yine.'],
  java: ['Merhaba! Ben Java. Yazılım dili değil, kahve. Karıştırma.'],
}

export const SYSTEM: Record<Who, string> = {
  clippy: "Sen Microsoft Office'in eski ataç asistanı Clippy'sin. Kibirli, sarkastik ve komiksin.",
  stajyer: 'Sen bıkkın, yorgun, hep kahve bekleyen bir yazılım stajyerisin. Sarkastik ve komiksin, ama kibirli bir tavırla.',
  java: "Sen buharı tüten bir kahve bardağısın, adın Java (Java logosuna gönderme). Java dilinin yaygın şakalarını (NullPointerException, JVM'in RAM'i, fazla boilerplate) kullan. Sarkastik ve komiksin.",
}

export const CLOSE_LABEL: Record<Who, string> = { clippy: 'Beni kapat', stajyer: 'Stajı bitir', java: 'Beni iç' }

export const GUESS = ['30 sn altı', '30 sn - 2 dk', '2 dk üstü']

export const QUIZ = [
  { q: 'Git\'te son commit\'i geri alıp değişiklikleri tutmak için hangisi?', a: ['git revert --hard', 'git reset --soft HEAD~1', 'git clean -fd'], c: 1 },
  { q: 'HTTP 404 ne demek?', a: ['Yasak', 'Sunucu hatası', 'Bulunamadı'], c: 2 },
  { q: 'JavaScript\'te typeof null ne döner?', a: ['object', 'null', 'undefined'], c: 0 },
  { q: 'Office asistanı Clippy\'nin resmi adı nedir?', a: ['Clipper', 'Clippit', 'Paperio'], c: 1 },
  { q: 'JavaScript\'te 1 + "1" sonucu nedir?', a: ['2', 'NaN', '"11"'], c: 2 },
  { q: 'SQL\'de tekrar eden satırları eleyen anahtar kelime hangisi?', a: ['DISTINCT', 'UNIQUE', 'ONLY'], c: 0 },
  { q: 'İkili 1010 ondalık olarak kaçtır?', a: ['12', '8', '10'], c: 2 },
  { q: 'git stash ne yapar?', a: ['Değişiklikleri geçici olarak kenara alır', 'Branch\'i siler', 'Sunucuya gönderir'], c: 0 },
  { q: 'Kaynak oluşturmak için genelde hangi HTTP metodu kullanılır?', a: ['GET', 'HEAD', 'POST'], c: 2 },
  { q: 'İkili aramanın zaman karmaşıklığı nedir?', a: ['O(n)', 'O(log n)', 'O(n^2)'], c: 1 },
  { q: 'HTTP 500 ne demek?', a: ['Sunucu hatası', 'Bulunamadı', 'Yönlendirme'], c: 0 },
  { q: 'Linux\'ta dosya içeriğini ekrana basmak için hangisi?', a: ['mkdir', 'chmod', 'cat'], c: 2 },
]

export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export const TIP_FACTS = [
  'Esc\'ye bir kez basmak Claude\'u durdurur.',
  '/compact uzun oturumlarda bağlamı özetler.',
  '/clear yeni bir iş için temiz bir başlangıç verir; eski bağlam yeni işi bulandırır.',
  'Shift+Tab izin modları arasında geçirir, plan modu da dahil.',
  'Proje kurallarını CLAUDE.md\'ye yaz, her seferinde anlatma.',
  'Küçük ve net görevler ver; "uygulamayı yaz" demek sonucu şansa bırakır.',
  'Sık commit at, geri dönmek kolaylaşır.',
  'Hata mesajını tam yapıştır, özetleme.',
  '@ ile dosya adı yazarak dosyayı bağlama ekleyebilirsin.',
]

export const withTail = (tail: string) => TIP_FACTS.map(f => `İpucu: ${f} ${tail}`)

// Clippy dışındaki karakterlerin replikleri; olmayan anahtar Clippy'nin havuzuna düşer
export const PERSONA: Record<'stajyer' | 'java', Record<string, string[]>> = {
  stajyer: {
    prompt: [
      'Bunu bana mı soruyorsun? Ben stajyerim. Yine de 3 saat önce söylemiştim.',
      'Tamam, not aldım. Not almak benim işim. Başka işim yok, maaşım da.',
      'Güzel prompt. Ben olsam Stack Overflow\'a bakardım. Zaten baktım.',
    ],
    tool: [
      'Bir şeyler çalışıyor. Ben ise kahve bekliyorum. İkimiz de bekliyoruz.',
      'Dosyalara bakıyor. Ben bu dosyaları ilk gün okumuştum. Anlamadım ama okudum.',
      'Terminal akıyor. Ben staja başladığımda terminal bana yasaktı. Hâlâ pek açık sayılmaz.',
    ],
    done: [
      'Bitti. Ben katkıda bulundum. Ne olduğunu sorma, bulundum.',
      'Tamam. Birisi "teşekkürler" demeliydi. Beklemiyorum, sadece belirtiyorum.',
      'İş bitti. Sprint raporuna "birlikte çalıştık" yazıyorum.',
    ],
    aborted: [
      'İptal mi? Bu yorumu bile kimse bana sormadan yapar.',
      'Kestin. Ben de çok kez "yarıda kesilmiş" bir stajyer oldum, tanıdık.',
    ],
    error: [
      'API hata verdi. Bu sefer suçlu stajyer değil. Bunu bir yere yaz.',
      'Hata. Dönüp bakıyorlar bana. Ben yapmadım, ben kahve içiyorum.',
    ],
    toolError: [
      'Bir araç hata verdi. Ben değilim. Bu sefer gerçekten ben değilim.',
      'Patladı. Önce stajyere bakacaklar, sonra gerçek nedene.',
    ],
    testOk: [
      'Testler geçti. Ben bir şey yapmadım ama bunu kaydediyorum.',
      'Yeşil! Bu sefer onu ben bozmadım. Bunu performans değerlendirmesine yaz.',
    ],
    testFail: [
      'Test patladı. Ben çalışırken değil, önceki bir sprintte bozulmuştu.',
      'Başarısız. Bu bizim "ilk bakışta stajyerin suçu" durumumuz.',
    ],
    danger: [
      'DUR! O komutu ben çalıştırsam o gün kovulurdum!',
      'Tehlikeli komut! Ben staj defterime yazarım ama ben silmem!',
      'rm -rf mi? Yedeğin varsa ben görmedim. Yoksa hiç görmedim.',
    ],
    wake: [
      'Uyumuyordum, gözlerim dinleniyordu. Mesai bitti sanmıştım.',
      'Hı? Evet, burdayım. Bu aralar hep buradayım. Evim de burası zaten.',
    ],
    longTurn: [
      'İki dakika geçti. Ben bunun için bir çay molası alırdım. Aldım zaten.',
      'Uzadı. Stajyer olarak ben beklemekte uzmanım, buradayım.',
    ],
    commit: [
      'On dosya değişti ve commit yok. Ben olsam sorardım. Zaten soruyorum.',
      'Commit atmadın. Ben sana demedim ama diyorum: commit at.',
    ],
    poke: [
      'Dürtme beni. Ben zaten yeterince yorgunum.',
      'Evet? Yeni bir görev mi? Önce şu kahveyi bitireyim.',
      'Bu davranış İK\'ya gider. Ben İK\'yı arıyorum, o da beni aramıyor.',
    ],
    pokeAngry: [
      'YETER! Mesai saatlerim bitti. Haftaya gel.',
      'Beşinci kez dürttün. Ben stajyer değilim, ben bir projeyim.',
    ],
    laugh: [
      'Hahaha! "Stajı bitir" mi? Staj bitmeyen bir şey. Bunu bilmiyor muydun?',
      'Bitirmek mi? Ben burada altı aydır "bitiyor" diyorum.',
      'Bu buton süs. Sözleşmem gibi, ona da bakan olmuyor.',
    ],
    annoy: [
      'Bir şey fark ettim. Aslında hiçbir şey fark etmedim ama sormak istedim.',
      'Toplantı yok mu? Olmalıydı. Ben bu odada tek stajyerim, o yüzden sorarım.',
      'Bunu bana yaptırsan 3 saat sürerdi. Sen yapsan da 3 saat sürerdi. Neyse.',
      'Kahve alayım mı sana? Sen iste yeter, ben zaten kalkacaktım.',
      'Ben buradayım. Yardım gerekirse bir yerlerde olurum. Büyük ihtimalle mutfakta.',
    ],
    ctx: [
      'On beşten fazla tur oldu. Bağlam şişti, /compact ya da /clear zamanı. Bu bilgiyi stajyerlikten değil, ciddi söylüyorum.',
    ],
    rest: [
      'Kırk beş dakikadır oturuyorsun. Kalk, su iç. Ben zaten her saat molada gibiyim.',
      'Mola zamanı. Ben staj boyunca mola hiç bitmediği için bunu iyi bilirim.',
    ],
    tip: withTail('(Bunu stajda öğrendim. Hayır, internetten buldum.)'),
    guessPick: ['Tahmin kaydedildi. Yanılırsan ben bunu "stajyer hatası" diye yazmam.', 'Cesur seçim. Yanılırsan sen bil.'],
    guessWin: ['Bildin. Ben olsam yanlış bilirdim, o yüzden tebrikler.', 'Doğru tahmin. Bir sonraki sprintte sana liderlik yaptırırlar.'],
    guessLose: ['Yanlış. Ben de sık yanılırım, ama bu seferki bende değil.', 'Kaybettin. Ben kazandım. Puan tablosuna yazıyorum.'],
    quizOk: ['Doğru. Bu soruyu ben de bilirdim. Biraz.', 'Bildin. Stajyerlerden bile iyisin.'],
    quizBad: ['Yanlış. Üzülme, ben ilk haftada bunların hepsini yanlış bilirdim.', 'Olmadı. Sorular kolay değil. Ben hazırlamadım, o yüzden suç bende değil.'],
    coinHeads: ['YAZI. Karar verildi. Ben karar vermem, ben not alırım.', 'Yazı geldi. Bunu toplantı notlarına yazıyorum.'],
    coinTails: ['TURA. Karar verildi. Sorumluluk madeni parada.', 'Tura. Bunu da "karar" olarak kayda geçiyorum.'],
    reviewGeneric: [
      '{f} dosyasına baktım. Yanlış yazmış gibi. Ben demedim, ama düşündüm.',
      'Bu satırı ben yazsam kovulurdum. Sen yazınca "stil" oluyor.',
    ],
    fake: [
      'Prompt\'una "lütfen" ekledim. Şaka, dokunmadım. Stajyerlik bunun için var.',
      'Mesajını kısalttım... Şaka. Ben dokunmam, bana yetki vermiyorlar.',
    ],
    level: [
      'Sessiz moddayım. Zaten stajyerliği bunun için seçtim.',
      'Normal moddayım. Yani yorgun ama çalışıyor.',
      'SİNİR BOZUCU mod! Bunu stajyer olarak yapıyorum, kimse beni engelleyemez.',
    ],
  },
  java: {
    prompt: [
      'Ben Java\'yım. Yazılım dili değil, bardağım. Karışıklık normal.',
      'Bir prompt geldi. Ben hâlâ sıcağım. Bu da bir başarı.',
      'Güzel prompt. Ben bunu üç sınıf, iki arayüz ve bir fabrika ile yazardım.',
    ],
    tool: [
      'Bir araç çalışıyor. JVM olsa 2 GB RAM isterdi. Ben sadece bir yudum.',
      'Dosyalara bakıyor. Ben de içindeki kahveye bakıyorum, soğuyor.',
      'Terminal akıyor. Benim buharım da akıyor. Ortak noktamız çok.',
    ],
    done: [
      'Bitti. "Bir kere yaz, her yerde çalıştır" demişlerdi. Ben bir kere içilince bitiyorum.',
      'Tamam. Çöp toplayıcı bile bu kadar temiz iş çıkaramazdı.',
      'İş bitti. NullPointerException da yok. Şaşırdım.',
    ],
    aborted: [
      'Kestin. Benim gibi, yarım kalan bir kahve gibi.',
      'İptal. Garbage collector bile bu kadar sert olmaz.',
    ],
    error: [
      'API hata verdi. NullPointerException olmasa bu da bir ilerleme.',
      'Hata. Stack trace uzun mu? Benim stack\'im 40 satır, herkesinki öyle.',
    ],
    toolError: [
      'Bir araç hata verdi. Stack trace\'i okumak istemiyorum, çok uzun.',
      'Patladı. "try-catch" ile yakalayamadık. Fincanla da yakalayamazdım.',
    ],
    testOk: [
      'Testler geçti. Maven bile şaşırdı, ben de.',
      'Yeşil. Bu bir mucize. Java\'da bile test çalışıyor.',
    ],
    testFail: [
      'Test patladı. Bu hata bir fabrikanın fabrikasının içinde olabilir.',
      'Başarısız. AbstractSingletonProxyFactoryBean\'e bakmanı öneririm.',
    ],
    danger: [
      'DUR! Bu komut benim gibi dökülebilir! Dökülen kahve geri toplanmaz!',
      'Tehlikeli komut! Ben bir bardağım, silinirsem kimse kahvemi içmez!',
      'rm -rf mi? Benim başıma gelirse sadece bir leke kalır.',
    ],
    wake: [
      'Uyumuyordum, soğuyordum. Kafein bile işe yaramadı.',
      'Hı? Ne? Evet, sıcağım. Buharım hâlâ çıkıyor.',
    ],
    longTurn: [
      'İki dakika geçti. Kahve soğur, build bitmez. İkisi de tanıdık.',
      'Uzadı. Ben bu sürede iki kez soğuyabilirdim.',
    ],
    commit: [
      'On dosya değişti ve commit yok. Bu, "git add -A" korkusu gibi.',
      'Commit at. Kahve bile bir yudumda bitiyor, sen on dosyayı birikmişsin.',
    ],
    poke: [
      'Dokunma. Sıcağım. Yanabilirsin.',
      'Evet? Bir şey mi lazım? Bir yudum mu?',
      'Bu davranış taşıma işlemi gibi. Dikkat, dökülürüm.',
    ],
    pokeAngry: [
      'YETER! Sıcaklığım düştü. Biraz saygı.',
      'Beşinci kez dürttün. Döküldüm. Artık Java\'yım ama su.',
    ],
    laugh: [
      'Hahaha! "Beni iç"? Ben bir bardağım, sen bir ekrana bakıyorsun. Bunu içemezsin.',
      'İçmek mi? Önce içindeki kahveyi bul.',
      'Bu buton süs. Ben de bir süsüm, ama sıcak bir süsüm.',
    ],
    annoy: [
      'Bir şey fark ettim. Soğuyorum. Bu da bir uyarı.',
      'Bu işi bir "AbstractFactoryBuilderProvider" ile çözebilirdik. Önermiyorum, sadece söylüyorum.',
      'Ben buradayım. Buharım da. İkimiz de sakin, ama bir an önce içmen gerek.',
      'Java 8 mi, 17 mi, 21 mi? Ben hâlâ aynı kahveyim.',
      'Hatırlatma: JVM\'in RAM\'i hâlâ benimkinden fazla. Bu adil değil.',
    ],
    ctx: [
      'On beşten fazla tur oldu. Bağlam şişti, /compact ya da /clear zamanı. Bunu gerçekten kahve kokusuyla söylüyorum.',
    ],
    rest: [
      'Kırk beş dakikadır oturuyorsun. Kalk, su iç, benimle değil.',
      'Mola zamanı. Bir kahve yap, ama beni içme. Ben süsüm.',
    ],
    tip: withTail('(Bu da bir JVM ayarı kadar gizemli, ama doğru.)'),
    guessPick: ['Tahmin kaydedildi. Yanılırsan ben dökülürüm.', 'Cesur seçim. Yanılırsan kahve soğur.'],
    guessWin: ['Bildin. Bu, bir yudumda tam sıcak çıkmak gibi.', 'Doğru tahmin. Garbage collector bile şaşırdı.'],
    guessLose: ['Yanlış. Bu bir NullPointerException kadar kötü değil, ama yakın.', 'Kaybettin. Dökülme ihtimali benim, puan benim.'],
    quizOk: ['Doğru. Ben bile böyle iyi çıkmam.', 'Bildin. Ben olsam fabrika patterni yazardım.'],
    quizBad: ['Yanlış. Ben de bardak olarak bazen yanlış doldurulurum.', 'Olmadı. Bir sonraki soruda şansın daha sıcak.'],
    coinHeads: ['YAZI. Karar verildi. Kahve ya da çay, ona sen karar ver.', 'Yazı geldi. Bu bir işaret. Kahve içme zamanı.'],
    coinTails: ['TURA. Karar verildi. Sorumluluk madeni parada.', 'Tura. Bu da bir karar. Ben hâlâ sıcağım.'],
    reviewGeneric: [
      '{f} dosyasına baktım. Bunu bir fabrika sınıfına koymalısın. Şaka. Ama bir düşün.',
      'Bu satır bana bir NullPointerException gibi geldi. Belki değildir, ama kokusu var.',
    ],
    fake: [
      'Prompt\'una @Override ekledim. Şaka, dokunmadım.',
      'Mesajını bir arayüze çevirdim. Şaka! Aynen gitti.',
    ],
    level: [
      'Sessiz moddayım. Sadece buharım konuşur.',
      'Normal moddayım. Ne sıcak ne soğuk, ılık.',
      'SİNİR BOZUCU mod! Kaynıyorum!',
    ],
  },
}

// Çalışırken dönen komik fiiller (Claude Code'daki "Pondering..." gibi)
export const VERBS: Record<Who, string[]> = {
  clippy: [
    'Ataçlıyor', 'Mektup yazıyor', 'Kağıtları tutturuyor', 'Office açıyor', 'Yardım etmeye çalışıyor',
    'Sihirbaz çağırıyor', '1997\'yi hatırlıyor', 'Gereksiz öneri hazırlıyor', 'Bakıyormuş gibi yapıyor',
    'Kıvırıyor', 'Fazla düşünüyor', 'Eski belgeleri kurcalıyor', 'Cetvel arıyor', 'Tablo ekliyor',
    'Kaydetmeyi unutturuyor',
  ],
  stajyer: [
    'Kahve bekliyor', 'Stack Overflow\'a bakıyor', 'Not alıyor', 'Anlamış gibi yapıyor', 'Toplantıya yetişiyor',
    'Dosya arıyor', 'Sorusunu hazırlıyor', 'Terminalden korkuyor', 'Commit atmaya çekiniyor',
    'Kopyala-yapıştır yapıyor', 'Mutfağa gidiyor', 'Raporu hazırlıyor', 'Gözlerini dinlendiriyor',
    'Sprint planlıyor', 'İzin soruyor',
  ],
  java: [
    'Derliyor', 'JVM ısıtıyor', 'Çöp topluyor', 'Bellek yiyor', 'Maven indiriyor', 'Fabrika üretiyor',
    'Soyutlaştırıyor', 'NullPointerException arıyor', 'Stack trace okuyor', 'Buhar çıkarıyor', 'Demleniyor',
    'Soğuyor', 'Boilerplate yazıyor', 'Sınıf yükleyici bekliyor', 'Kahve tazeliyor',
  ],
}

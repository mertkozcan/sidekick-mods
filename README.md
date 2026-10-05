# sidekick-mods

Kod yazarken yanında duran, eğlendiren, arada yardım eden yan arkadaş modları için bir
Claude Code marketplace'i.

## sidekick

Claude Code içinde yanda açılan bir panel. Üç karakter var: **Clippy** (ataç), **Stajyer**
ve **Java** (kahve bardağı).

- Office tarzı konuşma balonu, ruh halleri (mutlu, kızgın, panik, uykulu, gülen, koda bakan)
- Çalışırken dönen komik fiiller ve süre, boştayken rastgele jestler
- Tehlikeli komuta panik, test sonucuna tepki, düzenlenen koda bakıp yorum, commit/mola/bağlam hatırlatması
- Fare takibi, isteğe bağlı ses (bip ya da konuşma)

### Kurulum

```
claude plugin marketplace add mertkozcan/sidekick-mods
claude plugin install sidekick@sidekick-mods
```

Sonra bir oturumda `/sidekick yardim` yazın. `sidekick:` ile başlayan bir cevap gelirse yüklenmiştir;
panel yan tarafta kendiliğinden açılır.

### Komutlar

| Komut | Ne yapar |
|---|---|
| `/sidekick` | paneli açar |
| `/sidekick clippy`, `stajyer`, `java` | karakteri değiştirir |
| `/sidekick sessiz`, `normal`, `sinir` | ne kadar sık konuşacağını ayarlar |
| `/sidekick ses [kapali\|bip\|konusma]` | sesi ayarlar (varsayılan: kapalı) |
| `/sidekick yardim` | kullanımı ve durumu gösterir |

### Bilmeniz gerekenler

- Yalnızca Windows'ta denendi.
- `ses konusma` Windows'ta PowerShell çalıştırır (sistem konuşma motoru). Metin komuta değil, tek
  tırnaklı bir dizeye gömülür; testle doğrulandı. Varsayılan olarak ses kapalıdır.
- Tur sonunda ara sıra tek cümlelik replik için oturumun kendi modeline (haiku) küçük bir istek
  gider. Dosya içeriği ya da yazdıklarınız gönderilmez, yalnızca araç adları, araç sayısı ve süre.
  `/sidekick sessiz` bunu kapatır.
- Mod, kullanıcının yetkileriyle çalışır; sandbox yoktur (tüm modlar için geçerli).
- "Clippy" göndermesi dışında Microsoft ile bağlantısı yoktur; tüm çizimler koddan üretilir.

### Lisans

MIT, bkz. `LICENSE`.

### Geliştirme

```
cd plugins/sidekick
claude plugin validate . --strict
claude plugin test
```

Güncellemelerin kullanıcıya ulaşması için `plugin.json` ve `marketplace.json` içindeki
`version` alanını artırmak gerekir.

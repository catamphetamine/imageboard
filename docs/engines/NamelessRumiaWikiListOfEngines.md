Source: https://namelessrumia.heliohost.org/w/doku.php?id=imageboard&do=edit

====== Imageboard ======
> //"People don't like to read long shit anymore, so they use images, GIFs and WebMs. That's the reason 4chan has millions of users per month."//
> -- Nameless @ Passing Through The Lobby(([[https://bienvenidoainternet.org/world/read/1508604355/|"Why are textboards dead in the west?"]] (October 21, 2017). Bienvenido a Internet /world/.))

An **imageboard** (画像掲示板, //gazō keijiban//), or **image board** (**IB**), is a type of [[bulletin board]] where registration isn't required but the option to attach images is available. Most boards take their inspiration from [[4chan]],((It should be warned that 4chan has changed a lot over time, so people will have different ideas of what it used to be was like in their memories and, if applicable, what exactly they wanted to emulate.)) which in turn was inspired by the Japanese [[Futaba Channel]].

===== Summary =====
{{ :bbs:imageboard.png?200|An example of an imageboard.}}
While imageboards do house text-based communications like [[textboard|textboards]], the biggest difference is that users can attach files to their posts. Visual media is notably attractive to [[wp>Web 2.0]] users, but it does eat up a lot of space and you run the risk of vandals uploading illegal content.

Due to their origins, users may attach a name, [[tripcode]], [[capcode]], email, and [[sage]] to their post, but using identifiers are typically discouraged in anonymous communities. You should also know when attaching an image or dumping images is appropriate.

Unlike textboards, there's no option to view a thread in pieces or fractions (the option to view the last 50 posts of a thread is rare) and threads aren't usually archived since visual media does eat up a lot of space.

===== Script Examples =====
<WRAP center round info 80%>This list is not exhaustive, not frequently updated, and the writings may be dated. Please see the [[#external links]] for a list that probably is.</WRAP>

==== Classic scripts ====
  * **[PHP] <del>[[http://php.s3.to/bbs/bbs3.php|GazouBBS]]</del>** (v3.3, 2002-06-15)\\ An unsuspecting script that was likely meant to be a news board. Images were admin-reviewable.
    * **[PHP] [[http://www.2chan.net/script/|Futaba]]** (051031, 2005-10-31)\\ The fork used on [[Futaba Channel]]. However, this version is old and the source code went private.
      * **[PHP] <del>[[http://siokara.que.jp|Siokara]]</del>** (v1.04, 2004-08-01)\\ A short-lived early fork of an old version of Futaba, specifically "031015" (2003-10-15).
        * **[PHP] [[http://t-jun.kemoren.com/hokanko.htm#sc|Yakuba]]** (2019-05-27)\\ An updated fork of Siokara with general bug fixes, though it isn't updated that often.
      * **[PHP] [[http://www.1chan.net/futallaby/|Futallaby]]** (040103, 2004-01-03)\\ The ancient English translation of Futaba, formerly used by [[4chan]] and [[1chan]].
        * **[PHP] [[https://github.com/knarka/fikaba|Fikaba]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/knarka/fikaba/master"></html>\\ A short-lived fork of Futabally, which was apparently meant to be standards-compatible.
        * **[PHP] <del>[[http://wakaba.c3.cx/soc/kareha.pl/1118252944/|Futallaby-Plus]]</del>**\\ This script has apparently been lost to time, so I can't write much about it.
          * **[PHP] [[https://saguaroib.github.io/|Saguaro]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/saguaroib/saguaro/master"></html>\\ An inactive fork of a fork of a fork of a fork. Last seen in DameIB, which no longer exists.
        * **[PHP] <del>[[http://www.4chan.org/faq#software|Yotsuba]]</del>**\\ 4chan's closed-source fork. Surprisingly, the software has never leaked in full.
      * **[PHP] [[https://pixmicat.github.io/|Pixmicat!]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/pixmicat/pixmicat/develop"></html>\\ The long-running Chinese translation and fork of Futaba that initially began development as far back as 2006, remains in use at [[Komica]] which has a massive collection of boards.
  * **[Perl] [[http://wakaba.c3.cx/|Wakaba]]** (v3.0.9, 2012-02-05)\\ The classic that <color #008000>!WAHa.06x36</color> made for [[Wakachan]]. It remains in use at Russian websites like [[IIchan]], but it's usually heavily modified due to the script being so old.
    * **[Perl] <del>[[http://www.krautchan.net/|Desuchan]]</del>** (v0.80)\\ A closed-source fork that <color #008000>**Der General**</color> made for [[Krautchan]]. It sadly died with the website in 2018.
    * **[Perl] <del>[[https://suigintou.weedy.ca/trac/desuchan/browser/trunk|Desuchan]]</del>** (rev 168, 2011-04-22)\\ An ancient fork of Wakaba 3.0.7 that Desuchan once used, before replacing it with Wakarimasen.
    * **[Perl] [[https://github.com/marlencrabapple/Glaukaba|Glaukaba]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/marlencrabapple/Glaukaba/master"></html>\\ An impressive fork of Wakaba, which highly resembled 4chan, for a niche [[wp>Summer Glau]] website.
  * **[Perl] [[http://wakaba.c3.cx/|Kareha]]** (v3.1.4, 2009-04-16)\\ The separate textboard version of Wakaba by <color #008000>!WAHa.06x36</color>. This had an imageboard mode as well, but a lack of database meant that post numbering resets with every new thread.
  * **[PHP] <del>[[https://web.archive.org/web/20080812143844/http://www.kusaba.org/|Trevorchan → Kusaba]]</del>** (v1.0.4, 2008-03-11)\\ A famously bad script by "Trevor Slocum" that once plagued the late 2000s, once featured on [[7chan]].
    * **[PHP] <del>[[https://web.archive.org/web/20200321230657/http://kusabax.cultnet.net/|Kusaba X]]</del>** (v0.9.3, 2011-07-26)\\ The fork of Kusaba by "Harrison", which remains in use at 7chan, Tohno-chan, and so forth.
      * **[PHP] [[https://github.com/Edaha/Edaha|Edaha]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/Edaha/Edaha/master"></html>\\ A fork that was meant to replace Kusaba X, but apparently never got anywhere.

==== Popular scripts ====
  * **[PHP] [[https://github.com/savetheinternet/Tinyboard|Tinyboard]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/savetheinternet/Tinyboard/master"></html>\\ The lightweight imageboard script that <color #008000>**SaveTheInternet**</color> made for [[4chon]].(([[https://github.com/vichan-devel/vichan/pull/179|"I believe I am owed, as a respected pioneer and the renowned father of this cutting-edge software, the gratitude of not having my signature removed or defaced."]] (May 19, 2016). GitHub.)) Still used on Ota-ch.
    * **[PHP] [[https://github.com/vichan-devel/vichan|Vichan]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/vichan-devel/vichan/master"></html>\\ The better known Tinyboard fork, initially developed for Polish [[Vichan]]. Due to its mass adoption, it continues to receive general security updates.
      * **[PHP] [[https://github.com/ECHibiki/Kissu-Vi|Kissu]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/ECHibiki/Kissu-Vi/distribution"></html>\\ An experimental fork for Kissu, which partially relies on Vichan and NPFchan for updates.
      * **[PHP] [[https://github.com/ctrlcctrlv/infinity|Infinity]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/ctrlcctrlv/infinity/master"></html>\\ The famous Reddit-like fork of Vichan that <color #008000>**Copypaste**</color> used on [[8chan]]. No longer developed.
        * **[PHP] [[https://github.com/OpenIB/OpenIB|OpenIB]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/OpenIB/OpenIB/master"></html>\\ An older version of the [[NTTEC]] fork of "Infinity", which focused on security updates.
      * **[PHP] [[https://github.com/lainchan/lainchan|Lainchan]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/lainchan/lainchan/main"></html>\\ An unusual fork that continues to be used for Lainchan. Bit horrible to look at.
      * **[PHP] [[https://github.com/fallenPineapple/NPFchan|NPFchan]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/fallenPineapple/NPFchan/master"></html>\\ The somewhat decent fork, initially made for /mlpol/ until the new owners decided to replace it. Despite this, it remains in use on [[Wizardchan]] and other niche boards.
        * **[PHP] [[https://github.com/27chan/bazukachan|Bazukachan]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/27chan/bazukachan/master"></html>\\ The NPFchan fork, by <color #008000>**Ninja**</color>, for [[27chan]], which [[VHSchan]] also used. No longer developed.
  * **[.js] [[https://gitgud.io/fatchan/jschan/|Fatchan → jschan]]** (2023-08-31)\\ An imageboard script made for Fatchan. It has somewhat grown in popularity, being used at [[27chan]], 94chan, [[PTchan]], Trashchan, and ZZZchan.
==== Other scripts ====
  * **[PHP] <del>[[https://wakaba.c3.cx/soc/kareha.pl/1121005876/108|Thorn]]</del>** (v1.1b6, 2006-01-09)\\ A dead, archaic script that <color #008000>**Albright** !LC/IWhc3yc</color> made for Pichan. The script would also be seen within the histories of a [[not4chan]] clone and [[AnonIB]] before the August 2009 hack.
  * **[Python] [[https://bitbucket.org/Storlek/matsuba|Matsuba]]** (mid-2000s?)\\ An old Wakaba-based script that was used for Soviet Russia, which was forced to shut down.
  * **[PHP] [[https://github.com/Dalloway/MiniBBS|MiniBBS]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/Dalloway/MiniBBS/master"></html>\\ The lightweight script that remains in use at Minichan and Tinychan to this date.
  * **[PHP] [[https://github.com/MitsubaBBS/Mitsuba|Mitsuba]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/MitsubaBBS/Mitsuba/master"></html>\\ This is, yet another, imageboard script written in PHP. A certain <del>[[https://github.com/karachan/Mitsuba|fork]]</del> remains in use at [[Karachan]].
  * **[PHP] [[https://github.com/FoolCode/FoolFuuka|FoolFuuka]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/FoolCode/FoolFuuka/master"></html>\\ Highly-customizable imageboard, best known for its use as a 4chan archive frontend.
  * **[Python] <del>[[https://github.com/dequis/wakarimasen|Wakarimasen]]</del>** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/dequis/wakarimasen/master"></html>\\ A dead, Wakaba-compatible python script that was designed for Desuchan.
    * **[Python] [[https://github.com/weedy/wakarimasen|Wakarimasen]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/weedy/wakarimasen/desuchan"></html>\\ The current Wakarimasen fork that Desuchan uses, though this might be a really old version.
  * **[Go] <del>[[https://github.com/majestrate/nntpchan|NNTPchan]]</del>** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/majestrate/nntpchan/master"></html>\\ A distributed imageboard that encouraged Tor and I2P communication. No longer operational.
  * **[PHP] [[https://github.com/infinity-next/infinity-next|Infinity Next]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/infinity-next/infinity-next/master"></html>\\ The failed 8chan and Kiwi Farms collaboration,(([[https://archive.today/23urm|"Next will be scrapped. I'm going to go home and you'll never see me again."]] (January 8, 2016). 8chan /next/.))(([[https://twitter.com/ItsJoshProbably/status/687490294862856193|"Maybe we should have called it Infinity End instead. The original name was Larachan."]] (January 13, 2016). Joshua Moon on Twitter.)) once used at 16chan(([[https://archive.today/AmR97|"I'd rather not see 16chan die a slow death from neglect so I am going to humanely put it down."]] (August 24, 2016). Infinity Next.)) and 9chan.tw.
  * **[Go] [[https://github.com/bakape/shamichan|Meguca/Shamichan]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/bakape/shamichan/master"></html>\\ A real-time imageboard that was made for Meguca, then the [[wp>Halle synagogue shooting|2019 synagogue shooting]] forced a rebrand. It was used at Meguca, Chen2, and remains in use at Sturdychan.
    * **[Go] <del>[[https://github.com/chuuloves/2chen|2chen]]</del>**\\ A fork of Meguca for the old 2chen. Both the GitHub and website went down at the same time.
  * **[PHP] [[https://code.rocketnine.space/tslocum/tinyib|TinyIB]]** (2023-03-20)\\ Another script from "Trevor Slowcum" of Kusaba fame. It's used by [[1chan]] and SVQW (not SAoVQ).
  * **[.js] [[https://gitgud.io/LynxChan/LynxChan|LynxChan]]** (v2.9; 2023-07-28)\\ This was a prospective Vichan rival by <color #008000>**Stephen Lynx**</color> during 8chan's Infinity Next disaster, but it just isn't good to look at. It remains in use at 8moe, AlogsSpace, Anon.cafe, and Bandada.club.
  * **[Lisp] [[https://github.com/Shirakumo/purplish|Purplish]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/Shirakumo/purplish/master"></html>\\ Niche imageboard software used at Stevenchan.
  * **[.js] [[https://github.com/lalcmellkmal/doushio|Doushio]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/lalcmellkmal/doushio/master"></html>\\ One of the oldest, active real-time imageboard scripts, made for Doushio and used on /tea/.
  * **[Go] [[https://github.com/Eggbertx/gochan|Gochan]]** <html><img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/Eggbertx/gochan/master"></html>\\ A script by <color #008000>**Zeke Roa**</color> that was intended to replace the old script on Lunachan, which shut down and later merged into [[GETchan]]. Remains experimental until the migration tool works.

===== Notes =====
  * There are differences between Futaba Channel and the average English imageboard script:
    - The "double dash" (<nowiki>>></nowiki>) outside posts were changed to "ellipses" (…) in late 2003, and they would gradually become the standard across all Futaba Channel boards by the mid-2000s.
    - <del>The three bullet points about file types, specifications, and thumbnails were all combined into one.</del>
    - "<color #ff0000>(USER WAS BANNED FOR THIS POST)</color>" never existed, this came from [[Something Awful]].
  * Most scripts are PHP because people were reluctant to use or dive into anything else back then, which unfortunately contributed to the trend of PHP dominating a large majority of the internet.
    * There's a reason why Kusaba X was so hated and why people kept poking so many holes into it!
  * All these scripts with user-created boards completely killed the imageboard script development scene, very similar to how Reddit has killed niche forums and instilled [[internet gentrification]].

===== See also =====
  * [[Textboard]]

===== External links =====
  * [[https://overscript.net/|Overscript]] - An overview of anonymous bulletin board scripts.

{{tag>status_badges}}

<template>
  <div class="list">
    <!-- 无限滚动组件 -->
    <n-infinite-scroll :distance="10" @load="handleLoad">
      <!-- 遍历显示每一条消息 -->
      <div v-for="item in items" :key="item.id">
        <Notification
          :avatar_url="item.avatar_url"
          :msg_title="item.msg_title"
          :msg="item.msg"
          :msg_type="item.msg_type"
          :category="item.category"
          :id="item.id"
          :tid="item.tid"
          :name="item.name"
          :uid="item.uid"
        ></Notification>
        <n-divider style="margin: 0" />
      </div>
      <div v-if="loading" class="text">加载中...</div>
    </n-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Notification from "./NotificationItem.vue";
import { getData } from "../../services/getData";
import { getAvatarUrl, saveCache } from "../../services/getUserCurentAvatarByID";
import type { Ref } from "vue";

interface Message {
  ID: number;
  CategoryID: number;
  TemplateID: number;
  Users: string[];
  Fields: any;
  UserNames: string[];
  Numbers: any;
}

interface Template {
  ID: number;
  Content: any;
  Subject: string;
  Type: number;
  CategoryID: number;
}
interface Item {
  id: number;
  avatar_url: string;
  msg_title: string;
  msg: string;
  msg_type: number;
  category: string;
  tid: string;
  name: string;
  uid: string;
}

const items: Ref<Item[]> = ref([]);
const loading = ref(false); // 用于无限滚动组件判断是否可以获取下一组数据
let skip = 0;
let templates: any = [
  {
    ID: "5c90f172a2409b51dc5cb945",
    Identifier: "Letter-Test",
    CategoryID: 1,
    Management: false,
    Subject: {
      Chinese: "一封测试邮件 {Users}",
      English: "A letter for test {Users}",
      ChineseTraditional: "一封測試郵件 {Users}",
      German: "Ein Brief für den Test {Benutzer}",
      French: "Une lettre pour le test {Utilisateurs}",
      Japanese: "テスト用の手紙{Users}",
      Italian: "Una lettera per il test {Utenti}",
      Polish: null,
      Spanish: null,
      Ukrainian: null,
    },
    Content: {
      Chinese: "这是一封测试邮件，用于测试所有功能。{Users}",
      English: "This is a letter for test to test every features. {Users}",
      ChineseTraditional: "這是一封測試郵件，用於測試所有功能。 {Users}",
      German: "Dies ist ein Testbrief zum Testen aller Funktionen. {Benutzer}",
      French: "Ceci est une lettre de test pour tester toutes les fonctionnalités. {Utilisateurs}",
      Japanese: "これはすべての機能をテストするためのテスト用の手紙です。 {ユーザー}",
      Italian: "Questa è una lettera per test per testare tutte le funzionalità. {} utenti",
      Polish: null,
      Spanish: null,
      Ukrainian: null,
    },
    Description: null,
    Bonuses: {
      Fragment: 1,
    },
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "5c9114e9ce50092ed4453fd5",
    Identifier: "Attention-Followed",
    CategoryID: 2,
    Management: false,
    Subject: {
      Chinese: "新的关注者！",
      English: "New follower!",
      ChineseTraditional: "新的關注者！",
      German: "Neuer Anhänger",
      French: "Nouveau disciple!",
      Japanese: "新しいフォロワー！",
      Italian: "Nuovo follower!",
      Polish: "Nowy obserwujący!",
      Spanish: "¡Nuevo seguidor!",
      Ukrainian: "Новий підписник!",
    },
    Content: {
      Chinese: "{Users} 关注了你。",
      English: "{Users} followed you.",
      ChineseTraditional: "{Users} 關注了你。",
      German: "{Users} ist dir gefolgt.",
      French: "{Users} vous a suivi.",
      Japanese: "{Users} さんがあなたをフォローしました。",
      Italian: "{Users} ti hanno seguito.",
      Polish: "{Users} obserwują Cię.",
      Spanish: "{Users} te siguió.",
      Ukrainian: "{Users} підписалися на вас.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 10,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "5c912015890d955280649a44",
    Identifier: "Content-Management-Featured",
    CategoryID: 4,
    Management: true,
    Subject: {
      Chinese: "{Experiment} 被评为精选！",
      English: "{Experiment} has been featured!",
      ChineseTraditional: "{Experiment} 被評為精選！",
      German: "{Experiment} wurde vorgestellt!",
      French: "{Experiment} a été présenté!",
      Japanese: "{Experiment} が特集されました！",
      Italian: "{Experiment} è stato presentato!",
      Polish: "{Experiment} został wyróżniony!",
      Spanish: "¡Se ha destacado {Experiment}!",
      Ukrainian: "{Experiment} представлено!",
    },
    Content: {
      Chinese: "编辑 {Users} 执行了这一操作。",
      English: "Editor {Users} did it.",
      ChineseTraditional: "編輯 {Users} 執行了這一操作。",
      German: "Der Editor {Users} hat es geschafft.",
      French: "L'éditeur {Users} l'a fait.",
      Japanese: "エディタ {Users} がやりました。",
      Italian: "L'editor {Users} l'ha fatto.",
      Polish: "Redaktor {Users} to zrobił.",
      Spanish: "El editor {Users} lo hizo.",
      Ukrainian: "Редактор {Users} зробив це.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "5c91201c890d955280649a45",
    Identifier: "Letter-Featured",
    CategoryID: 1,
    Management: false,
    Subject: {
      Chinese: "你的作品 {Experiment} 评为精选！",
      English: "Your work {Experiment} is featured!",
      ChineseTraditional: "你的作品 {Experiment} 評為精選！",
      German: "Ihre Arbeit {Experiment} wird vorgestellt!",
      French: "Votre travail {Experiment} est en vedette!",
      Japanese: "あなたの作品 {Experiment} が紹介されました！",
      Italian: "Il tuo lavoro {Experiment} è in primo piano!",
      Polish: "Twoja praca {Experiment} jest polecana!",
      Spanish: "¡Tu trabajo {Experiment} está destacado!",
      Ukrainian: "Представлено вашу роботу {Experiment}!",
    },
    Content: {
      Chinese:
        "祝贺你，{$TargetName}！\n你的作品 {Experiment} 已经被 {Users} 评为精选实验了。精选实验会为你带来更多粉丝，你可以在首页的“精选”栏目看到所有入选的实验。\n为了表彰你对物理实验室社区的贡献，60 钻石和 500 经验奖励已经发送到你的帐户。你可以用它解锁更多元件！",
      English:
        "Congratulations, {$TargetName}!\nYour work {Experiment} has been featured by {Users}. Getting featured may bring you more followers, and we recommend you to visit more featured experiments from the homepage.\nIn order to reward your contribution to Physics Lab community, 60 Diamonds and 500 Experiences has been sent to your account. Unlock more components now!",
      ChineseTraditional:
        "祝賀你，{$TargetName}！\n你的作品 {Experiment} 已經被 {Users} 評為精選實驗了。精選實驗會為你帶來更多粉絲，你可以在首頁的“精選”欄目看到所有入選的實驗。\n為了表彰你對物理實驗室社區的貢獻，60 鑽石和 500 經驗獎勵已經發送到你的帳戶。你可以用它解鎖更多元件！",
      German:
        "Herzlichen Glückwunsch, {$TargetName}!\nIhre Arbeit {Experiment} wurde von {Users} vorgestellt. Wenn Sie vorgestellt werden, erhalten Sie möglicherweise mehr Follower. Wir empfehlen Ihnen, mehr ausgewählte Experimente auf der Homepage zu besuchen.\nUm Ihren Beitrag zur Physiklabor-Community zu belohnen, wurden 60 Diamanten und 500 Erfahrungen an Ihr Konto gesendet. Schalte jetzt mehr Komponenten frei!",
      French:
        "Félicitations, {$TargetName}!\nVotre travail {Experiment} a été présenté par {Users}. La mise en vedette peut vous apporter plus d'abonnés, et nous vous recommandons de visiter d'autres expériences en vedette sur la page d'accueil.\nAfin de récompenser votre contribution à la communauté des laboratoires de physique, 60 diamants et 500 expériences ont été envoyés à votre compte. Débloquez plus de composants maintenant!",
      Japanese:
        "おめでとう、{$TargetName}！\nあなたの作品 {Experiment} が {Users} によって特集されました。注目を集めるとフォロワー数が増える可能性があるため、ホームページから注目の実験にアクセスすることをお勧めします。\nPhysics Labコミュニティへの貢献に報いるために、60個のダイヤモンドと500個のエクスペリエンスがアカウントに送信されました。今すぐより多くのコンポーネントのロックを解除してください！",
      Italian:
        "Congratulazioni, {$TargetName}!\nIl tuo lavoro {Experiment} è stato presentato da {Users}. Essere in primo piano può portare più follower e ti consigliamo di visitare altri esperimenti in primo piano dalla home page.\nPer premiare il tuo contributo alla comunità di Physics Lab, 60 diamanti e 500 esperienze sono stati inviati al tuo account. Sblocca più componenti ora!",
      Polish:
        "Gratulacje, {$TargetName}!\nTwoja praca {Experiment} została wyróżniona przez {Users}. Polecenie może przynieść więcej obserwujących, dlatego zalecamy odwiedzanie większej liczby polecanych eksperymentów ze strony głównej.\nW celu nagrodzenia twojego wkładu w społeczność Physics Lab, 60 Diamentów i 500 Doświadczeń zostało wysłanych na twoje konto. Odblokuj więcej komponentów teraz!",
      Spanish:
        "¡Felicitaciones, {$TargetName}!\nTu trabajo {Experiment} ha sido destacado por {Users}. Ser destacado puede traerle más seguidores, y le recomendamos que visite más experimentos destacados desde la página de inicio.\nPara recompensar su contribución a la comunidad de Physics Lab, se han enviado 60 Diamantes y 500 Experiencias a su cuenta. ¡Desbloquea más componentes ahora!",
      Ukrainian:
        "Вітаємо, {$TargetName}!\nВашу роботу {Experiment} представили {Users}. Відображення може привернути до вас більше підписників, тому ми рекомендуємо вам відвідати більше рекомендованих експериментів із головної сторінки.\nЩоб винагородити ваш внесок у спільноту Physics Lab, на ваш обліковий запис було надіслано 60 діамантів і 500 вражень. Розблокуйте більше компонентів зараз!",
    },
    Description: null,
    Bonuses: {
      Diamond: 60,
      Experience: 500,
    },
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "5c9120436fd2c143b8afcad7",
    Identifier: "Content-Management-Unfeatured",
    CategoryID: 4,
    Management: true,
    Subject: {
      Chinese: "{Experiment} 被解除精选状态！",
      English: "{Experiment}'s feature status has been cancelled!",
      ChineseTraditional: "{Experiment} 被解除精選狀態！",
      German: "Der Funktionsstatus von {Experiment} wurde abgebrochen!",
      French: "Le statut de fonctionnalité de {Experiment} a été annulé!",
      Japanese: "{Experiment} の機能ステータスはキャンセルされました。",
      Italian: "Lo stato delle funzioni di {Experiment} è stato annullato!",
      Polish: "Stan funkcji {Experiment} został anulowany!",
      Spanish: "¡El estado de la función de {Experiment} ha sido cancelado!",
      Ukrainian: "Статус функції {Experiment} скасовано!",
    },
    Content: {
      Chinese: "编辑 {Users} 执行了这一操作。",
      English: "Editor {Users} did it.",
      ChineseTraditional: "編輯 {Users} 執行了這一操作。",
      German: "Der Editor {Users} hat es geschafft.",
      French: "L'éditeur {Users} l'a fait.",
      Japanese: "エディタ {Users} がやりました。",
      Italian: "L'editor {Users} l'ha fatto.",
      Polish: "Redaktor {Users} to zrobił.",
      Spanish: "El editor {Users} lo hizo.",
      Ukrainian: "Редактор {Users} зробив це.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "5c925ba2c493d936e0aec788",
    Identifier: "Experiment-Starred",
    CategoryID: 4,
    Management: false,
    Subject: {
      Chinese: "作品被人收藏了！",
      English: "Your work is starred!",
      ChineseTraditional: "作品被人收藏了！",
      German: "Ihre Arbeit ist in der Hauptrolle!",
      French: "Votre travail est mis en vedette!",
      Japanese: "あなたの作品にスターを付けました！",
      Italian: "Il tuo lavoro è protagonista!",
      Polish: "Twoja praca została oznaczona gwiazdką!",
      Spanish: "¡Tu trabajo está destacado!",
      Ukrainian: "Ваша робота позначена зірочкою!",
    },
    Content: {
      Chinese: "{Users} 收藏了你的作品 {Experiment}。",
      English: "{Users} starred your work {Experiment}.",
      ChineseTraditional: "{Users} 收藏了你的作品 {Experiment}。",
      German: "{Users} haben Ihre Arbeit mit {Experiment} markiert.",
      French: "{Users} a mis en vedette votre travail {Experiment}.",
      Japanese: "{Users} があなたの作品 {Experiment} にスターを付けました。",
      Italian: "{Users} ha recitato nel tuo lavoro {Experiment}.",
      Polish: "{Users} oznaczyli Twoją pracę gwiazdką {Experiment}.",
      Spanish: "{Users} destacó tu trabajo {Experiment}.",
      Ukrainian: "{Users} позначили зірочкою вашу роботу {Experiment}.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 10,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "5c99efbf44539c568c1a6bc8",
    Identifier: "Letter-Editor",
    CategoryID: 1,
    Management: false,
    Subject: {
      Chinese: "给认证编辑的一封信",
      English: "A letter to Editors",
      ChineseTraditional: "給認證編輯的一封信",
      German: "Ein Brief an die Redakteure",
      French: "Une lettre aux rédacteurs",
      Japanese: "編集者への手紙",
      Italian: "Una lettera agli editori",
      Polish: "List do redakcji",
      Spanish: "Una carta a los editores",
      Ukrainian: "Лист до редакції",
    },
    Content: {
      Chinese:
        "{$TargetName}，你好！\n你已经被任命为认证编辑了！现在你有权加入或移除精选实验、编辑实验内容和标签，也有权任命志愿者帮助管理社区。请加入编辑 QQ 群：661842686，方便编辑之间的交流。\n请谨慎使用你的权限，根据大家的意愿做出决定——滥用行为可能导致你失去编辑身份。",
      English:
        "Hi, {$TargetName}!\nWe warmly welcome you as a new editor! You can now feature or un-feature any experiments according to the regulations, or edit them if applicable. You are also authorized to appoint volunteers to help manage the community.\nPlease use your power with caution and make decisions based on consensus! Misuse may lead to the loss of your editorial privileges.",
      ChineseTraditional:
        "{$TargetName}，你好！\n你已經被任命為認證編輯了！現在你有權加入或移除精選實驗、編輯實驗內容和標籤，也有權任命志願者幫助管理社區。請加入編輯 QQ 群：661842686，方便編輯之間的交流。\n請謹慎使用你的權限，根據大家的意願做出決定——濫用行為可能導致你失去編輯身份。",
      German:
        "Hallo, {$TargetName}!\nWir heißen Sie als neuen Redakteur herzlich willkommen! Sie können jetzt alle Experimente gemäß den Vorschriften markieren oder deaktivieren oder sie gegebenenfalls bearbeiten. Sie sind auch berechtigt, Freiwillige zu ernennen, die bei der Verwaltung der Community helfen.\nBitte nutzen Sie Ihre Macht mit Bedacht und treffen Sie Entscheidungen im Konsens! Missbrauch kann zum Verlust Ihrer redaktionellen Rechte führen.",
      French:
        "Salut, {$TargetName} !\nNous vous souhaitons la bienvenue en tant que nouvel éditeur ! Vous pouvez désormais afficher ou supprimer toutes les expériences conformément à la réglementation, ou les modifier le cas échéant. Vous êtes également autorisé à nommer des bénévoles pour aider à gérer la communauté.\nVeuillez utiliser votre pouvoir avec prudence et prendre des décisions basées sur le consensus ! Une mauvaise utilisation peut entraîner la perte de vos privilèges éditoriaux.",
      Japanese:
        "やあ、{$TargetName}！\n新しい編集者としてあなたを温かく歓迎します!規制に従って実験を掲載または非掲載にしたり、必要に応じて編集したりできるようになりました。また、コミュニティの管理を支援するボランティアを任命する権限も与えられています。\nあなたの力を慎重に使用し、コンセンサスに基づいて決定を下してください！誤用すると、編集権限が失われる可能性があります。",
      Italian:
        "Ciao, {$TargetName}!\nTi diamo un caloroso benvenuto come nuovo editore! Ora puoi includere o rimuovere qualsiasi esperimento in base alle normative o modificarli, se applicabile. Sei anche autorizzato a nominare volontari per aiutare a gestire la comunità.\nPer favore, usa il tuo potere con cautela e prendi decisioni basate sul consenso! L'uso improprio può portare alla perdita dei tuoi privilegi editoriali.",
      Polish:
        "Cześć, {$TargetName}!\nSerdecznie witamy Cię jako nowego redaktora! Możesz teraz polecać lub anulować polecanie dowolnych eksperymentów zgodnie z przepisami lub edytować je, jeśli ma to zastosowanie. Jesteś również upoważniony do wyznaczania ochotników do pomocy w zarządzaniu społecznością.\nProsimy o rozważne korzystanie ze swojej władzy i podejmowanie decyzji w oparciu o konsensus! Niewłaściwe użycie może prowadzić do utraty uprawnień redakcyjnych.",
      Spanish:
        "¡Hola, {$TargetName}!\n¡Le damos una calurosa bienvenida como nuevo editor! Ahora puede destacar o dejar de destacar cualquier experimento de acuerdo con las regulaciones, o editarlos si corresponde. También está autorizado a nombrar voluntarios para ayudar a administrar la comunidad.\n¡Utilice su poder con precaución y tome decisiones basadas en el consenso! El mal uso puede conducir a la pérdida de sus privilegios editoriales.",
      Ukrainian:
        "Привіт, {$TargetName}!\nМи щиро вітаємо вас як нового редактора! Тепер ви можете вказувати або вимикати будь-які експерименти відповідно до правил або редагувати їх, якщо це можливо. Ви також маєте право призначати волонтерів для допомоги в управлінні спільнотою.\nБудь ласка, обережно використовуйте свої повноваження та приймайте рішення на основі консенсусу! Зловживання може призвести до втрати ваших редакційних привілеїв.",
    },
    Description: null,
    Bonuses: {
      Diamond: 300,
      Experience: 2000,
    },
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "5c9c955b82349b3cecdbc77c",
    Identifier: "Content-Management-Hidden",
    CategoryID: 4,
    Management: true,
    Subject: {
      Chinese: "{Experiment} 被隐藏了。",
      English: "{Experiment} has been made hidden.",
      ChineseTraditional: "{Experiment} 被隱藏了。",
      German: "{Experiment} wurde ausgeblendet.",
      French: "{Experiment} a été caché.",
      Japanese: "{Experiment} は非表示にされました。",
      Italian: "{Experiment} è stato reso nascosto.",
      Polish: "{Experiment} został ukryty.",
      Spanish: "{Experiment} se ha ocultado.",
      Ukrainian: "{Experiment} приховано.",
    },
    Content: {
      Chinese: "管理人员 {Users} 执行了这一操作。请注意不要发布可能违反法律法规或涉嫌抄袭的内容。",
      English:
        "Editor {Users} did it. Please don't release any experiment that violate laws, regulations or involve plagiarism.",
      ChineseTraditional:
        "管理人員 {Users} 執行了這一操作。請注意不要發布可能違反法律法規或涉嫌抄襲的內容。",
      German:
        "Der Editor {Users} hat es geschafft. Bitte lassen Sie keine Experimente frei, die gegen Gesetze, Vorschriften oder Plagiate verstoßen.",
      French:
        "L'éditeur {Users} l'a fait. S'il vous plaît, ne publiez aucune expérience qui enfreindrait les lois, les réglementations ou le plagiat.",
      Japanese:
        "エディタ {Users} がやりました。法律、規制に違反する、または盗作を含むような実験は公開しないでください。",
      Italian:
        "L'editor {Users} l'ha fatto. Si prega di non rilasciare alcun esperimento che violi le leggi, i regolamenti o implichi il plagio.",
      Polish:
        "Redaktor {Users} to zrobił. Prosimy nie publikować żadnych eksperymentów, które naruszają przepisy, regulacje lub wiążą się z plagiatem.",
      Spanish:
        "El editor {Users} lo hizo. Por favor, no publique ningún experimento que viole las leyes, regulaciones o implique plagio.",
      Ukrainian:
        "Редактор {Users} зробив це. Будь ласка, не публікуйте експерименти, які порушують закони, правила або містять плагіат.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "5ca8a56f3707367078f962ce",
    Identifier: "Comment-At-Experiment",
    CategoryID: 3,
    Management: false,
    Subject: {
      Chinese: "{Users} 在 {Experiment} 中提到了你。",
      English: "{Users} mentioned you in {Experiment}.",
      ChineseTraditional: "{Users} 在 {Experiment} 中提到了你。",
      German: "{Users} hat Sie in {Experiment} erwähnt.",
      French: "{Users} vous a mentionné dans {Experiment}.",
      Japanese: "{Users} が {Experiment} であなたのことを言っています。",
      Italian: "{Users} ti ha menzionato in {Experiment}.",
      Polish: "{Users} wspomnieli o Tobie w {Experiment}.",
      Spanish: "{Users} te mencionó en {Experiment}.",
      Ukrainian: "{Users} згадали вас в {Experiment}.",
    },
    Content: {
      Chinese: "{$Content}",
      English: "{$Content}",
      ChineseTraditional: "{$Content}",
      German: "{$Content}",
      French: "{$Content}",
      Japanese: "{$Content}",
      Italian: "{$Content}",
      Polish: "{$Content}",
      Spanish: "{$Content}",
      Ukrainian: "{$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "5ca8a56f3707367078f962cf",
    Identifier: "Comment-At-Comment",
    CategoryID: 3,
    Management: false,
    Subject: {
      Chinese: "{Users} 在评论中提到了你。",
      English: "{Users} mentioned you in comment.",
      ChineseTraditional: "{Users} 在評論中提到了你。",
      German: "{Users} haben Sie in einem Kommentar erwähnt.",
      French: "{Users} vous a mentionné dans un commentaire.",
      Japanese: "{Users} からコメントがありました。",
      Italian: "{Users} ti ha menzionato nel commento.",
      Polish: "{Users} wspomnieli o Tobie w komentarzu.",
      Spanish: "{Users} te mencionaron en un comentario.",
      Ukrainian: "{Users} згадали вас у коментарі.",
    },
    Content: {
      Chinese: "{$Content}",
      English: "{$Content}",
      ChineseTraditional: "{$Content}",
      German: "{$Content}",
      French: "{$Content}",
      Japanese: "{$Content}",
      Italian: "{$Content}",
      Polish: "{$Content}",
      Spanish: "{$Content}",
      Ukrainian: "{$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: "ShowComment",
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "5ce0092a64f5021d74bed1fd",
    Identifier: "Comment-Experiment",
    CategoryID: 3,
    Management: false,
    Subject: {
      Chinese: "{Users} 评论了你的 {Experiment}。",
      English: "{Users} commented on your {Experiment}.",
      ChineseTraditional: "{Users} 評論了你的 {Experiment}。",
      German: "{Users} hat Ihr {Experiment} kommentiert.",
      French: "{Users} ont commenté votre {Experiment}.",
      Japanese: "{Users} があなたの {Experiment} にコメントしました。",
      Italian: "{Users} ha commentato il tuo {Experiment}.",
      Polish: "{Users} skomentowali Twój {Experiment}.",
      Spanish: "{Users} comentaron su {Experiment}.",
      Ukrainian: "{Users} прокоментували ваш {Experiment}.",
    },
    Content: {
      Chinese: "{$Content}",
      English: "{$Content}",
      ChineseTraditional: "{$Content}",
      German: "{$Content}",
      French: "{$Content}",
      Japanese: "{$Content}",
      Italian: "{$Content}",
      Polish: "{$Content}",
      Spanish: "{$Content}",
      Ukrainian: "{$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: "ShowComment",
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "5ce0092c64f5021d74bed1fe",
    Identifier: "Comment-User",
    CategoryID: 3,
    Management: false,
    Subject: {
      Chinese: "{Users} 在你的主页留言了。",
      English: "{Users} commented on your homepage.",
      ChineseTraditional: "{Users} 在你的主頁留言了。",
      German: "{Users} hat Ihre Homepage kommentiert.",
      French: "{Users} ont commenté sur votre page d'accueil.",
      Japanese: "{Users} があなたのホームページにコメントしました。",
      Italian: "{Users} ha commentato la tua home page.",
      Polish: "{Users} skomentowali Twoją stronę główną.",
      Spanish: "{Users} comentaron en su página de inicio.",
      Ukrainian: "{Users} прокоментували вашу домашню сторінку.",
    },
    Content: {
      Chinese: "{$Content}",
      English: "{$Content}",
      ChineseTraditional: "{$Content}",
      German: "{$Content}",
      French: "{$Content}",
      Japanese: "{$Content}",
      Italian: "{$Content}",
      Polish: "{$Content}",
      Spanish: "{$Content}",
      Ukrainian: "{$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: "ShowComment",
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "5ce0092f64f5021d74bed1ff",
    Identifier: "Comment-Replied",
    CategoryID: 3,
    Management: false,
    Subject: {
      Chinese: "{Users} 回复了你的评论。",
      English: "{Users} replied your comment.",
      ChineseTraditional: "{Users} 回復了你的評論。",
      German: "{Users} hat auf Ihren Kommentar geantwortet.",
      French: "{Users} a répondu à votre commentaire.",
      Japanese: "{Users} からあなたのコメントが返信されました。",
      Italian: "{Users} ha risposto al tuo commento.",
      Polish: "{Users} odpowiedzieli na Twój komentarz.",
      Spanish: "{Users} respondieron tu comentario.",
      Ukrainian: "{Users} відповіли на ваш коментар.",
    },
    Content: {
      Chinese: "{$Content}",
      English: "{$Content}",
      ChineseTraditional: "{$Content}",
      German: "{$Content}",
      French: "{$Content}",
      Japanese: "{$Content}",
      Italian: "{$Content}",
      Polish: "{$Content}",
      Spanish: "{$Content}",
      Ukrainian: "{$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: "ShowComment",
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "5d57f3be39523f0f640c220f",
    Identifier: "User-Banned",
    CategoryID: 2,
    Management: true,
    Subject: {
      Chinese: "编辑 {Users} 暂停你的社区权限到 {$Until}。",
      English: "Editor {Users} suspended your community rights until {$Until}.",
      ChineseTraditional: "編輯 {Users} 暫停你的社區權限到 {$Until}。",
      German: "Der Editor {Users} hat Ihre Community-Rechte bis zum {$Until} gesperrt.",
      French: "L'éditeur {Users} a suspendu vos droits de communauté jusqu'au {$Until}.",
      Japanese: "編集者 {Users} は、コミュニティの権利を {$Until} まで停止しました。",
      Italian: "L'editor {Users} ha sospeso i diritti della tua comunità fino a {$Until}.",
      Polish: "Redaktor {Users} zawiesił Twoje prawa społeczności do {$ Until}.",
      Spanish: "El editor {Users} suspendió sus derechos comunitarios hasta el {$ Hasta}.",
      Ukrainian: "Редактор {Users} призупинив ваші права спільноти до {$Until}.",
    },
    Content: {
      Chinese: "{$Content}",
      English: "{$Content}",
      ChineseTraditional: "{$Content}",
      German: "{$Content}",
      French: "{$Content}",
      Japanese: "{$Content}",
      Italian: "{$Content}",
      Polish: "{$Content}",
      Spanish: "{$Content}",
      Ukrainian: "{$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "5d57f3bf39523f0f640c2210",
    Identifier: "User-Unbanned",
    CategoryID: 2,
    Management: true,
    Subject: {
      Chinese: "编辑 {Users} 恢复了你的社区权限。",
      English: "Editor {Users} restored your community rights.",
      ChineseTraditional: "編輯 {Users} 恢復了你的社區權限。",
      German: "Der Editor {Users} hat Ihre Community-Rechte wiederhergestellt.",
      French: "L'éditeur {Users} a restauré vos droits de communauté.",
      Japanese: "編集者 {Users} がコミュニティの権利を回復しました。",
      Italian: "L'editor {Users} ha ripristinato i diritti della community.",
      Polish: "Redaktor {Users} przywrócił Twoje prawa społeczności.",
      Spanish: "El editor {Users} restauró sus derechos de comunidad.",
      Ukrainian: "Редактор {Users} відновив ваші права спільноти.",
    },
    Content: {
      Chinese: "{$Content}",
      English: "{$Content}",
      ChineseTraditional: "{$Content}",
      German: "{$Content}",
      French: "{$Content}",
      Japanese: "{$Content}",
      Italian: "{$Content}",
      Polish: "{$Content}",
      Spanish: "{$Content}",
      Ukrainian: "{$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "5d57f3c139523f0f640c2211",
    Identifier: "User-Banned-Record",
    CategoryID: 5,
    Management: true,
    Subject: {
      Chinese: "{Users} 的社区权限被暂停到 {$Until}。",
      English: "{Users}'s community rights are suspended until {$Until}.",
      ChineseTraditional: "{Users} 的社區權限被暫停到 {$Until}。",
      German: "Die Community-Rechte von {Users} werden ausgesetzt, bis {$Until}.",
      French: "Les droits de communauté de {Users} sont suspendus jusqu'au {$Until}.",
      Japanese: "{Users} のコミュニティの権利は {$Until} まで停止されます。",
      Italian: "I diritti della community di {Users} sono sospesi fino al {$Until}.",
      Polish: "Prawa społeczności użytkownika {Users} są zawieszone do {$ Do}.",
      Spanish: "Los derechos de la comunidad de {Users} están suspendidos hasta el {$ Hasta}.",
      Ukrainian: "Права спільноти {Users} призупинено до {$Until}.",
    },
    Content: {
      Chinese: "@{$Editor}: {$Content}",
      English: "@{$Editor}: {$Content}",
      ChineseTraditional: "@{$Editor}: {$Content}",
      German: "@{$Editor}: {$Content}",
      French: "@{$Editor}: {$Content}",
      Japanese: "@{$Editor}: {$Content}",
      Italian: "@{$Editor}: {$Content}",
      Polish: "@{$Editor}: {$Content}",
      Spanish: "@{$Editor}: {$Content}",
      Ukrainian: "@{$Editor}: {$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "5d57f3c239523f0f640c2212",
    Identifier: "User-Unbanned-Record",
    CategoryID: 5,
    Management: true,
    Subject: {
      Chinese: "{Users} 的社区权限被恢复。",
      English: "{Users}'s community rights are restored.",
      ChineseTraditional: "{Users} 的社區權限被恢復。",
      German: "Die Community-Rechte von {Users} werden wiederhergestellt.",
      French: "Les droits de communauté de {Users} sont restaurés.",
      Japanese: "{Users} のコミュニティの権利が復元されます。",
      Italian: "I diritti della community di {Users} sono stati ripristinati.",
      Polish: "Prawa wspólnoty {Users} zostały przywrócone.",
      Spanish: "Se restauran los derechos de la comunidad de {Users}.",
      Ukrainian: "Права спільноти {Users} відновлено.",
    },
    Content: {
      Chinese: "@{$Editor}: {$Content}",
      English: "@{$Editor}: {$Content}",
      ChineseTraditional: "@{$Editor}: {$Content}",
      German: "@{$Editor}: {$Content}",
      French: "@{$Editor}: {$Content}",
      Japanese: "@{$Editor}: {$Content}",
      Italian: "@{$Editor}: {$Content}",
      Polish: "@{$Editor}: {$Content}",
      Spanish: "@{$Editor}: {$Content}",
      Ukrainian: "@{$Editor}: {$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "5db3d033fafb810fe0fca8b1",
    Identifier: "User-Unbanned-Automatic",
    CategoryID: 2,
    Management: true,
    Subject: {
      Chinese: "你的社区权限已被自动恢复。",
      English: "Your community rights have been automatically restored.",
      ChineseTraditional: "你的社區權限已被自動恢復。",
      German: "Ihre Community-Rechte wurden automatisch wiederhergestellt.",
      French: "Vos droits de communauté ont été restaurés automatiquement.",
      Japanese: "コミュニティの権利は自動的に復元されました。",
      Italian: "I diritti della tua comunità sono stati ripristinati automaticamente.",
      Polish: "Twoje prawa społeczności zostały automatycznie przywrócone.",
      Spanish: "Sus derechos comunitarios se han restaurado automáticamente.",
      Ukrainian: "Ваші права спільноти були автоматично відновлені.",
    },
    Content: {
      Chinese: "{$Content}",
      English: "{$Content}",
      ChineseTraditional: "{$Content}",
      German: "{$Content}",
      French: "{$Content}",
      Japanese: "{$Content}",
      Italian: "{$Content}",
      Polish: "{$Content}",
      Spanish: "{$Content}",
      Ukrainian: "{$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "5e102f4499c5b93b10bbbd7f",
    Identifier: "Content-Management-Modified",
    CategoryID: 3,
    Management: true,
    Subject: {
      Chinese: "管理人员 {Users} 调整了你的实验。",
      English: "Editor {Users} modified your experiment.",
      ChineseTraditional: "管理人員 {Users} 調整了你的實驗。",
      German: "Der Editor {Users} hat Ihr Experiment geändert.",
      French: "L'éditeur {Users} a modifié votre test.",
      Japanese: "編集者 {Users} が実験を変更しました。",
      Italian: "L'editor {Users} ha modificato il tuo esperimento.",
      Polish: "Redaktor {Users} zmodyfikował Twój eksperyment.",
      Spanish: "El editor {Users} modificó su experimento.",
      Ukrainian: "Редактор {Users} змінив ваш експеримент.",
    },
    Content: {
      Chinese: "如果你认为对 {Experiment} 的编辑不适当，请与管理人员联系。",
      English:
        "If you feel the modification on {Experiment} isn't appropriate, please contact the editor.",
      ChineseTraditional: "如果你認為對 {Experiment} 的編輯不適當，請與管理人員聯繫。",
      German:
        "Wenn Sie der Meinung sind, dass die Änderung in {Experiment} nicht angemessen ist, wenden Sie sich an den Herausgeber.",
      French:
        "Si vous pensez que la modification de {Experiment} n'est pas appropriée, veuillez contacter l'éditeur.",
      Japanese: "{Experiment} の変更が適切でないと思われる場合は、編集者にお問い合わせください。",
      Italian: "Se ritieni che la modifica di {Experiment} non sia appropriata, contatta l'editor.",
      Polish:
        "Jeśli uważasz, że modyfikacja w {Experiment} nie jest odpowiednia, skontaktuj się z redaktorem.",
      Spanish:
        "Si cree que la modificación en {Experiment} no es apropiada, comuníquese con el editor.",
      Ukrainian:
        "Якщо ви вважаєте, що модифікація {Experiment} не підходить, зв’яжіться з редактором.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "5e1634ef42f76f2f3c6c2967",
    Identifier: "Content-Management-Moved-Discussion",
    CategoryID: 4,
    Management: true,
    Subject: {
      Chinese: "{Experiment} 被移动到黑洞区！",
      English: "{Experiment} has been moved to Discussions!",
      ChineseTraditional: "{Experiment} 被移動到黑洞區！",
      German: "{Experiment} wurde in Diskussionen verschoben!",
      French: "{Expérience} a été déplacé vers les discussions!",
      Japanese: "{Experiment}はディスカッションに移動しました！",
      Italian: "{Experiment} è stato spostato in Discussioni!",
      Polish: "{Experiment} został przeniesiony do Dyskusji!",
      Spanish: "{Experiment} se ha movido a Discusiones.",
      Ukrainian: "{Experiment} переміщено в Обговорення!",
    },
    Content: {
      Chinese: "管理人员 {Users} 执行了这一操作。",
      English: "Editor {Users} did it.",
      ChineseTraditional: "管理人員 {Users} 執行了這一操作。",
      German: "Editor {Users} hat es geschafft.",
      French: "Le rédacteur {Users} l'a fait.",
      Japanese: "編集者 {Users} がやった。",
      Italian: "L'editore {Users} lo ha fatto.",
      Polish: "Redaktor {Users} to zrobił.",
      Spanish: "El editor {Users} lo hizo.",
      Ukrainian: "Редактор {Users} зробив це.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "5e1634f242f76f2f3c6c2968",
    Identifier: "Content-Management-Moved-Experiment",
    CategoryID: 4,
    Management: true,
    Subject: {
      Chinese: "{Experiment} 被移动到实验区！",
      English: "{Experiment} has been moved to Experiments!",
      ChineseTraditional: "{Experiment} 被移動到實驗區！",
      German: "{Experiment} wurde zu Experimente verschoben!",
      French: "{Experiment} a été déplacé vers Tests !",
      Japanese: "{Experiment}はExperimentsに移動しました！",
      Italian: "{Experiment} è stato spostato in Esperimenti!",
      Polish: "{Experiment} został przeniesiony do eksperymentów!",
      Spanish: "¡{Experiment} se ha movido a Experimentos!",
      Ukrainian: "{Experiment} переміщено в Експерименти!",
    },
    Content: {
      Chinese: "管理人员 {Users} 执行了这一操作。",
      English: "Editor {Users} did it.",
      ChineseTraditional: "管理人員 {Users} 執行了這一操作。",
      German: "Editor {Users} hat es geschafft.",
      French: "Le rédacteur {Users} l'a fait.",
      Japanese: "編集者 {Users} がやった。",
      Italian: "L'editore {Users} lo ha fatto.",
      Polish: "Redaktor {Users} to zrobił.",
      Spanish: "El editor {Users} lo hizo.",
      Ukrainian: "Редактор {Users} зробив це.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "5e17c3b3dc48bb4e58b2be9d",
    Identifier: "Experiment-Liked",
    CategoryID: 4,
    Management: false,
    Subject: {
      Chinese: "作品被人点赞了！",
      English: "Your work is liked!",
      ChineseTraditional: "作品被人點讚了！",
      German: "Ihre Arbeit wird gemocht!",
      French: "Votre travail est aimé!",
      Japanese: "あなたの作品が好きです！",
      Italian: "Il tuo lavoro è piaciuto!",
      Polish: "Twoja praca jest lubiana!",
      Spanish: "¡Tu trabajo ha gustado!",
      Ukrainian: "Ваша робота сподобалась!",
    },
    Content: {
      Chinese: "{Users} 点赞了你的作品 {Experiment}，并且带来了 {$Gold} 金币收入！",
      English: "{Users} starred your work {Experiment}, which brings you {$Gold} gold!",
      ChineseTraditional: "{Users} 點讚了你的作品 {Experiment}，並且帶來了 {$Gold} 金幣收入！",
      German:
        "{Users} hat Ihre Arbeit {Experiment} in der Hauptrolle gespielt, was Ihnen {$Gold} Gold bringt!",
      French:
        "{Users} a mis en vedette votre travail {Experiment}, ce qui vous apporte {$Gold} or!",
      Japanese:
        "{Users} があなたの作品 {Experiment} にスターを付け、{$Gold} ゴールドを獲得しました！",
      Italian: "{Users} ha recitato nel tuo lavoro {Experiment}, che ti porta {$Gold} oro!",
      Polish: "{Users} oznaczyli twoją pracę {Experiment} gwiazdką, co daje Ci {$Gold} złota!",
      Spanish: "{Users} destacó tu trabajo {Experiment}, ¡lo que te trae {$Gold} oro!",
      Ukrainian: "{Users} позначили вашу роботу {Experiment}, яка принесла вам {$Gold} золота!",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 10,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "5ed6d3cbe5654e0ec0d0ed77",
    Identifier: "Appointment-Volunteer",
    CategoryID: 2,
    Management: false,
    Subject: {
      Chinese: "{Users} 被任命为志愿者！",
      English: "{Users} was appointed as a volunteer!",
      ChineseTraditional: "{Users} 被任命為志願者！",
      German: "{Users} wurde als Freiwilliger ernannt!",
      French: "{Users} a été nommé bénévole!",
      Japanese: "{Users} がボランティアとして任命されました！",
      Italian: "{Users} è stato nominato volontario!",
      Polish: "{Users} został wyznaczony jako wolontariusz!",
      Spanish: "¡{Users} fue nombrado voluntario!",
      Ukrainian: "{Users} призначено волонтером!",
    },
    Content: {
      Chinese: "@{$Editor}: {$Content}",
      English: "@{$Editor}: {$Content}",
      ChineseTraditional: "@{$Editor}: {$Content}",
      German: "@{$Editor}: {$Content}",
      French: "@{$Editor}: {$Content}",
      Japanese: "@{$Editor}: {$Content}",
      Italian: "@{$Editor}: {$Content}",
      Polish: "@{$Editor}: {$Content}",
      Spanish: "@{$Editor}: {$Content}",
      Ukrainian: "@{$Editor}: {$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "5ed6d3cce5654e0ec0d0ed78",
    Identifier: "Dismissal-Volunteer",
    CategoryID: 2,
    Management: false,
    Subject: {
      Chinese: "{Users} 被解除志愿者身份！",
      English: "{Users} was dismissed as a volunteer!",
      ChineseTraditional: "{Users} 被解除志願者身份！",
      German: "{Users} wurde als Freiwilliger entlassen!",
      French: "{Users} a été licencié en tant que bénévole!",
      Japanese: "{Users} はボランティアとして解任されました！",
      Italian: "{Users} è stato licenziato come volontario!",
      Polish: "{Users} został zwolniony jako ochotnik!",
      Spanish: "¡{Users} fue despedido como voluntario!",
      Ukrainian: "{Users} був звільнений як волонтер!",
    },
    Content: {
      Chinese: "@{$Editor}: {$Content}",
      English: "@{$Editor}: {$Content}",
      ChineseTraditional: "@{$Editor}: {$Content}",
      German: "@{$Editor}: {$Content}",
      French: "@{$Editor}: {$Content}",
      Japanese: "@{$Editor}: {$Content}",
      Italian: "@{$Editor}: {$Content}",
      Polish: "@{$Editor}: {$Content}",
      Spanish: "@{$Editor}: {$Content}",
      Ukrainian: "@{$Editor}: {$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "5ed6d3cde5654e0ec0d0ed79",
    Identifier: "Appointment-Junior",
    CategoryID: 2,
    Management: false,
    Subject: {
      Chinese: "{Users} 被任命为见习编辑！",
      English: "{Users} was appointed as a junior editor!",
      ChineseTraditional: "{Users} 被任命為見習編輯！",
      German: "{Users} wurde zum Junior Editor ernannt!",
      French: "{Users} a été nommé rédacteur junior!",
      Japanese: "{Users} がジュニアエディターに任命されました。",
      Italian: "{Users} è stato nominato editor junior!",
      Polish: "{Users} został mianowany młodszym redaktorem!",
      Spanish: "¡{Users} fue nombrado editor junior!",
      Ukrainian: "{Users} призначено молодшим редактором!",
    },
    Content: {
      Chinese: "@{$Editor}: {$Content}",
      English: "@{$Editor}: {$Content}",
      ChineseTraditional: "@{$Editor}: {$Content}",
      German: "@{$Editor}: {$Content}",
      French: "@{$Editor}: {$Content}",
      Japanese: "@{$Editor}: {$Content}",
      Italian: "@{$Editor}: {$Content}",
      Polish: "@{$Editor}: {$Content}",
      Spanish: "@{$Editor}: {$Content}",
      Ukrainian: "@{$Editor}: {$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "5ed6d3cde5654e0ec0d0ed7a",
    Identifier: "Dismissal-Junior",
    CategoryID: 2,
    Management: false,
    Subject: {
      Chinese: "{Users} 被解除见习编辑身份！",
      English: "{Users} was dismissed as a junior editor!",
      ChineseTraditional: "{Users} 被解除見習編輯身份！",
      German: "{Users} wurde als Junior Editor entlassen!",
      French: "{Users} a été licencié en tant que rédacteur junior!",
      Japanese: "{Users} はジュニアエディターとして解任されました！",
      Italian: "{Users} è stato licenziato come editore junior!",
      Polish: "{Users} został zwolniony jako młodszy redaktor!",
      Spanish: "¡{Users} fue despedido como editor junior!",
      Ukrainian: "{Users} звільнено з посади молодшого редактора!",
    },
    Content: {
      Chinese: "@{$Editor}: {$Content}",
      English: "@{$Editor}: {$Content}",
      ChineseTraditional: "@{$Editor}: {$Content}",
      German: "@{$Editor}: {$Content}",
      French: "@{$Editor}: {$Content}",
      Japanese: "@{$Editor}: {$Content}",
      Italian: "@{$Editor}: {$Content}",
      Polish: "@{$Editor}: {$Content}",
      Spanish: "@{$Editor}: {$Content}",
      Ukrainian: "@{$Editor}: {$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "5ed6d3cee5654e0ec0d0ed7b",
    Identifier: "Appointment-Editor",
    CategoryID: 2,
    Management: false,
    Subject: {
      Chinese: "{Users} 被任命为正式编辑！",
      English: "{Users} was appointed as an editor!",
      ChineseTraditional: "{Users} 被任命為正式編輯！",
      German: "{Users} wurde zum Editor ernannt!",
      French: "{Users} a été nommé éditeur!",
      Japanese: "{Users} が編集者に任命されました！",
      Italian: "{Users} è stato nominato editore!",
      Polish: "{Users} został wyznaczony na redaktora!",
      Spanish: "¡{Users} fue nombrado editor!",
      Ukrainian: "{Users} призначено редактором!",
    },
    Content: {
      Chinese: "@{$Editor}: {$Content}",
      English: "@{$Editor}: {$Content}",
      ChineseTraditional: "@{$Editor}: {$Content}",
      German: "@{$Editor}: {$Content}",
      French: "@{$Editor}: {$Content}",
      Japanese: "@{$Editor}: {$Content}",
      Italian: "@{$Editor}: {$Content}",
      Polish: "@{$Editor}: {$Content}",
      Spanish: "@{$Editor}: {$Content}",
      Ukrainian: "@{$Editor}: {$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "5ed6d3cfe5654e0ec0d0ed7c",
    Identifier: "Dismissal-Editor",
    CategoryID: 2,
    Management: false,
    Subject: {
      Chinese: "{Users} 被解除编辑身份！",
      English: "{Users} was dismissed as an editor!",
      ChineseTraditional: "{Users} 被解除編輯身份！",
      German: "{Users} wurde als Editor entlassen!",
      French: "{Users} a été révoqué en tant qu'éditeur!",
      Japanese: "{Users} は編集者として解任されました！",
      Italian: "{Users} è stato licenziato come editore!",
      Polish: "{Users} został odrzucony jako redaktor!",
      Spanish: "¡{Users} fue despedido como editor!",
      Ukrainian: "{Users} звільнено з посади редактора!",
    },
    Content: {
      Chinese: "@{$Editor}: {$Content}",
      English: "@{$Editor}: {$Content}",
      ChineseTraditional: "@{$Editor}: {$Content}",
      German: "@{$Editor}: {$Content}",
      French: "@{$Editor}: {$Content}",
      Japanese: "@{$Editor}: {$Content}",
      Italian: "@{$Editor}: {$Content}",
      Polish: "@{$Editor}: {$Content}",
      Spanish: "@{$Editor}: {$Content}",
      Ukrainian: "@{$Editor}: {$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "5ed6d3d5e5654e0ec0d0ed7d",
    Identifier: "Letter-Junior",
    CategoryID: 1,
    Management: false,
    Subject: {
      Chinese: "给见习编辑的一封信",
      English: "A letter to Junior Editors",
      ChineseTraditional: "給見習編輯的一封信",
      German: "Ein Brief an Junior Editors",
      French: "Une lettre aux rédacteurs en chef juniors",
      Japanese: "ジュニア編集者への手紙",
      Italian: "Una lettera ai redattori junior",
      Polish: "List do młodszych redaktorów",
      Spanish: "Una carta a los editores junior",
      Ukrainian: "Лист молодшим редакторам",
    },
    Content: {
      Chinese:
        "{$TargetName}，你好！\n你已经被任命为见习编辑了！现在你有权加入或移除精选实验、编辑实验标签。请加入编辑 QQ 群：661842686，方便编辑之间的交流。\n请谨慎使用你的权限，根据大家的意愿做出决定——滥用行为可能导致你失去编辑身份。如果你长期不进行管理活动，也可能自动失去身份。",
      English:
        "Hi, {$TargetName}!\nWe warmly welcome you as a new junior editor! You can now feature or un-feature any projects according to the regulations. You may also re-tag or edit the projects to help organize the community. You may also ban users with inappropriate behaviors.\nPlease use your power with caution and make decisions based on consensus! Misuse may lead to the loss of your editorial privileges. If you are inactive for too long, you might lose them as well.",
      ChineseTraditional:
        "{$TargetName}，你好！\n你已經被任命為見習編輯了！現在你有權加入或移除精選實驗、編輯實驗標籤。請加入編輯 QQ 群：661842686，方便編輯之間的交流。\n請謹慎使用你的權限，根據大家的意願做出決定——濫用行為可能導致你失去編輯身份。如果你長期不進行管理活動，也可能自動失去身份。",
      German:
        "Hallo, {$TargetName}!\nWir heißen Sie als neuen Nachwuchsredakteur herzlich willkommen! Sie können jetzt alle Projekte gemäß den Vorschriften hervorheben oder deaktivieren. Sie können die Projekte auch neu taggen oder bearbeiten, um die Organisation der Community zu unterstützen. Sie können auch Benutzer mit unangemessenem Verhalten sperren.\nBitte nutzen Sie Ihre Macht mit Bedacht und treffen Sie Entscheidungen im Konsens! Missbrauch kann zum Verlust Ihrer redaktionellen Rechte führen. Wenn Sie zu lange inaktiv sind, können Sie sie auch verlieren.",
      French:
        "Salut, {$TargetName} !\nNous vous souhaitons la bienvenue en tant que nouvel éditeur junior ! Vous pouvez désormais afficher ou supprimer n'importe quel projet conformément à la réglementation. Vous pouvez également renommer ou modifier les projets pour aider à organiser la communauté. Vous pouvez également bannir les utilisateurs ayant des comportements inappropriés.\nVeuillez utiliser votre pouvoir avec prudence et prendre des décisions basées sur le consensus ! Une mauvaise utilisation peut entraîner la perte de vos privilèges éditoriaux. Si vous êtes inactif trop longtemps, vous risquez également de les perdre.",
      Japanese:
        "やあ、{$TargetName}！\n新しいジュニアエディターとしてあなたを温かく歓迎します!規制に従って、プロジェクトを取り上げたり取り上げたりすることができるようになりました。コミュニティを整理するために、プロジェクトを再タグ付けまたは編集することもできます。不適切な行動をしているユーザーを禁止することもできます。\nあなたの力を慎重に使用し、コンセンサスに基づいて決定を下してください！誤用すると、編集権限が失われる可能性があります。あまりにも長い間アクティブでない場合、それらも失う可能性があります。",
      Italian:
        "Ciao, {$TargetName}!\nTi diamo un caloroso benvenuto come nuovo redattore junior! Ora puoi mettere in evidenza o rimuovere qualsiasi progetto in base alle normative. Puoi anche ri-taggare o modificare i progetti per aiutare a organizzare la comunità. Puoi anche bannare gli utenti con comportamenti inappropriati.\nPer favore, usa il tuo potere con cautela e prendi decisioni basate sul consenso! L'uso improprio può portare alla perdita dei tuoi privilegi editoriali. Se rimani inattivo per troppo tempo, potresti perderli anche tu.",
      Polish:
        "Cześć, {$TargetName}!\nSerdecznie witamy Cię jako nowego młodszego redaktora! Możesz teraz wyróżniać lub anulować polecanie dowolnych projektów zgodnie z przepisami. Możesz także ponownie otagować lub edytować projekty, aby pomóc zorganizować społeczność. Możesz także blokować użytkowników, którzy zachowują się nieodpowiednio.\nProsimy o rozważne korzystanie ze swojej władzy i podejmowanie decyzji w oparciu o konsensus! Niewłaściwe użycie może prowadzić do utraty uprawnień redakcyjnych. Jeśli jesteś nieaktywny przez zbyt długi czas, możesz je również stracić.",
      Spanish:
        "¡Hola, {$TargetName}!\n¡Le damos una calurosa bienvenida como nuevo editor junior! Ahora puede destacar o dejar de destacar cualquier proyecto de acuerdo con las regulaciones. También puede volver a etiquetar o editar los proyectos para ayudar a organizar la comunidad. También puede prohibir a los usuarios con comportamientos inapropiados.\n¡Utilice su poder con precaución y tome decisiones basadas en el consenso! El mal uso puede conducir a la pérdida de sus privilegios editoriales. Si está inactivo durante demasiado tiempo, es posible que también los pierda.",
      Ukrainian:
        "Привіт, {$TargetName}!\nЩиро вітаємо Вас як нового молодшого редактора! Тепер ви можете відображати або скасовувати будь-які проекти відповідно до правил. Ви також можете змінити теги або відредагувати проекти, щоб допомогти організувати спільноту. Ви також можете заблокувати користувачів із неприйнятною поведінкою.\nБудь ласка, обережно використовуйте свої повноваження та приймайте рішення на основі консенсусу! Зловживання може призвести до втрати ваших редакційних привілеїв. Якщо ви надто довго неактивні, ви також можете втратити їх.",
    },
    Description: null,
    Bonuses: {
      Diamond: 120,
      Experience: 1000,
    },
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "5ed6d3d6e5654e0ec0d0ed7e",
    Identifier: "Letter-Volunteer",
    CategoryID: 1,
    Management: false,
    Subject: {
      Chinese: "给志愿者的一封信",
      English: "A letter to Volunteers",
      ChineseTraditional: "給志願者的一封信",
      German: "Ein Brief an die Freiwilligen",
      French: "Une lettre aux volontaires",
      Japanese: "ボランティアへの手紙",
      Italian: "Una lettera ai volontari",
      Polish: "List do wolontariuszy",
      Spanish: "Una carta a los voluntarios",
      Ukrainian: "Лист до волонтерів",
    },
    Content: {
      Chinese:
        "{$TargetName}，你好！\n你已被任命为志愿者了！请加入志愿者 QQ 群：454352857，方便进行交流。\n现在你有权移动实验到不同分区。请谨慎使用你的权限——滥用行为可能导致你失去志愿者身份。如果你长期不进行管理活动，也可能自动失去身份。",
      English:
        "Hi, {$TargetName}!\nWe warmly welcome you as a new volunteer. You can now move contents to experiments or the Black Hole to help organize the community.\nPlease use your power with caution! Any misuse may lead to the loss of your editorial privileges. If you are inactive for too long, you might lose them as well.",
      ChineseTraditional:
        "{$TargetName}，你好！\n你已被任命為志願者了！請加入志願者 QQ 群：454352857，方便進行交流。\n現在你有權移動實驗到不同分區。請謹慎使用你的權限——濫用行為可能導致你失去志願者身份。如果你長期不進行管理活動，也可能自動失去身份。",
      German:
        "Hallo, {$TargetName}!\nWir heißen Sie als neuen Freiwilligen herzlich willkommen. Sie können jetzt Inhalte in Experimente oder das Schwarze Loch verschieben, um die Organisation der Community zu unterstützen.\nBitte verwenden Sie Ihre Macht mit Vorsicht! Jeglicher Missbrauch kann zum Verlust Ihrer redaktionellen Rechte führen. Wenn Sie zu lange inaktiv sind, können Sie sie auch verlieren.",
      French:
        "Salut, {$TargetName} !\nNous vous souhaitons la bienvenue en tant que nouveau bénévole. Vous pouvez maintenant déplacer le contenu vers des expériences ou le trou noir pour aider à organiser la communauté.\nVeuillez utiliser votre pouvoir avec prudence ! Toute utilisation abusive peut entraîner la perte de vos privilèges éditoriaux. Si vous êtes inactif trop longtemps, vous risquez également de les perdre.",
      Japanese:
        "やあ、{$TargetName}！\n新しいボランティアとしてあなたを温かく歓迎します。コンテンツを実験またはブラック ホールに移動して、コミュニティを整理できるようになりました。\n慎重に力を使ってください！誤用すると、編集権限が失われる可能性があります。あまりにも長い間アクティブでない場合、それらも失う可能性があります。",
      Italian:
        "Ciao, {$TargetName}!\nTi diamo un caloroso benvenuto come nuovo volontario. Ora puoi spostare i contenuti negli esperimenti o nel buco nero per aiutare a organizzare la comunità.\nPer favore, usa il tuo potere con cautela! Qualsiasi uso improprio può comportare la perdita dei tuoi privilegi editoriali. Se rimani inattivo per troppo tempo, potresti perderli anche tu.",
      Polish:
        "Cześć, {$TargetName}!\nWitamy Cię serdecznie jako nowego wolontariusza. Możesz teraz przenosić zawartość do eksperymentów lub Czarnej Dziury, aby pomóc zorganizować społeczność.\nProszę używać swojej mocy z rozwagą! Jakiekolwiek nadużycie może prowadzić do utraty uprawnień redakcyjnych. Jeśli jesteś nieaktywny przez zbyt długi czas, możesz je również stracić.",
      Spanish:
        "¡Hola, {$TargetName}!\nLe damos una calurosa bienvenida como nuevo voluntario. Ahora puede mover contenidos a experimentos o al Black Hole para ayudar a organizar la comunidad.\n¡Usa tu poder con precaución! Cualquier uso indebido puede dar lugar a la pérdida de sus privilegios editoriales. Si está inactivo durante demasiado tiempo, es posible que también los pierda.",
      Ukrainian:
        "Привіт, {$TargetName}!\nМи щиро вітаємо вас як нового волонтера. Тепер ви можете перемістити вміст до експериментів або Black Hole, щоб допомогти організувати спільноту.\nБудь ласка, використовуйте свою силу з обережністю! Будь-яке зловживання може призвести до втрати ваших редакційних привілеїв. Якщо ви надто довго неактивні, ви також можете втратити їх.",
    },
    Description: null,
    Bonuses: {
      Gold: 500,
      Experience: 500,
    },
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "5ef573e0bc9f1c8ca0828f05",
    Identifier: "Experiment-Supported",
    CategoryID: 4,
    Management: false,
    Subject: {
      Chinese: "作品被人支持了！",
      English: "Your work is supported!",
      ChineseTraditional: "作品被人支持了！",
      German: "Ihre Arbeit wird unterstützt!",
      French: "Votre travail est soutenu!",
      Japanese: "あなたの仕事はサポートされています！",
      Italian: "Il tuo lavoro è supportato!",
      Polish: "Twoja praca jest wspierana!",
      Spanish: "¡Tu trabajo está respaldado!",
      Ukrainian: "Ваша робота підтримується!",
    },
    Content: {
      Chinese: "{Users} 支持了你的作品 {Experiment}，并且带来了 {$Gold} 金币收入！",
      English: "{Users} supported your work {Experiment}, which brings you {$Gold} gold!",
      ChineseTraditional: "{Users} 支持了你的作品 {Experiment}，並且帶來了 {$Gold} 金幣收入！",
      German: "{Users} haben Ihre Arbeit {Experiment} unterstützt, was Ihnen {$Gold} Gold bringt!",
      French: "{Users} a soutenu votre travail {Experiment}, ce qui vous apporte {$Gold} or!",
      Japanese: "{Users} があなたの仕事 {Experiment} をサポートし、{$Gold} の金を獲得しました！",
      Italian: "{Users} ha supportato il tuo lavoro {Experiment}, che ti offre {$Gold} oro!",
      Polish: "{Users} wsparli Twoją pracę {Experiment}, która przyniosła Ci {$Gold} złota!",
      Spanish: "{Users} apoyó su trabajo {Experiment}, ¡lo que le brinda {$Gold} oro!",
      Ukrainian: "{Users} підтримали вашу роботу {Experiment}, яка принесла вам {$Gold} золота!",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 10,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "5ef8df952a9939aaac8bf97d",
    Identifier: "Comment-Discussion",
    CategoryID: 3,
    Management: false,
    Subject: {
      Chinese: "{Users} 评论了你的 {Experiment}。",
      English: "{Users} commented on your {Experiment}.",
      ChineseTraditional: "{Users} 評論了你的 {Experiment}。",
      German: "{Users} hat Ihr {Experiment} kommentiert.",
      French: "{Users} ont commenté votre {Experiment}.",
      Japanese: "{Users} があなたの {Experiment} にコメントしました。",
      Italian: "{Users} ha commentato il tuo {Experiment}.",
      Polish: "{Users} skomentowali Twój {Experiment}.",
      Spanish: "{Users} comentaron su {Experiment}.",
      Ukrainian: "{Users} прокоментували ваш {Experiment}.",
    },
    Content: {
      Chinese: "{$Content}",
      English: "{$Content}",
      ChineseTraditional: "{$Content}",
      German: "{$Content}",
      French: "{$Content}",
      Japanese: "{$Content}",
      Italian: "{$Content}",
      Polish: "{$Content}",
      Spanish: "{$Content}",
      Ukrainian: "{$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: "ShowComment",
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "5ef8df962a9939aaac8bf97e",
    Identifier: "Comment-Model",
    CategoryID: 3,
    Management: false,
    Subject: {
      Chinese: "{Users} 评论了你的 {Experiment}。",
      English: "{Users} commented on your {Experiment}.",
      ChineseTraditional: "{Users} 評論了你的 {Experiment}。",
      German: "{Users} hat Ihr {Experiment} kommentiert.",
      French: "{Users} ont commenté votre {Experiment}.",
      Japanese: "{Users} があなたの {Experiment} にコメントしました。",
      Italian: "{Users} ha commentato il tuo {Experiment}.",
      Polish: "{Users} skomentowali Twój {Experiment}.",
      Spanish: "{Users} comentaron su {Experiment}.",
      Ukrainian: "{Users} прокоментували ваш {Experiment}.",
    },
    Content: {
      Chinese: "{$Content}",
      English: "{$Content}",
      ChineseTraditional: "{$Content}",
      German: "{$Content}",
      French: "{$Content}",
      Japanese: "{$Content}",
      Italian: "{$Content}",
      Polish: "{$Content}",
      Spanish: "{$Content}",
      Ukrainian: "{$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: "ShowComment",
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "5f779d72afec668e98755350",
    Identifier: "Letter-Reward-Diamond",
    CategoryID: 1,
    Management: false,
    Subject: {
      Chinese: "感谢你的参与，这里是你的奖励！",
      English: "Thanks for your participation. Here is your rewards!",
      ChineseTraditional: "感謝你的參與，這裡是你的獎勵！",
      German: "Danke für Ihre Teilnahme. Hier sind deine Belohnungen!",
      French: "Merci pour votre participation. Voici vos récompenses!",
      Japanese: "ご参加いただきありがとうございます。これがあなたの報酬です！",
      Italian: "Grazie per la tua partecipazione. Ecco le tue ricompense!",
      Polish: "Dziękuję za udział. Oto twoje nagrody!",
      Spanish: "Gracias por tu participación. ¡Aquí tienes tus recompensas!",
      Ukrainian: "Дякуємо за вашу участь. Ось ваші винагороди!",
    },
    Content: {
      Chinese:
        "感谢你，{$TargetName}！\n物理实验室的成长离不开你的意见和反馈，物理实验室因为你的参与变得更好。参与活动的奖励已经发送到你的帐户：钻石 <b>{$Diamond}</b>！欢迎你参加物理实验室官方组织的更多访谈、电台和设计活动。",
      English:
        "Thanks, {$TargetName}!\nPhysics Lab benefits from your opinions and feedback; Physics Lab becomes better from your participation. Here is the reward for your participation: Diamond <b>{$Diamond}</b>! Welcome to participate in more interviews, radios, and design activities hosted by Physics Lab.",
      ChineseTraditional:
        "感謝你，{$TargetName}！\n物理實驗室的成長離不開你的意見和反饋，物理實驗室因為你的參與變得更好。參與活動的獎勵已經發送到你的帳戶：鑽石 <b>{$Diamond}</b>！歡迎你參加物理實驗室官方組織的更多訪談、電台和設計活動。",
      German:
        "Danke, {$TargetName}!\nDas Physiklabor profitiert von Ihren Meinungen und Ihrem Feedback. Das Physiklabor wird durch Ihre Teilnahme besser. Hier ist die Belohnung für Ihre Teilnahme: Diamond <b> {$ Diamond} </ b>! Willkommen zur Teilnahme an weiteren Interviews, Radios und Designaktivitäten, die vom Physics Lab veranstaltet werden.",
      French:
        "Merci, {$TargetName}!\nPhysics Lab bénéficie de vos opinions et commentaires; Le laboratoire de physique devient meilleur grâce à votre participation. Voici la récompense de votre participation: Diamond <b> {$ Diamond} </b>! Bienvenue pour participer à d'autres interviews, radios et activités de conception organisées par Physics Lab.",
      Japanese:
        "ありがとう、{$TargetName}！\nPhysics Labは、あなたの意見やフィードバックから恩恵を受けます。物理学研究室はあなたの参加からより良くなります。参加に対する報酬は次のとおりです。Diamond<b> {$ Diamond} </ b>！ Physics Labが主催するインタビュー、ラジオ、デザイン活動への参加を歓迎します。",
      Italian:
        "Grazie, {$TargetName}!\nPhysics Lab trae vantaggio dalle vostre opinioni e feedback; Physics Lab migliora grazie alla tua partecipazione. Ecco la ricompensa per la tua partecipazione: Diamante <b> {$ Diamond} </b>! Benvenuti a partecipare a più interviste, radio e attività di progettazione ospitate da Physics Lab.",
      Polish:
        "Dzięki, {$TargetName}!\nLaboratorium fizyczne korzysta z twoich opinii i opinii; Laboratorium fizyczne staje się lepsze dzięki Twojemu udziałowi. Oto nagroda za Twój udział: Diament <b> {$ Diament} </b>! Zapraszamy do udziału w większej liczbie wywiadów, radia i działań projektowych prowadzonych przez Physics Lab.",
      Spanish:
        "¡Gracias, {$TargetName}!\nPhysics Lab se beneficia de sus opiniones y comentarios; Physics Lab mejora con su participación. Aquí está la recompensa por su participación: ¡Diamante <b> {$ Diamante} </b>! Bienvenido a participar en más entrevistas, radios y actividades de diseño organizadas por Physics Lab.",
      Ukrainian:
        "Дякую, {$TargetName}!\nPhysics Lab отримує користь від ваших думок і відгуків; Physics Lab стає кращим від вашої участі. Ось винагорода за вашу участь: Діамант <b>{$Diamond}</b>! Ласкаво просимо взяти участь у інших інтерв’ю, радіо та дизайнерських заходах, які проводить Physics Lab.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "5f779d74afec668e98755351",
    Identifier: "Letter-Reward-Gold",
    CategoryID: 1,
    Management: false,
    Subject: {
      Chinese: "感谢你的参与，这里是你的奖励！",
      English: "Thanks for your participation. Here is your rewards!",
      ChineseTraditional: "感謝你的參與，這裡是你的獎勵！",
      German: "Danke für Ihre Teilnahme. Hier sind deine Belohnungen!",
      French: "Merci pour votre participation. Voici vos récompenses!",
      Japanese: "ご参加いただきありがとうございます。これがあなたの報酬です！",
      Italian: "Grazie per la tua partecipazione. Ecco le tue ricompense!",
      Polish: "Dziękuję za udział. Oto twoje nagrody!",
      Spanish: "Gracias por tu participación. ¡Aquí tienes tus recompensas!",
      Ukrainian: "Дякуємо за вашу участь. Ось ваші винагороди!",
    },
    Content: {
      Chinese:
        "感谢你，{$TargetName}！\n物理实验室的成长离不开你的意见和反馈，物理实验室因为你的参与变得更好。参与活动的奖励已经发送到你的帐户：金币 <b>{$Gold}</b>！欢迎你参加物理实验室官方组织的更多访谈、电台和设计活动。",
      English:
        "Thanks, {$TargetName}!\nPhysics Lab benefits from your opinions and feedback; Physics Lab becomes better from your participation. Here is the reward for your participation: Diamond <b>{$Diamond}</b>! Welcome to participate in more interviews, radios, and design activities hosted by Physics Lab.",
      ChineseTraditional:
        "感謝你，{$TargetName}！\n物理實驗室的成長離不開你的意見和反饋，物理實驗室因為你的參與變得更好。參與活動的獎勵已經發送到你的帳戶：金幣 <b>{$Gold}</b>！歡迎你參加物理實驗室官方組織的更多訪談、電台和設計活動。",
      German:
        "Danke, {$ TargetName}!\nDas Physiklabor profitiert von Ihren Meinungen und Ihrem Feedback. Das Physiklabor wird durch Ihre Teilnahme besser. Hier ist die Belohnung für Ihre Teilnahme: Diamond <b> {$ Diamond} </ b>! Willkommen zur Teilnahme an weiteren Interviews, Radios und Designaktivitäten, die vom Physics Lab veranstaltet werden.",
      French:
        "Merci, {$ TargetName}!\nPhysics Lab bénéficie de vos opinions et commentaires; Le laboratoire de physique devient meilleur grâce à votre participation. Voici la récompense de votre participation: Diamond <b> {$ Diamond} </b>! Bienvenue pour participer à d'autres interviews, radios et activités de conception organisées par Physics Lab.",
      Japanese:
        "ありがとう、{$ TargetName}！\nPhysics Labは、あなたの意見やフィードバックから恩恵を受けます。物理学研究室はあなたの参加からより良くなります。参加に対する報酬は次のとおりです。Diamond<b> {$ Diamond} </ b>！ Physics Labが主催するインタビュー、ラジオ、デザイン活動への参加を歓迎します。",
      Italian:
        "Grazie, {$TargetName}!\nPhysics Lab trae vantaggio dalle vostre opinioni e feedback; Physics Lab migliora grazie alla tua partecipazione. Ecco la ricompensa per la tua partecipazione: Diamante <b> {$ Diamond} </b>! Benvenuti a partecipare a più interviste, radio e attività di progettazione ospitate da Physics Lab.",
      Polish:
        "Dzięki, {$TargetName}!\nLaboratorium fizyczne korzysta z twoich opinii i opinii; Laboratorium fizyczne staje się lepsze dzięki Twojemu udziałowi. Oto nagroda za Twój udział: Diament <b> {$ Diament} </b>! Zapraszamy do udziału w większej liczbie wywiadów, radia i działań projektowych prowadzonych przez Physics Lab.",
      Spanish:
        "¡Gracias, {$TargetName}!\nPhysics Lab se beneficia de sus opiniones y comentarios; Physics Lab mejora con su participación. Aquí está la recompensa por su participación: ¡Diamante <b> {$ Diamante} </b>! Bienvenido a participar en más entrevistas, radios y actividades de diseño organizadas por Physics Lab.",
      Ukrainian:
        "Дякую, {$TargetName}!\nPhysics Lab отримує користь від ваших думок і відгуків; Physics Lab стає кращим від вашої участі. Ось винагорода за вашу участь: Діамант <b>{$Diamond}</b>! Ласкаво просимо взяти участь у інших інтерв’ю, радіо та дизайнерських заходах, які проводить Physics Lab.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "613271b3a125d90c2ce2e024",
    Identifier: "Content-Management-Into-KB",
    CategoryID: 4,
    Management: true,
    Subject: {
      Chinese: "{Experiment} 被选入知识库！",
      English: "{Experiment} has been selected into the Knowledge Base!",
      ChineseTraditional: "{Experiment} 被選入知識庫！",
      German: "{Experiment} wurde in die Wissensdatenbank aufgenommen!",
      French: "{Experiment} a été sélectionné dans la base de connaissances !",
      Japanese: "{Experiment} がナレッジベースに選ばれました！",
      Italian: "{Experiment} è stato selezionato nella Knowledge Base!",
      Polish: "{Experiment} został wybrany do Bazy wiedzy!",
      Spanish: "¡Se ha seleccionado {Experiment} en la base de conocimientos!",
      Ukrainian: "{Experiment} вибрано в базу знань!",
    },
    Content: {
      Chinese: "管理人员 {Users} 执行了这一操作。",
      English: "Editor {Users} did it.",
      ChineseTraditional: "管理人員 {Users} 執行了這一操作。",
      German: "Der Editor {Users} hat es geschafft.",
      French: "L'éditeur {Users} l'a fait.",
      Japanese: "エディタ {Users} がやりました。",
      Italian: "L'editor {Users} l'ha fatto.",
      Polish: "Redaktor {Users} to zrobił.",
      Spanish: "El editor {Users} lo hizo.",
      Ukrainian: "Редактор {Users} зробив це.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "613271b3a125d90c2ce2e025",
    Identifier: "Content-Management-Out-of-KB",
    CategoryID: 4,
    Management: true,
    Subject: {
      Chinese: "{Experiment} 被移出知识库！",
      English: "{Experiment} has been moved out of the Knowledge Base!",
      ChineseTraditional: "{Experiment} 被移出知識庫！",
      German: "{Experiment} wurde aus der Wissensdatenbank entfernt!",
      French: "{Experiment} a été retiré de la base de connaissances !",
      Japanese: "{Experiment} はナレッジベースから移動されました！",
      Italian: "{Experiment} è stato spostato fuori dalla Knowledge Base!",
      Polish: "{Experiment} został przeniesiony z Bazy wiedzy!",
      Spanish: "{Experiment} se ha eliminado de la base de conocimientos.",
      Ukrainian: "{Experiment} було переміщено з бази знань!",
    },
    Content: {
      Chinese: "管理人员 {Users} 执行了这一操作。",
      English: "Editor {Users} did it.",
      ChineseTraditional: "管理人員 {Users} 執行了這一操作。",
      German: "Der Editor {Users} hat es geschafft.",
      French: "L'éditeur {Users} l'a fait.",
      Japanese: "エディタ {Users} がやりました。",
      Italian: "L'editor {Users} l'ha fatto.",
      Polish: "Redaktor {Users} to zrobił.",
      Spanish: "El editor {Users} lo hizo.",
      Ukrainian: "Редактор {Users} зробив це.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "613271b6a125d90c2ce2e026",
    Identifier: "Letter-Knowledge-Base",
    CategoryID: 1,
    Management: false,
    Subject: {
      Chinese: "你的作品 {Experiment} 入选知识库！",
      English: "Your work {Experiment} has been selected into the Knowledge Base!",
      ChineseTraditional: "你的作品 {Experiment} 入選知識庫！",
      German: "Ihre Arbeit {Experiment} wurde in die Wissensdatenbank aufgenommen!",
      French: "Votre travail {Experiment} a été sélectionné dans la base de connaissances !",
      Japanese: "あなたの作品 {Experiment} がナレッジベースに選ばれました！",
      Italian: "Il tuo lavoro {Experiment} è stato selezionato nella Knowledge Base!",
      Polish: "Twoja praca {Experiment} została wybrana do Bazy wiedzy!",
      Spanish: "Su trabajo {Experiment} ha sido seleccionado en la base de conocimientos.",
      Ukrainian: "Вашу роботу {Експеримент} вибрано до Бази знань!",
    },
    Content: {
      Chinese:
        "祝贺你，{$TargetName}！\n你的作品 {Experiment} 已经被 {Users} 选入知识库了。知识库实验会为你带来更多粉丝，你可以在首页的“知识库”栏目看到所有入选的实验。\n为了表彰你对物理实验室社区的贡献，10 钻石和 200 经验奖励已经发送到你的帐户。你可以用它解锁更多元件！",
      English:
        "Congratulations, {$TargetName}!\nYour work {Experiment} has been selected into the Knowledge Base by {Users}. This may bring you more followers, and we recommend you to visit more featured experiments from the homepage.\nIn order to reward your contribution to Physics Lab community, 10 Diamonds and 200 Experiences has been sent to your account. Unlock more components now!",
      ChineseTraditional:
        "祝賀你，{$TargetName}！\n你的作品 {Experiment} 已經被 {Users} 選入知識庫了。知識庫實驗會為你帶來更多粉絲，你可以在首頁的“知識庫”欄目看到所有入選的實驗。\n為了表彰你對物理實驗室社區的貢獻，10 鑽石和 200 經驗獎勵已經發送到你的帳戶。你可以用它解鎖更多元件！",
      German:
        "Herzlichen Glückwunsch, {$TargetName}!\nIhre Arbeit {Experiment} wurde von {Users} in die Wissensdatenbank aufgenommen. Dies kann Ihnen mehr Follower bringen, und wir empfehlen Ihnen, weitere vorgestellte Experimente von der Homepage aus zu besuchen.\nUm Ihren Beitrag zur Physics Lab-Community zu belohnen, wurden Ihrem Konto 10 Diamanten und 200 Erfahrungen zugesandt. Schalte jetzt weitere Komponenten frei!",
      French:
        "Félicitations, {$TargetName} !\nVotre travail {Experiment} a été sélectionné dans la base de connaissances par {Users}. Cela peut vous apporter plus d'abonnés, et nous vous recommandons de visiter plus d'expériences en vedette à partir de la page d'accueil.\nAfin de récompenser votre contribution à la communauté Physics Lab, 10 Diamants et 200 Expériences ont été envoyés sur votre compte. Débloquez plus de composants maintenant !",
      Japanese:
        "おめでとうございます、{$ TargetName}！\nあなたの作品 {Experiment} は {Users} によってナレッジベースに選ばれました。これにより、フォロワーが増える可能性があります。ホームページから、より多くの注目の実験にアクセスすることをお勧めします。\nPhysics Labコミュニティへの貢献に報いるために、10個のダイヤモンドと200個のエクスペリエンスがアカウントに送信されました。今すぐより多くのコンポーネントのロックを解除してください！",
      Italian:
        "Congratulazioni, {$TargetName}!\nIl tuo lavoro {Experiment} è stato selezionato nella Knowledge Base da {Users}. Questo potrebbe portarti più follower e ti consigliamo di visitare più esperimenti in primo piano dalla home page.\nPer premiare il tuo contributo alla community di Physics Lab, 10 diamanti e 200 esperienze sono stati inviati al tuo account. Sblocca più componenti ora!",
      Polish:
        "Gratulacje, {$TargetName}!\nTwoja praca {Experiment} została wybrana do bazy wiedzy przez {Users}. Może to przyciągnąć więcej obserwatorów, dlatego zalecamy odwiedzenie większej liczby polecanych eksperymentów na stronie głównej.\nAby nagrodzić Twój wkład w społeczność Physics Lab, na Twoje konto zostało wysłane 10 Diamentów i 200 Doświadczeń. Odblokuj teraz więcej komponentów!",
      Spanish:
        "¡Felicitaciones, {$TargetName}!\nSu trabajo {Experiment} ha sido seleccionado en la Base de conocimientos por {Users}. Esto puede traerle más seguidores, y le recomendamos que visite más experimentos destacados desde la página de inicio.\nPara recompensar su contribución a la comunidad de Physics Lab, se han enviado 10 diamantes y 200 experiencias a su cuenta. ¡Desbloquea más componentes ahora!",
      Ukrainian:
        "Вітаємо, {$TargetName}!\nВашу роботу {Експеримент} вибрали {Користувачі} до Бази знань. Це може залучити у вас більше підписників, і ми рекомендуємо вам відвідати більше рекомендованих експериментів із головної сторінки.\nЩоб винагородити ваш внесок у спільноту Physics Lab, на ваш обліковий запис було надіслано 10 діамантів і 200 вражень. Розблокуйте більше компонентів зараз!",
    },
    Description: null,
    Bonuses: {
      Diamond: 10,
      Experience: 200,
    },
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "619d243fc498c9688ca8dc71",
    Identifier: "Letter-Featured-Upgraded",
    CategoryID: 1,
    Management: false,
    Subject: {
      Chinese: "你的作品 {Experiment} 升为精选！",
      English: "Your work {Experiment} is featured!",
      ChineseTraditional: "你的作品 {Experiment} 升為精選！",
      German: "Ihre Arbeit {Experiment} wird vorgestellt!",
      French: "Votre travail {Experiment} est en vedette!",
      Japanese: "あなたの作品 {Experiment} が紹介されました！",
      Italian: "Il tuo lavoro {Experiment} è in primo piano!",
      Polish: "Twoja praca {Experiment} jest polecana!",
      Spanish: "¡Tu trabajo {Experiment} está destacado!",
      Ukrainian: "Представлено вашу роботу {Experiment}!",
    },
    Content: {
      Chinese:
        "祝贺你，{$TargetName}！\n你的作品 {Experiment} 已经被 {Users} 评为精选实验了。精选实验会为你带来更多粉丝，你可以在首页的“精选”栏目看到所有入选的实验。\n为了表彰你对物理实验室社区的贡献，50 钻石和 300 经验奖励已经发送到你的帐户。你可以用它解锁更多元件！",
      English:
        "Congratulations, {$TargetName}!\nYour work {Experiment} has been featured by {Users}. Getting featured may bring you more followers, and we recommend you to visit more featured experiments from the homepage.\nIn order to reward your contribution to Physics Lab community, 60 Diamonds and 500 Experiences has been sent to your account. Unlock more components now!",
      ChineseTraditional:
        "祝賀你，{$TargetName}！\n你的作品 {Experiment} 已經被 {Users} 評為精選實驗了。精選實驗會為你帶來更多粉絲，你可以在首頁的“精選”欄目看到所有入選的實驗。\n為了表彰你對物理實驗室社區的貢獻，50 鑽石和 300 經驗獎勵已經發送到你的帳戶。你可以用它解鎖更多元件！",
      German:
        "Herzlichen Glückwunsch, {$TargetName}!\nIhre Arbeit {Experiment} wurde von {Users} vorgestellt. Wenn Sie vorgestellt werden, erhalten Sie möglicherweise mehr Follower. Wir empfehlen Ihnen, mehr ausgewählte Experimente auf der Homepage zu besuchen.\nUm Ihren Beitrag zur Physiklabor-Community zu belohnen, wurden 60 Diamanten und 500 Erfahrungen an Ihr Konto gesendet. Schalte jetzt mehr Komponenten frei!",
      French:
        "Félicitations, {$TargetName}!\nVotre travail {Experiment} a été présenté par {Users}. La mise en vedette peut vous apporter plus d'abonnés, et nous vous recommandons de visiter d'autres expériences en vedette sur la page d'accueil.\nAfin de récompenser votre contribution à la communauté des laboratoires de physique, 60 diamants et 500 expériences ont été envoyés à votre compte. Débloquez plus de composants maintenant!",
      Japanese:
        "おめでとう、{$TargetName}！\nあなたの作品 {Experiment} が {Users} によって特集されました。注目を集めるとフォロワー数が増える可能性があるため、ホームページから注目の実験にアクセスすることをお勧めします。\nPhysics Labコミュニティへの貢献に報いるために、50個のダイヤモンドと300個のエクスペリエンスがアカウントに送信されました。今すぐより多くのコンポーネントのロックを解除してください！",
      Italian:
        "Congratulazioni, {$TargetName}!\nIl tuo lavoro {Experiment} è stato presentato da {Users}. Essere in primo piano può portare più follower e ti consigliamo di visitare altri esperimenti in primo piano dalla home page.\nPer premiare il tuo contributo alla comunità di Physics Lab, 50 diamanti e 300 esperienze sono stati inviati al tuo account. Sblocca più componenti ora!",
      Polish:
        "Gratulacje, {$TargetName}!\nTwoja praca {Experiment} została wyróżniona przez {Users}. Polecenie może przynieść więcej obserwujących, dlatego zalecamy odwiedzanie większej liczby polecanych eksperymentów ze strony głównej.\nW celu nagrodzenia twojego wkładu w społeczność Physics Lab, 50 Diamentów i 300 Doświadczeń zostało wysłanych na twoje konto. Odblokuj więcej komponentów teraz!",
      Spanish:
        "¡Felicitaciones, {$TargetName}!\nTu trabajo {Experiment} ha sido destacado por {Users}. Ser destacado puede traerle más seguidores, y le recomendamos que visite más experimentos destacados desde la página de inicio.\nPara recompensar su contribución a la comunidad de Physics Lab, se han enviado 50 Diamantes y 300 Experiencias a su cuenta. ¡Desbloquea más componentes ahora!",
      Ukrainian:
        "Вітаємо, {$TargetName}!\nВашу роботу {Experiment} представили {Users}. Відображення може привернути до вас більше підписників, тому ми рекомендуємо вам відвідати більше рекомендованих експериментів із головної сторінки.\nЩоб винагородити ваш внесок у спільноту Physics Lab, на ваш обліковий запис було надіслано 60 діамантів і 500 вражень. Розблокуйте більше компонентів зараз!",
    },
    Description: null,
    Bonuses: {
      Diamond: 60,
      Experience: 500,
    },
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "61f1ef55156f8712081770f0",
    Identifier: "Content-Management-Moved-Model",
    CategoryID: 4,
    Management: true,
    Subject: {
      Chinese: "{Experiment} 被移动到模型区！",
      English: "{Experiment} has been moved to Models!",
      ChineseTraditional: "{Experiment} 被移動到實驗區！",
      German: "{Experiment} wurde zu Models verschoben!",
      French: "{Experiment} a été déplacé vers Modèles !",
      Japanese: "{Experiment} はモデルに移動しました！",
      Italian: "{Experiment} è stato spostato in Modelli!",
      Polish: "{Experiment} został przeniesiony do Models!",
      Spanish: "¡{Experiment} se ha movido a Modelos!",
      Ukrainian: "{Experiment} переміщено в Models!",
    },
    Content: {
      Chinese: "管理人员 {Users} 执行了这一操作。",
      English: "Editor {Users} did it.",
      ChineseTraditional: "管理人員 {Users} 執行了這一操作。",
      German: "Editor {Users} hat es geschafft.",
      French: "Le rédacteur {Users} l'a fait.",
      Japanese: "編集者 {Users} がやった。",
      Italian: "L'editore {Users} lo ha fatto.",
      Polish: "Redaktor {Users} to zrobił.",
      Spanish: "El editor {Users} lo hizo.",
      Ukrainian: "Редактор {Users} зробив це.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "61fef0cc9b978b6f68b7f897",
    Identifier: "Content-Updated",
    CategoryID: 4,
    Management: false,
    Subject: {
      Chinese: "{Users} 编辑了合作作品 {Experiment}！",
      English: "{Users} updated your collaborative work {Experiment}.",
      ChineseTraditional: "{Users} 編輯了合作作品 {Experiment}！",
      German: "{Users} hat Ihre Gemeinschaftsarbeit {Experiment} aktualisiert.",
      French: "{Users} a mis à jour votre travail collaboratif {Experiment}.",
      Japanese: "{ユーザー}が共同作業{実験}を更新しました。",
      Italian: "{Users} ha aggiornato il tuo lavoro collaborativo {Experiment}.",
      Polish: "{Users} zaktualizowało Twoją wspólną pracę {Experiment}.",
      Spanish: "{Usuarios} actualizó su trabajo colaborativo {Experimento}.",
      Ukrainian: null,
    },
    Content: {
      Chinese: "目前，多人同时编辑作品可能导致修改被覆盖，请注意刷新同步。",
      English:
        "Having multiple users editing the same work could result in overriding each other's work.",
      ChineseTraditional: "目前，多人同時編輯作品可能導致修改被覆蓋，請注意刷新同步。",
      German:
        "Wenn mehrere Benutzer dieselbe Arbeit bearbeiten, kann dies dazu führen, dass die Arbeit des anderen außer Kraft gesetzt wird.",
      French:
        "Le fait que plusieurs utilisateurs modifient le même travail peut entraîner le remplacement du travail de l'autre.",
      Japanese: "複数のユーザーが同じ作業を編集すると、互いの作業が上書きされる可能性があります。",
      Italian:
        "Avere più utenti che modificano lo stesso lavoro potrebbe comportare l'override del lavoro dell'altro.",
      Polish:
        "Posiadanie wielu użytkowników edytujących tę samą pracę może spowodować wzajemne zastępowanie pracy.",
      Spanish:
        "Si varios usuarios editan el mismo trabajo, podría anularse el trabajo de los demás.",
      Ukrainian: null,
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "61fef113683e167444e10f53",
    Identifier: "Content-Updated",
    CategoryID: 4,
    Management: false,
    Subject: {
      Chinese: "{Users} 编辑了合作作品 {Experiment}！",
      English: "{Users} updated your collaborative work {Experiment}.",
      ChineseTraditional: "{Users} 編輯了合作作品 {Experiment}！",
      German: "{Users} hat Ihre Gemeinschaftsarbeit {Experiment} aktualisiert.",
      French: "{Users} a mis à jour votre travail collaboratif {Experiment}.",
      Japanese: "{Users} が共同作業 {Experiment} を更新しました。",
      Italian: "{Users} ha aggiornato il tuo lavoro collaborativo {Experiment}.",
      Polish: "{Users} zaktualizowało Twoją wspólną pracę {Experiment}.",
      Spanish: "{Users} actualizó su trabajo colaborativo {Experiment}.",
      Ukrainian: "{Users} оновили вашу спільну роботу {Experiment}.",
    },
    Content: {
      Chinese: "目前，多人同时编辑作品可能导致修改被覆盖，请注意刷新同步。",
      English:
        "Having multiple users editing the same work could result in overriding each other's work.",
      ChineseTraditional: "目前，多人同時編輯作品可能導致修改被覆蓋，請注意刷新同步。",
      German:
        "Wenn mehrere Benutzer dieselbe Arbeit bearbeiten, kann dies dazu führen, dass die Arbeit des anderen außer Kraft gesetzt wird.",
      French:
        "Le fait que plusieurs utilisateurs modifient le même travail peut entraîner le remplacement du travail de l'autre.",
      Japanese: "複数のユーザーが同じ作業を編集すると、互いの作業が上書きされる可能性があります。",
      Italian:
        "Avere più utenti che modificano lo stesso lavoro potrebbe comportare l'override del lavoro dell'altro.",
      Polish:
        "Posiadanie wielu użytkowników edytujących tę samą pracę może spowodować wzajemne zastępowanie pracy.",
      Spanish:
        "Si varios usuarios editan el mismo trabajo, podría anularse el trabajo de los demás.",
      Ukrainian:
        "Якщо кілька користувачів редагують одну й ту саму роботу, це може призвести до перевизначення роботи один одного.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "61fef115683e167444e10f54",
    Identifier: "Collaborator-Invited",
    CategoryID: 4,
    Management: false,
    Subject: {
      Chinese: "{Users} 邀请你合作编辑 {Experiment}！",
      English: "{Users} invited you to edit {Experiment}.",
      ChineseTraditional: "{Users} 邀請你合作編輯 {Experiment}！",
      German: "{Users} hat Sie eingeladen, {Experiment} zu bearbeiten.",
      French: "{Users} vous a invité à modifier {Experiment}.",
      Japanese: "{Users} が {Experiment} の編集に招待しました。",
      Italian: "{Users} ti ha invitato a modificare {Experiment}.",
      Polish: "{Users} zaprasza Cię do edytowania {Experiment}.",
      Spanish: "{Users} te invitó a editar {Experiment}.",
      Ukrainian: "{Users} запросили вас редагувати {Experiment}.",
    },
    Content: {
      Chinese: "点击消息确认接受 {Users} 的邀请。",
      English: "Click the message to accept the invitation from {Users}.",
      ChineseTraditional: "點擊消息確認接受 {Users} 的邀請。",
      German: "Klicken Sie auf die Nachricht, um die Einladung von {Users} anzunehmen.",
      French: "Cliquez sur le message pour accepter l'invitation de {Users}.",
      Japanese: "メッセージをクリックして、{Users} からの招待を受け入れます。",
      Italian: "Fare clic sul messaggio per accettare l'invito da {Users}.",
      Polish: "Kliknij wiadomość, aby zaakceptować zaproszenie od {Users}.",
      Spanish: "Haga clic en el mensaje para aceptar la invitación de {Users}.",
      Ukrainian: "Натисніть повідомлення, щоб прийняти запрошення від {Users}.",
    },
    Description: null,
    Bonuses: null,
    Action: "Confirm",
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "61fef117683e167444e10f55",
    Identifier: "Collaborator-Accepted",
    CategoryID: 4,
    Management: false,
    Subject: {
      Chinese: "{Users} 接受了合作编辑 {Experiment} 的邀请！",
      English: "{Users} accepted invitation to edit {Experiment}.",
      ChineseTraditional: "{Users} 接受了合作編輯 {Experiment} 的邀請！",
      German: "{Users} haben die Einladung zum Bearbeiten von {Experiment} angenommen.",
      French: "{Users} a accepté l'invitation à modifier {Experiment}.",
      Japanese: "{Users} は {Experiment} を編集するための招待を受け入れました。",
      Italian: "{Users} ha accettato l'invito a modificare {Experiment}.",
      Polish: "{Users} zaakceptowało zaproszenie do edycji {Experiment}.",
      Spanish: "{Users} aceptaron la invitación para editar {Experiment}.",
      Ukrainian: "{Users} прийняли запрошення редагувати {Experiment}.",
    },
    Content: {
      Chinese: "目前，多人同时编辑作品可能导致修改被覆盖，请注意刷新同步。",
      English:
        "Having multiple users editing the same work could result in overriding each other's work.",
      ChineseTraditional: "目前，多人同時編輯作品可能導致修改被覆蓋，請注意刷新同步。",
      German:
        "Wenn mehrere Benutzer dieselbe Arbeit bearbeiten, kann dies dazu führen, dass die Arbeit des anderen außer Kraft gesetzt wird.",
      French:
        "Le fait que plusieurs utilisateurs modifient le même travail peut entraîner le remplacement du travail de l'autre.",
      Japanese: "複数のユーザーが同じ作業を編集すると、互いの作業が上書きされる可能性があります。",
      Italian:
        "Avere più utenti che modificano lo stesso lavoro potrebbe comportare l'override del lavoro dell'altro.",
      Polish:
        "Posiadanie wielu użytkowników edytujących tę samą pracę może spowodować wzajemne zastępowanie pracy.",
      Spanish:
        "Si varios usuarios editan el mismo trabajo, podría anularse el trabajo de los demás.",
      Ukrainian:
        "Якщо кілька користувачів редагують одну й ту саму роботу, це може призвести до перевизначення роботи один одного.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "61fef119683e167444e10f56",
    Identifier: "Collaborator-Removed",
    CategoryID: 4,
    Management: false,
    Subject: {
      Chinese: "{Users} 移除了你的合作者身份！",
      English: "{Users} removed you as a collaborator.",
      ChineseTraditional: "{Users} 移除了你的合作者身份！",
      German: "{Users} hat Sie als Mitbearbeiter entfernt.",
      French: "{Users} vous a supprimé en tant que collaborateur.",
      Japanese: "{Users} が共同編集者としてあなたを削除しました。",
      Italian: "{Users} ti ha rimosso come collaboratore.",
      Polish: "{Users} usunęło Cię jako współpracownika.",
      Spanish: "{Users} te eliminó como colaborador.",
      Ukrainian: "{Users} видалили вас як співавтора.",
    },
    Content: {
      Chinese: "你在 {Experiment} 的合作者身份已被 {Users} 移除。",
      English: "Your collaborator status at {Experiment} has been removed by {Users}.",
      ChineseTraditional: "你在 {Experiment} 的合作者身份已被 {Users} 移除。",
      German: "Ihr Mitarbeiterstatus bei {Experiment} wurde von {Users} entfernt.",
      French: "Votre statut de collaborateur chez {Experiment} a été supprimé par {Users}.",
      Japanese: "{Experiment} での共同編集者のステータスは{ユーザー}によって削除されました。",
      Italian: "Il tuo stato di collaboratore in {Experiment} è stato rimosso da {Users}.",
      Polish: "Twój status współpracownika w {Experiment} został usunięty przez {Users}.",
      Spanish: "{Users} eliminó su estado de colaborador en {Experiment}.",
      Ukrainian: "Ваш статус співавтора в {Experiment} був видалений {Users}.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "620a6c3a1a86066da8e66b90",
    Identifier: "Experiment-Remixed",
    CategoryID: 4,
    Management: false,
    Subject: {
      Chinese: "作品被人改编了！",
      English: "Your work is remixed!",
      ChineseTraditional: "作品被人改編了！",
      German: "Ihre Arbeit wird remixt!",
      French: "Votre travail est remixé !",
      Japanese: "あなたの作品はリミックスされています！",
      Italian: "Il tuo lavoro è remixato!",
      Polish: "Twoja praca jest zremiksowana!",
      Spanish: "¡Tu trabajo está remezclado!",
      Ukrainian: "Ваша робота реміксована!",
    },
    Content: {
      Chinese: "{Users} 将你的作品改编为 {Experiment}。",
      English: "{Users} remixed your work as {Experiment}.",
      ChineseTraditional: "{Users} 將你的作品改編為 {Experiment}。",
      German: "{Users} hat Ihre Arbeit als {Experiment} neu gemischt.",
      French: "{Users} a remixé votre travail en tant que {Experiment}.",
      Japanese: "{Users} はあなたの作品を {Experiment} としてリミックスしました。",
      Italian: "{Users} ha remixato il tuo lavoro come {Experiment}.",
      Polish: "{Users} zremiksował Twoją pracę jako {Experiment}.",
      Spanish: "{Users} remezcló tu trabajo como {Experiment}.",
      Ukrainian: "{Users} зробили ремікс вашої роботи як {Experiment}.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "620a71ca509ca9a744d6620c",
    Identifier: "Comment-Hidden",
    CategoryID: 3,
    Management: false,
    Subject: {
      Chinese: "{Users} 隐藏了你的评论（留言）。",
      English: "{Users} hide your comment.",
      ChineseTraditional: "{Users} 隱藏了你的評論（留言）。",
      German: "{Users} verbergen Ihren Kommentar.",
      French: "{Users} masquez votre commentaire.",
      Japanese: "{Users} コメントを非表示にします。",
      Italian: "{Users} nascondi il tuo commento.",
      Polish: "{Users} ukryj swój komentarz.",
      Spanish: "{Users} oculta tu comentario.",
      Ukrainian: "{Users} приховати ваш коментар.",
    },
    Content: {
      Chinese: "如果你认为管理操作执行不当，请与用户联系。",
      English: "If you feel the action is not appropriate, please contact the user.",
      ChineseTraditional: "如果你認為管理操作執行不當，請與用戶聯繫。",
      German:
        "Wenn Sie der Meinung sind, dass die Aktion nicht angemessen ist, wenden Sie sich bitte an den Benutzer.",
      French: "Si vous pensez que l'action n'est pas appropriée, veuillez contacter l'utilisateur.",
      Japanese: "アクションが適切でないと思われる場合は、ユーザーに連絡してください。",
      Italian: "Se ritieni che l'azione non sia appropriata, contatta l'utente.",
      Polish: "Jeśli uważasz, że działanie nie jest właściwe, skontaktuj się z użytkownikiem.",
      Spanish: "Si cree que la acción no es apropiada, comuníquese con el usuario.",
      Ukrainian: "Якщо ви вважаєте дію невідповідною, зв’яжіться з користувачем.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 1,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "625ef2f488558c1990c12001",
    Identifier: "Letter-Moved-Discussion",
    CategoryID: 1,
    Management: false,
    Subject: {
      Chinese: "为什么我的作品 {Experiment} 被移动到黑洞区？",
      English: "Why my work {Experiment} was moved to Discussions?",
      ChineseTraditional: "為什麼我的作品 {Experiment} 被移動到黑洞區？",
      German: "Warum wurde meine Arbeit {Experiment} in Diskussionen verschoben?",
      French: "Pourquoi mon travail {Experiment} a été déplacé vers Discussions ?",
      Japanese: "なぜ私の作品 {Experiment} はディスカッションに移されたのですか？",
      Italian: "Perché il mio lavoro {Experiment} è stato spostato in Discussioni?",
      Polish: "Dlaczego moja praca {Experiment} została przeniesiona do Dyskusji?",
      Spanish: "¿Por qué mi trabajo {Experiment} se movió a Discusiones?",
      Ukrainian: "Чому мою роботу {Experiment} було переміщено в Обговорення?",
    },
    Content: {
      Chinese:
        "用户你好，欢迎来到物实！我们理解、也支持你希望分享自己作品的尝试。\n尽管如此，这是一个大家共同维护的空间。因此，对于不同作品的分类使用，存在一些已有的标准。\n如果你希望分享你的快乐、兴奋或者奇妙地发现，请尽量发布到黑洞区，并且按照内容来选择标签。比如说，如果你不是在询问一个问题，请不要使用“问与答”标签。\n同样的道理，请在你觉得作品对大家都有帮助、并且符合规则的情况下使用“申请精选”标签。这样，可以帮助志愿者们减轻工作负担。\n如果你想知道更多，请看<discussion=6072a5cbf6fe9b0001d81703>新用户生存指南</discussion>、<discussion=5eee232f3e71080001a40960>致新用户</discussion>与<discussion=5d921799a88e5200014fc0e5>管理条例</discussion>。\n如果你希望像其他用户一样在物实发光发亮，试着制作一些有用的电路。试着看看其他同学制作的<discussion=60da78eefdb33a0001226d07>教程</discussion>。\n最后，再次谢谢你的配合！",
      English:
        "Welcome to Physics Lab! Thank you for publishing in the community.\nHowever, please avoid publishing simple or meaningless works in the Experiment section or using tags arbitrarily. Or you might risk getting your work moved to Discussions.\nAny high-quality work is sincerely welcomed in this community. Why not start with doing some useful circuits?\nWant to know more about how the community is governed? It is governed by users like you! See <discussion=5fd4ed4cb04ed000014946da>Regulation</discussion>.",
      ChineseTraditional:
        "用戶你好，歡迎來到物實！我們理解、也支持你希望分享自己作品的嘗試。\n儘管如此，這是一個大家共同維護的空間。因此，對於不同作品的分類使用，存在一些已有的標準。\n如果你希望分享你的快樂、興奮或者奇妙地發現，請盡量發佈到黑洞區，並且按照內容來選擇標籤。比如說，如果你不是在詢問一個問題，請不要使用“問與答”標籤。\n同樣的道理，請在你覺得作品對大家都有幫助、並且符合規則的情況下使用“申請精選”標籤。這樣，可以幫助志願者們減輕工作負擔。\n如果你想知道更多，請看<discussion=6072a5cbf6fe9b0001d81703>新用戶生存指南</discussion>、<discussion=5eee232f3e71080001a40960>致新用戶</discussion>與<discussion=5d921799a88e5200014fc0e5>管理條例</discussion>。\n如果你希望像其他用戶一樣在物實發光發亮，試著製作一些有用的電路。試著看看其他同學製作的<discussion=60da78eefdb33a0001226d07>教程</discussion>。\n最後，再次謝謝你的配合！",
      German:
        "Willkommen im Physiklabor! Vielen Dank für die Veröffentlichung in der Community.\nVermeiden Sie es jedoch, einfache oder bedeutungslose Arbeiten im Bereich Experiment zu veröffentlichen oder Tags willkürlich zu verwenden. Oder Sie riskieren, dass Ihre Arbeit in Diskussionen verschoben wird.\nJede qualitativ hochwertige Arbeit wird in dieser Gemeinschaft aufrichtig begrüßt. Warum nicht mit ein paar nützlichen Schaltungen beginnen?\nMöchten Sie mehr darüber erfahren, wie die Gemeinde regiert wird? Es wird von Benutzern wie Ihnen regiert! Siehe <discussion=5fd4ed4cb04ed000014946da>Verordnung</discussion>.",
      French:
        "Bienvenue au laboratoire de physique ! Merci de publier dans la communauté.\nCependant, veuillez éviter de publier des œuvres simples ou dénuées de sens dans la section Expérimentation ou d'utiliser des balises de manière arbitraire. Ou vous risquez de déplacer votre travail vers Discussions.\nTout travail de haute qualité est sincèrement bien accueilli dans cette communauté. Pourquoi ne pas commencer par faire quelques circuits utiles ?\nVous voulez en savoir plus sur la façon dont la communauté est gouvernée? Il est régi par des utilisateurs comme vous ! Voir <discussion=5fd4ed4cb04ed000014946da>Règlement</discussion>.",
      Japanese:
        "物理学研究室へようこそ！コミュニティで公開していただきありがとうございます。\nただし、実験のセクションで単純な作品や無意味な作品を公開したり、タグを任意に使用したりしないでください。または、作業をディスカッションに移動するリスクがあります。\nこのコミュニティでは、質の高い作品を歓迎します。いくつかの便利な回路から始めてみませんか？\nコミュニティがどのように統治されているかについてもっと知りたいですか？それはあなたのようなユーザーによって管理されています！ <discussion=5fd4ed4cb04ed000014946da>規制</discussion>を参照してください。",
      Italian:
        "Benvenuto al Laboratorio di Fisica! Grazie per aver pubblicato nella community.\nTuttavia, evita di pubblicare lavori semplici o privi di significato nella sezione Esperimento o di utilizzare i tag in modo arbitrario. Oppure potresti rischiare che il tuo lavoro venga spostato in Discussioni.\nQualsiasi lavoro di alta qualità è sinceramente accolto in questa comunità. Perché non iniziare con alcuni circuiti utili?\nVuoi saperne di più su come è governata la comunità? È governato da utenti come te! Vedi <discussion=5fd4ed4cb04ed000014946da>Regolamento</discussion>.",
      Polish:
        "Witamy w laboratorium fizycznym! Dziękuję za publikację w społeczności.\nUnikaj jednak publikowania prostych lub bezsensownych prac w sekcji Eksperyment lub arbitralnego używania tagów. Możesz też zaryzykować przeniesienie swojej pracy do Dyskusji.\nKażda praca wysokiej jakości jest w tej społeczności szczerze mile widziana. Dlaczego nie zacząć od zrobienia kilku przydatnych obwodów?\nChcesz dowiedzieć się więcej o zarządzaniu społecznością? Zarządzają nim użytkownicy tacy jak Ty! Zobacz <discussion=5fd4ed4cb04ed000014946da>Przepisy</discussion>.",
      Spanish:
        "¡Bienvenidos al Laboratorio de Física! Gracias por publicar en la comunidad.\nSin embargo, evite publicar trabajos simples o sin sentido en la sección Experimento o usar etiquetas arbitrariamente. O puede correr el riesgo de que su trabajo se traslade a Discusiones.\nCualquier trabajo de alta calidad es sinceramente bienvenido en esta comunidad. ¿Por qué no empezar haciendo algunos circuitos útiles?\n¿Quieres saber más sobre cómo se gobierna la comunidad? ¡Se rige por usuarios como tú! Ver <discusión=5fd4ed4cb04ed000014946da>Reglamento</discusión>.",
      Ukrainian:
        "Ласкаво просимо до лабораторії фізики! Дякуємо за публікацію в спільноті.\nОднак уникайте публікації простих або безглуздих робіт у розділі «Експеримент» або довільного використання тегів. Або ви ризикуєте перенести вашу роботу в Обговорення.\nУ цій спільноті щиро вітається будь-яка якісна робота. Чому б не почати з створення корисних схем?\nХочете дізнатися більше про те, як керується громадою? Ним керують такі користувачі, як ви! Див. <discussion=5fd4ed4cb04ed000014946da>Положення</discussion>.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 10,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "627957306bcbb70f00c045aa",
    Identifier: "Experiment-Removed",
    CategoryID: 4,
    Management: false,
    Subject: {
      Chinese: "{Users} 删除了你参与的合作作品！",
      English: "{Users} removed a collaborative work.",
      ChineseTraditional: "{Users} 刪除了你參與的合作作品！",
      German: "{Users} hat eine Gemeinschaftsarbeit entfernt.",
      French: "{Users} a supprimé une œuvre collaborative.",
      Japanese: "{Users} は共同作業を削除しました。",
      Italian: "{Users} ha rimosso un lavoro collaborativo.",
      Polish: "{Users} usunęli pracę wspólną.",
      Spanish: "{Users} eliminaron un trabajo colaborativo.",
      Ukrainian: "{Users} видалили спільну роботу.",
    },
    Content: {
      Chinese: "你参与的作品 {Experiment} 已被 {Users} 删除。",
      English: "Your collaborative work {Experiment} has been removed by {Users}.",
      ChineseTraditional: "你參與的作品 {Experiment} 已被 {Users} 刪除。",
      German: "Ihre Gemeinschaftsarbeit {Experiment} wurde von {Users} entfernt.",
      French: "Votre travail collaboratif {Experiment} a été supprimé par {Users}.",
      Japanese: "あなたの共同作業 {Experiment} は {Users} によって削除されました。",
      Italian: "Il tuo lavoro collaborativo {Experiment} è stato rimosso da {Users}.",
      Polish: "Twoja wspólna praca {Experiment} została usunięta przez {Users}.",
      Spanish: "Tu trabajo colaborativo {Experiment} ha sido eliminado por {Users}.",
      Ukrainian: "Вашу спільну роботу {Experiment} було видалено {Users}.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "627957326bcbb70f00c045ab",
    Identifier: "Experiment-Hidden",
    CategoryID: 4,
    Management: false,
    Subject: {
      Chinese: "{Users} 隐藏了你参与的合作作品！",
      English: "{Users} hid a collaborative work.",
      ChineseTraditional: "{Users} 隱藏了你參與的合作作品！",
      German: "{Users} hat eine Gemeinschaftsarbeit versteckt.",
      French: "{Users} a masqué un travail collaboratif.",
      Japanese: "{Users} は共同作業を隠しました。",
      Italian: "{Users} ha nascosto un lavoro collaborativo.",
      Polish: "{Users} ukryli wspólną pracę.",
      Spanish: "{Users} escondió un trabajo colaborativo.",
      Ukrainian: "{Users} приховали спільну роботу.",
    },
    Content: {
      Chinese: "你参与的作品 {Experiment} 已被 {Users} 隐藏。",
      English: "Your collaborative work {Experiment} has been hidden by {Users}.",
      ChineseTraditional: "你參與的作品 {Experiment} 已被 {Users} 隱藏。",
      German: "Ihre Gemeinschaftsarbeit {Experiment} wurde von {Users} ausgeblendet.",
      French: "Votre travail collaboratif {Experiment} a été masqué par {Users}.",
      Japanese: "あなたの共同作業 {Experiment} は {Users} によって隠されています。",
      Italian: "Il tuo lavoro collaborativo {Experiment} è stato nascosto da {Users}.",
      Polish: "Twoja wspólna praca {Experiment} została ukryta przez {Users}.",
      Spanish: "Tu trabajo colaborativo {Experiment} ha sido ocultado por {Users}.",
      Ukrainian: "Вашу спільну роботу {Experiment} приховали {Users}.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "62daf6a40b3bc95c2c7da318",
    Identifier: "Letter-Latest-Project",
    CategoryID: 1,
    Management: false,
    Subject: {
      Chinese: "你的作品 {Experiment} 入选最新实验！",
      English: "Your work {Experiment} has been selected into Latest!",
      ChineseTraditional: "你的作品 {Experiment} 入選最新實驗！",
      German: "Ihre Arbeit {Experiment} wurde in Neueste ausgewählt!",
      French: "Votre travail {Experiment} a été sélectionné dans Latest!",
      Japanese: "あなたの作品 {Experiment} が最新に選ばれました！",
      Italian: "Il tuo lavoro {Experiment} è stato selezionato in Ultimi!",
      Polish: "Twoja praca {Experiment} została wybrana do najnowszej!",
      Spanish: "Su trabajo {Experiment} ha sido seleccionado como ¡Último!",
      Ukrainian: "Вашу роботу {Experiment} було вибрано в Останні!",
    },
    Content: {
      Chinese:
        "祝贺你，{$TargetName}！\n你的作品 {Experiment} 已经被 {Users} 选入最新实验（讨论）了。你可以在首页（黑洞）的“最新”栏目看到所有入选的实验。\n为了表彰你对物理实验室社区的贡献，50 积分和 50 经验奖励已经发送到你的帐户。你可以用它解锁更多元件！",
      English:
        "Congratulations, {$TargetName}!\nYour work {Experiment} has been selected into the latest experiments(discussions) by {Users}. We recommend you to visit more latest experiments from the homepage (black hole).\nIn order to reward your contribution to Physics Lab community, 50 Points and 50 Experiences has been sent to your account. Unlock more components now!",
      ChineseTraditional:
        "祝賀你，{$TargetName}！\n你的作品 {Experiment} 已經被 {Users} 選入最新實驗（討論）了。你可以在首頁（黑洞）的“最新”欄目看到所有入選的實驗。\n為了表彰你對物理實驗室社區的貢獻，50 積分和 50 經驗獎勵已經發送到你的帳戶。你可以用它解鎖更多元件！",
      German:
        "Herzlichen Glückwunsch, {$TargetName}!\nIhre Arbeit {Experiment} wurde von {Users} in die letzten Experimente (Diskussionen) aufgenommen. Wir empfehlen Ihnen, weitere aktuelle Experimente von der Homepage (Schwarzes Loch) zu besuchen.\nUm Ihren Beitrag zur Physiklabor-Community zu belohnen, wurden 50 Punkte und 50 Erfahrungen an Ihr Konto gesendet. Schalte jetzt weitere Komponenten frei!",
      French:
        "Félicitations, {$TargetName} !\nVotre travail {Experiment} a été sélectionné dans les dernières expériences (discussions) par {Users}. Nous vous recommandons de visiter plus d'expériences récentes à partir de la page d'accueil (trou noir).\nAfin de récompenser votre contribution à la communauté Physics Lab, 50 points et 50 expériences ont été envoyés sur votre compte. Débloquez plus de composants maintenant !",
      Japanese:
        "おめでとうございます、{$ TargetName}！\nあなたの作品{Experiment}は、{Users}によって最新の実験（ディスカッション）に選ばれました。ホームページ（ブラックホール）から最新の実験にアクセスすることをお勧めします。\nPhysics Labコミュニティへの貢献に報いるために、50ポイントと50エクスペリエンスがアカウントに送信されました。今すぐより多くのコンポーネントのロックを解除してください！",
      Italian:
        "Congratulazioni, {$TargetName}!\nIl tuo lavoro {Experiment} è stato selezionato negli ultimi esperimenti (discussioni) da {Users}. Ti consigliamo di visitare altri esperimenti più recenti dalla home page (buco nero).\nPer premiare il tuo contributo alla community di Physics Lab, sul tuo account sono stati inviati 50 punti e 50 esperienze. Sblocca più componenti ora!",
      Polish:
        "Gratulacje, {$TargetName}!\nTwoja praca {Experiment} została wybrana do najnowszych eksperymentów (dyskusji) przez {Users}. Polecamy odwiedzić więcej najnowszych eksperymentów ze strony głównej (czarna dziura).\nW celu nagrodzenia twojego wkładu w społeczność Physics Lab, 50 punktów i 50 doświadczeń zostało wysłanych na twoje konto. Odblokuj więcej komponentów już teraz!",
      Spanish:
        "¡Felicitaciones, {$TargetName}!\nSu trabajo {Experimento} ha sido seleccionado en los últimos experimentos (discusiones) por {Usuarios}. Le recomendamos que visite más experimentos recientes desde la página de inicio (agujero negro).\nPara recompensar su contribución a la comunidad Physics Lab, se han enviado a su cuenta 50 puntos y 50 experiencias. ¡Desbloquea más componentes ahora!",
      Ukrainian:
        "Вітаємо, {$TargetName}!\nВашу роботу {Experiment} було обрано в останні експерименти (обговорення) {Users}. Ми рекомендуємо вам відвідати більше останніх експериментів з головної сторінки (чорна діра).\nЩоб винагородити ваш внесок у спільноту Physics Lab, на ваш обліковий запис було надіслано 50 балів і 50 вражень. Розблокуйте більше компонентів зараз!",
    },
    Description: null,
    Bonuses: {
      Gold: 50,
      Experience: 50,
    },
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "630028699745bba0187a7d82",
    Identifier: "Comment-Hidden-Record",
    CategoryID: 5,
    Management: true,
    Subject: {
      Chinese: "{Users} 的评论（留言）被隐藏了。",
      English: "Comments of {Users} were hidden.",
      ChineseTraditional: "{Users} 的評論（留言）被隱藏了。",
      German: "Kommentare von {Users} wurden ausgeblendet.",
      French: "Les commentaires de {Users} ont été masqués.",
      Japanese: "{Users} のコメントは非表示になりました。",
      Italian: "I commenti di {Users} sono stati nascosti.",
      Polish: "Komentarze {Users} zostały ukryte.",
      Spanish: "Se ocultaron los comentarios de {Users}.",
      Ukrainian: "Коментарі {Users} були приховані.",
    },
    Content: {
      Chinese: "管理人员 {$Editor} 执行了这一操作。",
      English: "Editor {$Editor} did it.",
      ChineseTraditional: "管理人員 {$Editor} 執行了這一操作。",
      German: "Editor {$Editor} hat es geschafft.",
      French: "Le rédacteur {$Editor} l'a fait.",
      Japanese: "編集者 {$Editor} がやった。",
      Italian: "L'editore {$Editor} lo ha fatto.",
      Polish: "Redaktor {$Editor} to zrobił.",
      Spanish: "El editor {$Editor} lo hizo.",
      Ukrainian: "Це зробив редактор {$Editor}.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 1,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "6301710872635d4bfc7feb1c",
    Identifier: "Comment-Hidden-Owner",
    CategoryID: 3,
    Management: false,
    Subject: {
      Chinese: "{Users} 隐藏了你的评论（留言）。",
      English: "{Users} hide your comment.",
      ChineseTraditional: "{Users} 隱藏了你的評論（留言）。",
      German: "{Users} verbergen Ihren Kommentar.",
      French: "{Users} masquez votre commentaire.",
      Japanese: "{Users} コメントを非表示にします。",
      Italian: "{Users} nascondi il tuo commento.",
      Polish: "{Users} ukryj swój komentarz.",
      Spanish: "{Users} oculta tu comentario.",
      Ukrainian: "{Users} приховати ваш коментар.",
    },
    Content: {
      Chinese: "用户有权在自己的留言板上隐藏不适当的回复。",
      English: "Any user has the right to hide inappropriate comments in her own message board.",
      ChineseTraditional: "用戶有權在自己的留言板上隱藏不適當的回复。",
      German:
        "Jeder Benutzer hat das Recht, unangemessene Kommentare in seinem eigenen Message Board zu verbergen.",
      French:
        "Tout utilisateur a le droit de masquer les commentaires inappropriés dans son propre babillard.",
      Japanese:
        "すべてのユーザーは、自分のメッセージ ボードで不適切なコメントを非表示にする権利を有します。",
      Italian:
        "Qualsiasi utente ha il diritto di nascondere i commenti inappropriati nella propria bacheca.",
      Polish: "Każdy użytkownik ma prawo do ukrywania nieodpowiednich komentarzy na swoim forum.",
      Spanish:
        "Cualquier usuario tiene derecho a ocultar comentarios inapropiados en su propio tablero de mensajes.",
      Ukrainian:
        "Будь-який користувач має право приховати недоречні коментарі на власній дошці оголошень.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 1,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "63152e936ec60069b0754b89",
    Identifier: "Moderator-Vote-Initiated",
    CategoryID: 2,
    Management: false,
    Subject: {
      Chinese: "{Users} 发起了管理人员投票 {Experiment}。",
      English: "{Users} initiated the moderator vote {Experiment}.",
      ChineseTraditional: "{Users} 發起了管理人員投票 {Experiment}。",
      German: "{Users} hat die Moderator-Abstimmung {Experiment} initiiert.",
      French: "{Users} a initié le vote du modérateur {Experiment}.",
      Japanese: "{Users} がモデレーターの投票 {Experiment} を開始しました。",
      Italian: "{Users} ha avviato il voto da moderatore {Experiment}.",
      Polish: "{Users} zainicjowało głosowanie moderatora {Experiment}.",
      Spanish: "{Users} iniciaron el voto del moderador {Experiment}.",
      Ukrainian: "{Users} ініціювали голосування модератора {Experiment}.",
    },
    Content: {
      Chinese: "作为管理人员，你有权参与这次投票。物理实验室感谢你的参与！",
      English:
        "As a moderator, you have the right to vote. Physics Lab welcomes your participation!",
      ChineseTraditional: "作為管理人員，你有權參與這次投票。物理實驗室感謝你的參與！",
      German: "Als Moderator haben Sie ein Stimmrecht. Physics Lab freut sich über Ihre Teilnahme!",
      French:
        "En tant que modérateur, vous avez le droit de voter. Le laboratoire de physique accueille votre participation !",
      Japanese:
        "モデレーターとして、あなたには投票する権利があります。物理学研究室はあなたの参加を歓迎します！",
      Italian:
        "In qualità di moderatore, hai il diritto di voto. Physics Lab dà il benvenuto alla tua partecipazione!",
      Polish: "Jako moderator masz prawo do głosowania. Physics Lab zaprasza na Twój udział!",
      Spanish:
        "Como moderador, tiene derecho a votar. ¡Laboratorio de Física agradece su participación!",
      Ukrainian: "Ви як модератор маєте право голосу. Physics Lab запрошує до участі!",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "63152e956ec60069b0754b8a",
    Identifier: "Content-Publicized",
    CategoryID: 4,
    Management: false,
    Subject: {
      Chinese: "{Users} 公开了合作作品 {Experiment}！",
      English: "{Users} publicized your collaborative work {Experiment}.",
      ChineseTraditional: "{Users} 公開了合作作品 {Experiment}！",
      German: "{Users} hat Ihre Gemeinschaftsarbeit {Experiment} veröffentlicht.",
      French: "{Users} a rendu public votre travail collaboratif {Experiment}.",
      Japanese: "{Users} があなたの共同作業 {Experiment} を公開しました。",
      Italian: "{Users} ha pubblicizzato il tuo lavoro collaborativo {Experiment}.",
      Polish: "{Users} opublikowało Twoją wspólną pracę {Experiment}.",
      Spanish: "{Users} publicitaron su trabajo colaborativo {Experiment}.",
      Ukrainian: "{Users} опублікували вашу спільну роботу {Experiment}.",
    },
    Content: {
      Chinese: "目前，多人同时编辑作品可能导致修改被覆盖，请注意刷新同步。",
      English:
        "Having multiple users editing the same work could result in overriding each other's work.",
      ChineseTraditional: "目前，多人同時編輯作品可能導致修改被覆蓋，請注意刷新同步。",
      German:
        "Wenn mehrere Benutzer dieselbe Arbeit bearbeiten, kann dies dazu führen, dass die Arbeit des anderen außer Kraft gesetzt wird.",
      French:
        "Le fait que plusieurs utilisateurs modifient le même travail peut entraîner le remplacement du travail de l'autre.",
      Japanese: "複数のユーザーが同じ作業を編集すると、互いの作業が上書きされる可能性があります。",
      Italian:
        "Avere più utenti che modificano lo stesso lavoro potrebbe comportare l'override del lavoro dell'altro.",
      Polish:
        "Posiadanie wielu użytkowników edytujących tę samą pracę może spowodować wzajemne zastępowanie pracy.",
      Spanish:
        "Si varios usuarios editan el mismo trabajo, podría anularse el trabajo de los demás.",
      Ukrainian:
        "Якщо кілька користувачів редагують одну й ту саму роботу, це може призвести до перевизначення роботи один одного.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "63fab9a44e71cc2c38a290e1",
    Identifier: "Expiration-Volunteer",
    CategoryID: 2,
    Management: false,
    Subject: {
      Chinese: "你的志愿者任期已满。",
      English: "Your volunteer status has expired.",
      ChineseTraditional: "你的志願者任期已滿。",
      German: "Ihr Freiwilligenstatus ist abgelaufen.",
      French: "Votre statut de bénévole a expiré.",
      Japanese: "ボランティア ステータスの有効期限が切れています。",
      Italian: "Il tuo stato di volontario è scaduto.",
      Polish: "Twój status wolontariusza wygasł.",
      Spanish: "Su condición de voluntario ha caducado.",
      Ukrainian: "Ваш статус волонтера закінчився.",
    },
    Content: {
      Chinese: "编辑可以根据共识延长志愿者任期。",
      English: "Editors may re-appoint volunteers based on the consensus of the community.",
      ChineseTraditional: "編輯可以根據共識延長志願者任期。",
      German:
        "Redakteure können Freiwillige erneut ernennen, basierend auf dem Konsens der Community.",
      French:
        "Les éditeurs peuvent reconduire les bénévoles en fonction du consensus de la communauté.",
      Japanese:
        "編集者は、コミュニティのコンセンサスに基づいてボランティアを再任命することがあります。",
      Italian:
        "Gli editori possono nominare nuovamente i volontari in base al consenso della comunità.",
      Polish:
        "Redaktorzy mogą ponownie mianować wolontariuszy na podstawie konsensusu społeczności.",
      Spanish:
        "Los editores pueden volver a nombrar voluntarios según el consenso de la comunidad.",
      Ukrainian: "Редакція може повторно призначити волонтерів на основі консенсусу спільноти.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "63fab9a64e71cc2c38a290e2",
    Identifier: "Expiration-Volunteer-Record",
    CategoryID: 2,
    Management: false,
    Subject: {
      Chinese: "{Users} 的志愿者身份到期。",
      English: "{Users}'s volunteer status has expired.",
      ChineseTraditional: "{Users} 的志願者身份到期。",
      German: "Der Freiwilligenstatus von {Users} ist abgelaufen.",
      French: "Le statut de bénévole de {Users} a expiré.",
      Japanese: "{Users} さんのボランティア ステータスの有効期限が切れました。",
      Italian: "Lo stato di volontariato di {Utenti} è scaduto.",
      Polish: "Status wolontariusza {Users} wygasł.",
      Spanish: "El estado de voluntario de {Users} ha caducado.",
      Ukrainian: "Термін дії статусу волонтера {Users} закінчився.",
    },
    Content: {
      Chinese: "编辑可以根据共识延长志愿者任期。",
      English: "Editors may re-appoint volunteers based on the consensus of the community.",
      ChineseTraditional: "編輯可以根據共識延長志願者任期。",
      German:
        "Redakteure können Freiwillige erneut ernennen, basierend auf dem Konsens der Community.",
      French:
        "Les éditeurs peuvent reconduire les bénévoles en fonction du consensus de la communauté.",
      Japanese:
        "編集者は、コミュニティのコンセンサスに基づいてボランティアを再任命することがあります。",
      Italian:
        "Gli editori possono nominare nuovamente i volontari in base al consenso della comunità.",
      Polish:
        "Redaktorzy mogą ponownie mianować wolontariuszy na podstawie konsensusu społeczności.",
      Spanish:
        "Los editores pueden volver a nombrar voluntarios según el consenso de la comunidad.",
      Ukrainian: "Редакція може повторно призначити волонтерів на основі консенсусу спільноти.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "63fab9a94e71cc2c38a290e3",
    Identifier: "Expiration-Junior",
    CategoryID: 2,
    Management: false,
    Subject: {
      Chinese: "你的见习编辑任期已满。",
      English: "Your junior editor status has expired.",
      ChineseTraditional: "你的見習編輯任期已滿。",
      German: "Ihr Junior-Editor-Status ist abgelaufen.",
      French: "Votre statut d'éditeur junior a expiré.",
      Japanese: "あなたの下級編集者の資格は失効しました。",
      Italian: "Il tuo stato di redattore junior è scaduto.",
      Polish: "Twój status młodszego redaktora wygasł.",
      Spanish: "Su estado de editor junior ha expirado.",
      Ukrainian: "Ваш статус молодшого редактора закінчився.",
    },
    Content: {
      Chinese: "管理员可以根据共识正式任命编辑。",
      English:
        "Administrators may formally appoint editors based on the consensus of the community.",
      ChineseTraditional: "管理員可以根據共識正式任命編輯。",
      German:
        "Administratoren können Redakteure basierend auf dem Konsens der Community offiziell ernennen.",
      French:
        "Les administrateurs peuvent officiellement nommer des éditeurs sur la base du consensus de la communauté.",
      Japanese: "管理者は、コミュニティの合意に基づいて編集者を正式に任命することができます。",
      Italian:
        "Gli amministratori possono nominare formalmente gli editori in base al consenso della comunità.",
      Polish:
        "Administratorzy mogą formalnie mianować redaktorów na podstawie konsensusu społeczności.",
      Spanish:
        "Los administradores pueden designar editores formalmente con base en el consenso de la comunidad.",
      Ukrainian:
        "Адміністратори можуть формально призначати редакторів на основі консенсусу спільноти.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "63fab9ab4e71cc2c38a290e4",
    Identifier: "Expiration-Junior-Record",
    CategoryID: 2,
    Management: false,
    Subject: {
      Chinese: "{Users} 的见习编辑身份到期。",
      English: "{Users}'s junior editor status has expired.",
      ChineseTraditional: "{Users} 的見習編輯身份到期。",
      German: "Der Junior-Editor-Status von {Users} ist abgelaufen.",
      French: "Le statut d'éditeur junior de {Users} a expiré.",
      Japanese: "{Users} の下級編集者の資格は失効しました。",
      Italian: "Lo stato di redattore junior di {Users} è scaduto.",
      Polish: "Status młodszego redaktora użytkownika {Users} wygasł.",
      Spanish: "El estado de editor junior de {Users} ha caducado.",
      Ukrainian: "Термін дії статусу молодшого редактора {Users} закінчився.",
    },
    Content: {
      Chinese: "管理员可以根据共识正式任命编辑。",
      English:
        "Administrators may formally appoint editors based on the consensus of the community.",
      ChineseTraditional: "管理員可以根據共識正式任命編輯。",
      German:
        "Administratoren können Redakteure basierend auf dem Konsens der Community offiziell ernennen.",
      French:
        "Les administrateurs peuvent officiellement nommer des éditeurs sur la base du consensus de la communauté.",
      Japanese: "管理者は、コミュニティの合意に基づいて編集者を正式に任命することができます。",
      Italian:
        "Gli amministratori possono nominare formalmente gli editori in base al consenso della comunità.",
      Polish:
        "Administratorzy mogą formalnie mianować redaktorów na podstawie konsensusu społeczności.",
      Spanish:
        "Los administradores pueden designar editores formalmente con base en el consenso de la comunidad.",
      Ukrainian:
        "Адміністратори можуть формально призначати редакторів на основі консенсусу спільноти.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
  {
    ID: "6510e63a483928e89ed4e2e0",
    Identifier: "Experiment-Restored",
    CategoryID: 4,
    Management: false,
    Subject: {
      Chinese: "{Users} 恢复了你参与的合作作品！",
      English: "{Users} restored a collaborative work.",
      ChineseTraditional: "{Users} 恢復了你參與的合作作品！",
      German: "{Users} hat eine Gemeinschaftsarbeit wiederhergestellt.",
      French: "{Users} a restauré un travail collaboratif.",
      Japanese: "{Users} が共同作業を復元しました。",
      Italian: "{Users} hanno ripristinato un lavoro collaborativo.",
      Polish: "{Users} przywróciło wspólną pracę.",
      Spanish: "{Users} restauró un trabajo colaborativo.",
      Ukrainian: "{Users} відновили спільну роботу.",
    },
    Content: {
      Chinese: "你参与的作品 {Experiment} 已被 {Users} 恢复公开。",
      English: "Your collaborative work {Experiment} has been restored to public by {Users}.",
      ChineseTraditional: "你參與的作品 {Experiment} 已被 {Users} 恢復公開。",
      German:
        "Ihre Gemeinschaftsarbeit {Experiment} wurde von {Users} wieder öffentlich zugänglich gemacht.",
      French: "Votre travail collaboratif {Experiment} a été rendu public par {Users}.",
      Japanese: "あなたの共同作業 {Experiment} は、{Users} によって公開に復元されました。",
      Italian:
        "Il tuo lavoro collaborativo {Experiment} è stato ripristinato come pubblico da {Users}.",
      Polish: "Twoja wspólna praca {Experiment} została przywrócona publicznie przez {Users}.",
      Spanish:
        "Tu trabajo colaborativo {Experiment} ha sido restablecido como público por {Users}.",
      Ukrainian: "{Users} відновили вашу спільну роботу {Experiment}.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "6510e63d483928e89ed4e2e1",
    Identifier: "Content-Management-Restored",
    CategoryID: 4,
    Management: true,
    Subject: {
      Chinese: "{Experiment} 被恢复公开了。",
      English: "{Experiment} has been restored to public.",
      ChineseTraditional: "{Experiment} 被恢復公開了。",
      German: "{Experiment} wurde wieder öffentlich zugänglich gemacht.",
      French: "{Experiment} a été rendu public.",
      Japanese: "{Experiment} は公開に復元されました。",
      Italian: "{Experiment} è stato ripristinato come pubblico.",
      Polish: "{Experiment} został przywrócony publicznie.",
      Spanish: "{Experiment} ha sido restaurado al público.",
      Ukrainian: "{Experiment} відновлено для всіх.",
    },
    Content: {
      Chinese: "管理人员 {Users} 执行了这一操作。",
      English: "Editor {Users} did it.",
      ChineseTraditional: "管理人員 {Users} 執行了這項操作。",
      German: "Der Herausgeber {Users} hat es geschafft.",
      French: "L'éditeur {Users} l'a fait.",
      Japanese: "編集者 {Users} がそれを行いました。",
      Italian: "L'editor {Users} lo ha fatto.",
      Polish: "Redaktor {Users} to zrobił.",
      Spanish: "El editor {Users} lo hizo.",
      Ukrainian: "Редактор {Users} зробив це.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 2,
  },
  {
    ID: "66ca1620762c63c90a2c8451",
    Identifier: "Letter-Featured-Curated",
    CategoryID: 1,
    Management: false,
    Subject: {
      Chinese: "你的作品 {Experiment} 被评为优质精选！",
      English: "Your work {Experiment} is a top pick!",
      ChineseTraditional: "你的作品 {Experiment} 被評為優質精選！",
      German: "Ihre Arbeit {Experiment} ist eine Top-Auswahl!",
      French: "Votre œuvre {Experiment} est un excellent choix !",
      Japanese: "あなたの作品「{Experiment}」はトップピックです!",
      Italian: "Il tuo lavoro {Experiment} è una delle migliori scelte!",
      Polish: "Twoja praca {Eksperyment} jest najlepszym wyborem!",
      Spanish: "¡Tu trabajo {Experimento} es una excelente elección!",
      Ukrainian: "Ваша робота {Experiment} є найкращим вибором!",
    },
    Content: {
      Chinese:
        "祝贺你，{$TargetName}！\n你的作品 {Experiment} 在优质知识作品激励活动中被评为优秀精选。为表彰您对物理实验室社区的贡献，我们已向您的账户发放了 100 钻石和 1000 金币的奖励。您可以使用这些奖励解锁更多元件。\n再次感谢您的参与和贡献，我们期待您的下一个优秀作品。\n物理实验室编辑部 {$Date}",
      English:
        "Congratulations, {$TargetName}!\nIn the Summer Excellence in Knowledge Works Incentive Program, your work {Experiment} has been selected as a top pick.\nIn order to reward your contribution to Physics Lab community, 100 Diamonds and 1000 Gold has been sent to your account. Unlock more components now!\nThank you once again for your participation and contribution. We look forward to your next outstanding work.\nPhysics Lab Editorial Team, {$Date}",
      ChineseTraditional:
        "恭喜你，{$TargetName}！\n你的作品 {Experiment} 在優質知識作品激勵活動中被評為優秀精選。為表彰您對實體實驗室社群的貢獻，我們已向您的帳戶發放了 100 鑽石和 1000 金幣的獎勵。您可以使用這些獎勵解鎖更多元件。\n再次感謝您的參與和貢獻，我們期待您的下一個優秀作品。\n物理實驗室編輯部 {$Date}",
      German:
        "Herzlichen Glückwunsch, {$TargetName}!\nIm Summer Excellence in Knowledge Works Incentive Program wurde Ihre Arbeit {Experiment} als Top-Auswahl ausgewählt.\nUm Ihren Beitrag zur Physics Lab-Community zu belohnen, wurden 100 Diamanten und 1000 Gold auf Ihr Konto überwiesen. Schalten Sie jetzt weitere Komponenten frei!\nNochmals vielen Dank für Ihre Teilnahme und Ihren Beitrag. Wir freuen uns auf Ihre nächste herausragende Arbeit.\nPhysics Lab-Redaktionsteam, {$Date}",
      French:
        "Félicitations, {$TargetName} !\nDans le cadre du programme d'encouragement Summer Excellence in Knowledge Works, votre travail {Experiment} a été sélectionné comme premier choix.\nAfin de récompenser votre contribution à la communauté du Physics Lab, 100 diamants et 1 000 pièces d'or ont été envoyés sur votre compte. Débloquez plus de composants maintenant !\nMerci encore une fois pour votre participation et votre contribution. Nous attendons avec impatience votre prochain travail exceptionnel.\nÉquipe éditoriale du Physics Lab, {$Date}",
      Japanese:
        "おめでとうございます、{$TargetName}さん！\n夏の知識作業優秀奨励プログラムで、あなたの作品{Experiment}がトップピックに選ばれました。\nPhysics Labコミュニティへの貢献に報いるため、100個のダイヤモンドと1000ゴールドがあなたのアカウントに送られました。今すぐより多くのコンポーネントをアンロックしましょう！\nご参加とご貢献に改めて感謝申し上げます。次回の素晴らしい作品を楽しみにしています。\nPhysics Lab編集チーム、{$Date}",
      Italian:
        "Congratulazioni, {$TargetName}!\nNel Summer Excellence in Knowledge Works Incentive Program, il tuo lavoro {Experiment} è stato selezionato come una delle migliori scelte.\nPer premiare il tuo contributo alla comunità di Physics Lab, sono stati inviati al tuo account 100 diamanti e 1000 monete d'oro. Sblocca altri componenti ora!\nGrazie ancora una volta per la tua partecipazione e il tuo contributo. Non vediamo l'ora di vedere il tuo prossimo straordinario lavoro.\nPhysics Lab Editorial Team, {$Date}",
      Polish:
        "Gratulacje, {$TargetName}!\nW ramach programu Summer Excellence in Knowledge Works Incentive Program Twoja praca {Experiment} została wybrana jako najlepszy wybór.\nAby nagrodzić Twój wkład w społeczność Physics Lab, na Twoje konto zostało wysłane 100 diamentów i 1000 złota. Odblokuj więcej komponentów już teraz!\nJeszcze raz dziękujemy za udział i wkład. Czekamy na Twoją kolejną wybitną pracę.\nZespół redakcyjny Physics Lab, {$Date}",
      Spanish:
        "¡Felicitaciones, {$TargetName}!\nEn el Programa de incentivos de verano de Excellence in Knowledge Works, su trabajo {Experiment} ha sido seleccionado como una de las mejores opciones.\nPara recompensar su contribución a la comunidad de Physics Lab, se han enviado 100 diamantes y 1000 de oro a su cuenta. ¡Desbloquee más componentes ahora!\nGracias una vez más por su participación y contribución. Esperamos con ansias su próximo trabajo sobresaliente.\nEquipo editorial de Physics Lab, {$Date}",
      Ukrainian:
        "Вітаємо, {$TargetName}!\nУ програмі заохочення Summer Excellence in Knowledge Works Incentive Program вашу роботу {Experiment} було обрано як найкращу.\nЩоб винагородити ваш внесок у спільноту Physics Lab, на ваш рахунок було надіслано 100 діамантів і 1000 золота. Розблокуйте більше компонентів зараз!\nЩе раз дякую за участь і внесок. Ми з нетерпінням чекаємо вашої наступної видатної роботи.\nРедакційна група Physics Lab, {$Date}",
    },
    Description: null,
    Bonuses: {
      Diamond: 100,
      Gold: 1000,
    },
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "66d210368c1a9a5dbc238434",
    Identifier: "User-Warned-Record",
    CategoryID: 5,
    Management: true,
    Subject: {
      Chinese: "管理人员 {$Editor} 警告了用户 {Users}。",
      English: "Editor {$Editor} warned the user {Users}.",
      ChineseTraditional: "管理人員 {$Editor} 警告了使用者 {Users}。",
      German: "Der Redakteur {$Editor} hat den Benutzer {Users} gewarnt.",
      French: "L'éditeur {$Editor} a averti l'utilisateur {Users}.",
      Japanese: "編集者 {$Editor} がユーザー {Users} に警告しました。",
      Italian: "L'editor {$Editor} ha avvisato l'utente {Users}.",
      Polish: "Redaktor {$Editor} ostrzegł użytkownika {Users}.",
      Spanish: "El editor {$Editor} advirtió al usuario {Users}.",
      Ukrainian: "Редактор {$Editor} попередив користувача {Users}.",
    },
    Content: {
      Chinese: "@{$Editor}: {$Content}",
      English: "@{$Editor}: {$Content}",
      ChineseTraditional: "@{$Editor}: {$Content}",
      German: "@{$Editor}: {$Content}",
      French: "@{$Editor}: {$Content}",
      Japanese: "@{$Editor}: {$Content}",
      Italian: "@{$Editor}: {$Content}",
      Polish: "@{$Editor}: {$Content}",
      Spanish: "@{$Editor}: {$Content}",
      Ukrainian: "@{$Editor}: {$Content}",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 1,
  },
];

const { notificationTypeIndexOfUI } = defineProps(["notificationTypeIndexOfUI"]);

/**
 * 紫兰斋的编号与UI不一致
 */
function convertCategoryIDToUIIndex(n: Number) {
  return n === 2 ? 3 : n === 3 ? 2 : n;
}

function convertUIIndexToCategoryID(n: Number) {
  return n === 3 ? 2 : n === 2 ? 3 : n;
}

/**
 * 由模板和数据渲染通知
 */
function fillInTemplate(data: String, message: Message) {
  // 等待实现的actions:showComment
  const re = data
    .replace(
      /{Users}/g,
      message.Users.map((user, index) => `<user=${user}>${message.UserNames[index]}</user>`).join(
        " "
      )
    )
    .replace(
      /{Experiment}/g,
      message.Fields?.Discussion
        ? `<discussion=${message.Fields?.DiscussionID}>${message.Fields?.Discussion}</discussion>`
        : `<experiment${message.Fields?.ExperimentID}>${message.Fields?.Experiment}</experiment>`
    )
    .replace(/{\$Content}/g, message.Fields.Content)
    .replace(/{\$TargetName}/g, localStorage.getItem("nickName") || "朋友")
    .replace(/{\$Until}/g, message.Fields.Unitl)
    .replace(/{\$Editor}/g, message.Fields.Editor)
    .replace(/{\$Gold}/g, message.Numbers?.Gold)
    .replace(/undefined/g, "");
  return re;
}

async function renderTemplateWithData(messages: Message[]) {
  const avatarPromises = messages.map((message) => getAvatarUrl(message.Users[0], true));
  const avatarUrls = await Promise.all(avatarPromises);
  saveCache()

  return messages.map((message, index) => {
    const template = templates.find((t: Template) => t.ID === message.TemplateID);
    return {
      id: message.ID,
      avatar_url:
        convertCategoryIDToUIIndex(message.CategoryID) == 1
          ? "/src/assets/messages/Message-Unread.png"
          : avatarUrls[index],
      // 因为有缓存的原因，即使多一个请求也不是什么大问题（编辑的头像在社区活动出现频率蛮高的）所以暂时不改
      // 暂时不管读不读了，也没人在意
      msg_title: fillInTemplate(template.Subject.Chinese, message),
      msg: fillInTemplate(template.Content.Chinese, message),
      msg_type: convertCategoryIDToUIIndex(message.CategoryID),
      category: message.Fields?.User
        ? "User"
        : message.Fields?.Discussion
        ? "Discussion"
        : "Experiment",
      tid: message.Fields?.UserID || message.Fields?.DiscussionID || message.Fields?.ExperimentID,
      name: message.Fields?.Discussion || message.Fields?.Experiment || message.Fields?.User,
      uid: message.Users[0],
    };
  });
}

// 处理加载事件
const handleLoad = async (noTemplates = true) => {
  if (loading.value) return;
  loading.value = true;
  window.$message.loading("加载中...", { duration: 1e3 });
  try {
    const getMessagesResponse = await getData("/Messages/GetMessages", {
      CategoryID: convertUIIndexToCategoryID(notificationTypeIndexOfUI),
      Take: 20,
      Skip: skip,
      NoTemplates: noTemplates,
    });

    if (!noTemplates) {
      templates = getMessagesResponse.Data.Templates as Template[];
    }

    const messages = getMessagesResponse.Data.Messages;

    // 先设置默认头像
    const defaultItems = messages.map((message: Message) => {
      const template = templates.find((t: Template) => t.ID === message.TemplateID);
      return {
        id: message.ID,
        avatar_url: "/src/assets/user/default-avatar.png", // 设置默认头像
        msg_title: fillInTemplate(template.Subject.Chinese, message),
        msg: fillInTemplate(template.Content.Chinese, message),
        msg_type: convertCategoryIDToUIIndex(message.CategoryID),
        category: message.Fields?.User
          ? "User"
          : message.Fields?.Discussion
          ? "Discussion"
          : "Experiment",
        tid: message.Fields?.UserID || message.Fields?.DiscussionID || message.Fields?.ExperimentID,
        name: message.Fields?.Discussion || message.Fields?.Experiment || message.Fields?.User,
        uid: message.Users[0],
      };
    });

    items.value = [...items.value, ...defaultItems];

    loading.value = false; // 我认为完全可以允许在本次头像渲染未完成的情况下渲染下一次

    // 并发请求新的头像地址
    const newItems = await renderTemplateWithData(messages);
    items.value = items.value.map((item) => {
      const newItem = newItems.find((ni) => ni.id === item.id);
      return newItem ? { ...item, avatar_url: newItem.avatar_url } : item;
    });

    skip += 20;
  } catch (error) {
    console.error("加载消息失败", error);
  }
};

// 初始加载数据
handleLoad(false);
</script>

<style scoped>
.text {
  text-align: center;
  /* padding: 10px; */
  color: #888;
}

.list {
  height: 100%;
  padding-bottom: 60px;
}
</style>

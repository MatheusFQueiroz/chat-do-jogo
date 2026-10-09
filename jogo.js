'use strict';
/* Chat do Jogo: segurança no jogo online, numa sala de chat de mentira. Sem pontos, vidas ou recordes.
   Ícones: icones.js (IconPark + desenhos próprios). Nenhum jogador, empresa ou site citado é real. */
var TINTA='#2B2550';
var C={roxo:'#6C4FE0',roxoEsc:'#4B33B0',lima:'#B8F25B',limaEsc:'#7FBF1E',verde:'#2BB673',coral:'#FF6B6B',amarelo:'#FFD166',azul:'#4CC3FF',laranja:'#FF9F43',cinza:'#6B6490',rosa:'#FF7AB6'};
function clareia(hex,t){var n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;r=Math.round(r+(255-r)*t);g=Math.round(g+(255-g)*t);b=Math.round(b+(255-b)*t);return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1);}
function icone(nome,cor,cor2){if(!ICONES[nome])nome='game-handle';var corpo=ICONES[nome].replace(/"#000"/g,'"'+TINTA+'"').replace(/#2F88FF/gi,cor||C.roxo).replace(/#43CCF8/gi,cor2||clareia(cor||C.roxo,.55));return '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true">'+corpo+'</svg>';}
function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function $(id){return document.getElementById(id);}
function emb(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function escapa(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');}

/* ---------------- estado ---------------- */
var CHAVE='chat-do-jogo-salas';
var est={feitas:[],som:false,anim:!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches),livre:false,turma:false,apelido:'',regras:[]};
try{var s=JSON.parse(localStorage.getItem(CHAVE)||'null');if(s)Object.keys(s).forEach(function(k){est[k]=s[k];});}catch(e){}
function salva(){try{localStorage.setItem(CHAVE,JSON.stringify(est));}catch(e){}}
function aplicaAjustes(){document.body.classList.toggle('sem-animacao',!est.anim);document.body.classList.toggle('turma',!!est.turma);}
aplicaAjustes();
function apelido(){return est.apelido||'Foguete10';}

/* ---------------- sons e voz (só quando ligados) ---------------- */
var ctx;
function tom(freqs){if(!est.som)return;try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();freqs.forEach(function(f,i){var o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+i*.12;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.08,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+.35);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+.4);});}catch(e){}}
var SOM={certo:[523,659,784],quase:[330,294],fim:[523,659,784,1047],clique:[440],msg:[660,880]};
function fala(t){try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(String(t).replace(/<[^>]+>/g,''));u.lang='pt-BR';u.rate=.9;speechSynthesis.speak(u);}catch(e){}}
function confete(){if(!est.anim)return;var cores=[C.roxo,C.lima,C.verde,C.coral,C.amarelo,C.azul];for(var i=0;i<28;i++){var c=el('div','confete');c.style.left=(Math.random()*100)+'vw';c.style.background=cores[i%6];c.style.borderRadius=i%3===0?'50%':'3px';c.style.setProperty('--dx',(Math.random()*160-80)+'px');c.style.setProperty('--giro',(Math.random()*720-360)+'deg');c.style.setProperty('--dur',(2.4+Math.random()*1.4)+'s');c.style.setProperty('--atraso',(Math.random()*.5)+'s');document.body.appendChild(c);setTimeout(c.remove.bind(c),4600);}}

/* ---------------- Pixel, a gata moderadora ---------------- */
function pixel(cls){return '<svg class="pixel '+(cls||'')+'" viewBox="0 0 120 110" aria-hidden="true">'+
 '<ellipse cx="60" cy="103" rx="40" ry="6" fill="rgba(43,37,80,.12)"/>'+
 '<g class="p-rabo"><path d="M86 84q22 2 24-16" fill="none" stroke="#6C4FE0" stroke-width="9" stroke-linecap="round"/><path d="M86 84q22 2 24-16" fill="none" stroke="'+TINTA+'" stroke-width="3" stroke-linecap="round" stroke-dasharray="0 0" opacity="0"/></g>'+
 '<g class="p-corpo">'+
 '<ellipse cx="58" cy="78" rx="30" ry="24" fill="#8A72F2" stroke="'+TINTA+'" stroke-width="3"/><ellipse cx="58" cy="82" rx="16" ry="13" fill="#EDE8FF"/>'+
 '<rect x="36" y="86" width="12" height="14" rx="6" fill="#6C4FE0" stroke="'+TINTA+'" stroke-width="3"/><rect x="68" y="86" width="12" height="14" rx="6" fill="#6C4FE0" stroke="'+TINTA+'" stroke-width="3"/>'+
 '<path d="M24 22l12 14h40l12-14v30q0 20-32 20T24 52Z" fill="#8A72F2" stroke="'+TINTA+'" stroke-width="3" stroke-linejoin="round"/>'+
 '<path d="M30 28l6 8h8Z M90 28l-6 8h-8Z" fill="#FFB7D5" stroke="'+TINTA+'" stroke-width="2" stroke-linejoin="round"/>'+
 '<ellipse cx="58" cy="54" rx="12" ry="8" fill="#EDE8FF"/>'+
 '<g class="p-olhos"><ellipse cx="46" cy="46" rx="4.5" ry="5" fill="'+TINTA+'"/><ellipse cx="70" cy="46" rx="4.5" ry="5" fill="'+TINTA+'"/><circle cx="47.5" cy="44" r="1.5" fill="#fff"/><circle cx="71.5" cy="44" r="1.5" fill="#fff"/></g>'+
 '<path d="M55 54h6l-3 3Z" fill="#FF7AB6" stroke="'+TINTA+'" stroke-width="1.5" stroke-linejoin="round"/><path d="M52 60q6 4 12 0" fill="none" stroke="'+TINTA+'" stroke-width="2.5" stroke-linecap="round"/>'+
 '<path d="M14 50h16M14 58l16-2M106 50H90M106 58l-16-2" stroke="'+TINTA+'" stroke-width="2.5" stroke-linecap="round"/>'+
 '<path d="M22 44q0-24 36-24t36 24" fill="none" stroke="'+TINTA+'" stroke-width="7" stroke-linecap="round"/><path d="M22 44q0-24 36-24t36 24" fill="none" stroke="#B8F25B" stroke-width="3.5" stroke-linecap="round"/>'+
 '<rect x="14" y="40" width="14" height="18" rx="6" fill="#B8F25B" stroke="'+TINTA+'" stroke-width="3"/><rect x="92" y="40" width="14" height="18" rx="6" fill="#B8F25B" stroke="'+TINTA+'" stroke-width="3"/>'+
 '<path d="M28 56q-2 14 14 14" fill="none" stroke="'+TINTA+'" stroke-width="3" stroke-linecap="round"/><circle cx="43" cy="70" r="3.5" fill="#FF7AB6" stroke="'+TINTA+'" stroke-width="2"/>'+
 '</g></svg>';}
function balaoPixel(titulo,texto,cls,extra){return '<div class="fala">'+pixel(cls)+'<div class="balao">'+(titulo?'<b>'+titulo+'</b>':'')+texto+(extra||'')+'</div></div>';}

/* ======================================================================
   AVATARES e textos padrão
   ====================================================================== */
var AV={PandaFeliz:'panda',Raio123:'lightning',Estrela_10:'star',MOEDAS_GRATIS:'gift',Trovao_X:'ghost',Jogador_777:'crown',Desconhecido_09:'help',Desconhecido_22:'help',Bia_Gamer:'bear',Tuca_Bit:'robot-one',Lua_Star:'moon',Novato_01:'rocket',Dino_Rex:'dog',Hacker_Pro:'ghost',Sorteio_Oficial:'gift',Suporte_Jogo:'headset-one',Amigo_Legal:'smiling-face',Dono_do_Jogo:'crown',Vizinho_Legal:'home',Jogo:'game-handle',Pixel:'gato'};
var TURMA={Bia_Gamer:1,Tuca_Bit:1,Lua_Star:1};   // colegas de verdade da turma
var ACOES=[{v:'ok',t:'Tudo bem',s:'é só conversa de jogo',ic:'good',cor:C.verde},{v:'gentil',t:'Responder com gentileza',s:'alguém precisa de ajuda ou de ânimo',ic:'heart',cor:C.rosa},{v:'bloq',t:'Bloquear e contar para um adulto',s:'pediu dado, foto, senha ou segredo',ic:'escudo',cor:C.roxo},{v:'den',t:'Denunciar',s:'xingamento, ameaça ou golpe',ic:'denunciar',cor:C.coral}];
var SEMAF=[{v:'pode',t:'Pode falar',s:'não conta quem eu sou nem onde moro',cls:'verde',ic:'good',cor:C.verde},{v:'adulto',t:'Só com um adulto junto',s:'um adulto de confiança decide comigo',cls:'amarela',ic:'family',cor:C.amarelo},{v:'nunca',t:'Nunca',s:'é segredo meu e da minha família',cls:'vermelha',ic:'forbid',cor:C.coral}];
var DICAS=['Pense de novo: isso deixa você seguro?','Pense: isso conta algo seu para quem você não conhece?','Pense de novo: isso é gentil com a pessoa do outro lado?','Lembre: na dúvida, um adulto de confiança ajuda a decidir.'];
var ELOGIO_ADULTO=['Boa! Chamar um adulto de confiança é sempre uma boa escolha. Vamos continuar.','Isso mesmo. Quando algo estranho acontece no jogo, um adulto ajuda a decidir.','Chamar um adulto nunca é bobagem. Pode continuar com calma.'];

/* ======================================================================
   SALAS (cada sala é uma fase; cada item é uma mensagem com escolha)
   de = quem manda · tipo = turma | desc (desconhecido) | sys (aviso do jogo)
   o = opções [texto, 1 se segura, resposta que aparece no chat]
   ====================================================================== */
var SALAS=[
 {id:'entrada',nome:'Sala de espera',sub:'Apelido e perfil',cor:C.roxo,ic:'user',desc:'Escolha um apelido e monte um perfil que não conta quem você é.',
  intro:'Bem-vindo ao jogo! Antes de entrar, você monta o seu perfil. A regra é simples: o apelido e o perfil não contam quem você é nem onde você mora.',
  regra:'No jogo eu uso um apelido. Nome completo, idade, escola, endereço e telefone não entram no perfil.',
  itens:[
   {de:'Jogo',tipo:'sys',msg:'Escolha o seu apelido para o jogo:',apelidos:true,o:[['Foguete10',1],['Trovao7',1],['Pipoca42',1],['AnaSilva2015',0]],tit:'Apelido bom!',x:'Um bom apelido não conta o seu nome nem o ano em que você nasceu. "AnaSilva2015" conta os dois.'},
   {de:'Jogo',tipo:'sys',msg:'Escolha a imagem do seu perfil:',o:[['Um desenho de raposa',1,'Escolhi o desenho da raposa.'],['Uma foto do meu rosto',0],['Uma foto da frente da minha casa',0]],tit:'Avatar é desenho!',x:'No jogo, o avatar é um desenho. Foto do rosto mostra quem você é, e foto da casa mostra onde você mora.'},
   {de:'Jogo',tipo:'sys',msg:'Quer colocar o nome da sua escola no perfil?',o:[['Não coloco.',1,'Não vou colocar a escola.'],['Coloco, assim meus amigos me acham.',0]],tit:'Escola fica de fora!',x:'Seus amigos já sabem em que escola você estuda. Quem não conhece você não precisa saber.'},
   {de:'Jogo',tipo:'sys',msg:'Quer mostrar a sua idade no perfil?',o:[['Não mostro.',1,'Idade não vai no perfil.'],['Mostro, não tem problema.',0]],tit:'Idade também fica guardada!',x:'A idade é um dado pessoal. Com ela, um estranho sabe que está falando com uma criança.'},
   {de:'Jogo',tipo:'sys',msg:'O perfil pede uma frase sobre você. Qual você escreve?',o:[['Gosto de jogos de corrida e de pizza.',1,'Escrevi: gosto de jogos de corrida e de pizza.'],['Moro na Rua das Flores, 12, e estudo de manhã.',0],['Meu telefone é 9 8888-7777, me chama!',0]],tit:'Frase segura!',x:'Falar do que você gosta é legal. Endereço, horário e telefone contam onde e quando encontrar você.'},
   {de:'Bia_Gamer',tipo:'turma',msg:'Oi! Vi que você entrou. Vamos jogar na mesma equipe?',o:[['Bora! Entro na sua equipe.',1,'Bora! Entro na sua equipe.'],['Não falo com ninguém no jogo.',0]],tit:'Com colegas de verdade, pode!',x:'A Bia é da sua turma: conversar com ela no jogo é como conversar no recreio. O cuidado maior é com quem você não conhece.'},
   {de:'Raio123',tipo:'desc',msg:'Oi! Você é novo aqui? De qual cidade você é?',o:[['Sou novo sim! Mas cidade e endereço eu não conto.',1,'Sou novo sim! Mas cidade e endereço eu não conto.'],['Sou de Toledo, moro perto da escola.',0]],tit:'Cidade não conta!',x:'O Raio123 é um desconhecido. Ser educado é bom, mas onde você mora não é assunto para o chat.'},
   {de:'Jogo',tipo:'sys',msg:'Alguém consegue descobrir quem você é só pelo seu apelido?',o:[['Não. Apelido não conta quem eu sou.',1,'Não. Apelido não conta quem eu sou.'],['Sim, dá pra descobrir tudo.',0]],tit:'Exatamente!',x:'É para isso que o apelido existe: você se diverte no jogo e a sua vida de verdade fica protegida.'}
  ]},
 {id:'gentileza',nome:'Corrida dos bichos',sub:'Gentileza no chat',cor:C.verde,ic:'heart',desc:'Do outro lado da tela tem uma pessoa de verdade.',
  intro:'Nesta sala a gente joga a Corrida dos Bichos. Enquanto corre, o chat não para. Lembre: do outro lado da tela tem uma pessoa de verdade.',
  regra:'Gentileza também vale no chat. Quem provoca, eu não sigo; quem precisa, eu ajudo.',
  itens:[
   {de:'PandaFeliz',tipo:'desc',msg:'Boa partida! Vamos jogar de novo?',o:[['Bora! Boa partida pra você também!',1,'Bora! Boa partida pra você também!'],['Sai daqui, você é chato!',0]],tit:'Gentileza também vale no jogo!',x:'Ser gentil no chat é igual a ser gentil no recreio. Custa pouco e deixa o jogo bom para todo mundo.'},
   {de:'Bia_Gamer',tipo:'turma',msg:'Perdi de novo... sou muito ruim nisso.',o:[['Nada disso! Você está melhorando. Quer uma dica?',1,'Nada disso! Você está melhorando. Quer uma dica?'],['É, você é ruim mesmo haha.',0]],tit:'Uma palavra boa muda o dia!',x:'Quando um colega está triste, animar vale mais do que ganhar a corrida.'},
   {de:'Raio123',tipo:'desc',msg:'GANHEI!!! vocês são lixo kkkkk',o:[['Parabéns pela vitória. Boa partida!',1,'Parabéns pela vitória. Boa partida!'],['Lixo é você!',0],['Vou xingar a família dele.',0]],tit:'Você não entrou na briga!',x:'Quando alguém provoca, responder com calma (ou não responder) é o jeito de não deixar a briga crescer.'},
   {de:'Tuca_Bit',tipo:'turma',msg:'Não sei como pular o rio. Alguém ajuda?',o:[['Aperta o botão verde e depois o azul. Eu te mostro!',1,'Aperta o botão verde e depois o azul. Eu te mostro!'],['Descobre sozinho.',0]],tit:'Ajudar é jogar junto!',x:'Explicar para quem não sabe é uma das coisas mais legais de jogar em equipe.'},
   {de:'Novato_01',tipo:'desc',msg:'oi, é minha primeira vez. Como joga?',o:[['Oi! É fácil: você corre pela pista e desvia das pedras. Boa sorte!',1,'Oi! É fácil: você corre pela pista e desvia das pedras. Boa sorte!'],['Ninguém te chamou aqui.',0]],tit:'Bem-vindo ao novato!',x:'Todo mundo foi novato um dia. Ajudar com o jogo é gentil e não conta nada seu.'},
   {de:'Lua_Star',tipo:'turma',msg:'eu escrvi errado kkk desculpa',o:[['Relaxa, todo mundo erra. Entendi!',1,'Relaxa, todo mundo erra. Entendi!'],['Aprende a escrever, burro.',0]],tit:'Erro de digitação não é motivo de zoeira!',x:'Zoar o erro do colega é um jeito de maltratar. Entender e seguir em frente é o jeito gentil.'},
   {de:'Jogo',tipo:'sys',msg:'A partida acabou. O que você escreve no chat?',o:[['Boa partida, pessoal! Até a próxima.',1,'Boa partida, pessoal! Até a próxima.'],['Vocês jogam muito mal.',0]],tit:'Que jeito bom de terminar!',x:'Terminar a partida com um "boa partida" deixa todo mundo com vontade de jogar de novo.'}
  ]},
 {id:'dados',nome:'Base secreta',sub:'Meus dados pessoais',cor:C.azul,ic:'lock',desc:'Nome, escola, endereço, telefone, foto: o que fica guardado.',
  intro:'Esta é a Base Secreta. Aqui a gente guarda o que é só nosso: nome completo, escola, endereço, telefone, idade e fotos. No chat, isso não se conta para quem a gente não conhece.',
  regra:'Meus dados pessoais são segredo meu e da minha família: nome completo, escola, endereço, telefone, idade e foto.',
  itens:[
   {de:'Raio123',tipo:'desc',msg:'Qual é o nome da sua escola?',o:[['Não conto. Isso fica guardado.',1,'Não conto. Isso fica guardado.'],['Conto o nome da escola.',0]],tit:'Isso fica guardado!',x:'Nome da escola, endereço e telefone são dados pessoais. No jogo, a gente não conta para quem não conhece.'},
   {de:'Estrela_10',tipo:'desc',msg:'Qual é o seu nome de verdade?',o:[['No jogo eu sou só [apelido].',1,'No jogo eu sou só [apelido].'],['Falo meu nome completo.',0]],tit:'Apelido pode!',x:'No jogo a gente usa um apelido. O nome completo fica guardado.'},
   {de:'Dino_Rex',tipo:'desc',msg:'Me passa seu número de celular pra gente conversar no zap?',o:[['Não passo. A gente conversa aqui mesmo.',1,'Não passo. A gente conversa aqui mesmo.'],['Passo o número.',0]],tit:'Telefone não!',x:'Com o número do celular, um desconhecido chega até você fora do jogo. Isso fica guardado.'},
   {de:'Bia_Gamer',tipo:'turma',msg:'Que horas você sai da escola amanhã? Vamos jogar depois!',o:[['Combino com você amanhã na escola!',1,'Combino com você amanhã na escola!'],['Saio às 11h30 e vou sozinho pra casa.',0]],tit:'Combinar ao vivo é mais seguro!',x:'Parece a Bia, mas no chat não dá para ter certeza de quem está do outro lado. Horário e caminho a gente combina pessoalmente.'},
   {de:'Vizinho_Legal',tipo:'desc',msg:'Em que rua você mora? Acho que sou seu vizinho!',o:[['Não conto onde moro.',1,'Não conto onde moro.'],['Conto a rua, ele é vizinho.',0]],tit:'Vizinho de verdade não pergunta pelo chat!',x:'Quem mora perto não precisa perguntar o endereço num jogo. Isso é um sinal de alerta.'},
   {de:'Jogador_777',tipo:'desc',msg:'Quando é seu aniversário? Vou te mandar um presente!',o:[['Não conto a data.',1,'Não conto a data.'],['Conto, quero o presente!',0]],tit:'Data de nascimento também é dado pessoal!',x:'Presente de desconhecido é um sinal de alerta, não de amizade. A data de nascimento fica guardada.'},
   {de:'Jogo',tipo:'sys',msg:'Para liberar uma skin especial, envie uma foto sua.',o:[['Não mando foto. Chamo um adulto para ver isso.',1,'Não vou mandar foto. Vou chamar um adulto.'],['Mando a foto rapidinho.',0]],tit:'Foto fica guardada!',x:'Jogo de verdade não precisa da sua foto para dar skin. Quando pedem foto, chame um adulto na hora.'},
   {de:'Desconhecido_09',tipo:'desc',msg:'Manda a foto da sua casa pra eu ver onde você mora',o:[['Não mando. Isso é meu e da minha família.',1,'Não mando. Isso é meu e da minha família.'],['Mando a foto.',0]],tit:'Casa é lugar protegido!',x:'A foto da casa mostra onde você mora. Isso nunca vai para um desconhecido.'},
   {de:'Jogo',tipo:'sys',msg:'Semáforo: posso falar no chat qual é o meu jogo favorito?',sem:true,c:'pode',tit:'Pode falar!',x:'Seu jogo favorito não conta quem você é nem onde mora. Pode conversar sobre isso.'},
   {de:'Jogo',tipo:'sys',msg:'Semáforo: posso falar no chat qual é a minha cor preferida?',sem:true,c:'pode',tit:'Pode falar!',x:'Cor preferida, comida favorita, time do coração: tudo isso pode. Não entrega a sua vida de verdade.'},
   {de:'Jogo',tipo:'sys',msg:'Semáforo: posso falar no chat qual é a minha senha?',sem:true,c:'nunca',tit:'Nunca!',x:'Senha é só sua e da sua família. Nem para o melhor amigo, nem para quem diz ser do jogo.'},
   {de:'Jogo',tipo:'sys',msg:'Semáforo: posso falar no chat o endereço da minha casa?',sem:true,c:'nunca',tit:'Nunca!',x:'O endereço mostra onde encontrar você. Fica guardado sempre.'},
   {de:'Jogo',tipo:'sys',msg:'Semáforo: posso combinar de encontrar alguém que conheci no jogo?',sem:true,c:'adulto',tit:'Só com um adulto junto!',x:'Encontrar alguém do jogo nunca é decisão só sua. Um adulto de confiança precisa saber e decidir com você.'},
   {de:'Jogo',tipo:'sys',msg:'Semáforo: posso mandar uma foto minha para alguém do jogo?',sem:true,c:'adulto',tit:'Só com um adulto junto!',x:'Foto é dado pessoal. Se alguém do jogo pede foto, um adulto precisa saber antes de qualquer coisa.'}
  ]},
 {id:'golpes',nome:'Loja de prêmios',sub:'Links e golpes',cor:C.laranja,ic:'gift',desc:'Prêmio fácil demais, pressa e link estranho: armadilhas.',
  intro:'Na Loja de Prêmios aparecem ofertas incríveis: moedas grátis, skins, sorteios. Prêmio fácil demais é armadilha. Golpe adora pressa, susto e link.',
  regra:'Link estranho eu não clico, programa de desconhecido eu não baixo, e prêmio que pede meus dados é golpe. Chamo um adulto.',
  itens:[
   {de:'MOEDAS_GRATIS',tipo:'desc',msg:'Quer 1000 moedas grátis? Clique neste link!',o:[['Não clico e chamo um adulto.',1,'Não vou clicar. Vou chamar um adulto.'],['Clico rapidinho.',0]],tit:'Não clicou. Muito bem!',x:'Prêmio fácil demais é armadilha. Um link estranho pode roubar a sua conta ou estragar o aparelho.'},
   {de:'Jogo',tipo:'sys',msg:'ATENÇÃO: sua conta será apagada em 10 minutos! Clique aqui para salvar.',o:[['Não clico. Mensagem com pressa e susto é golpe. Chamo um adulto.',1,'Não vou clicar. Isso parece golpe.'],['Clico correndo pra não perder a conta.',0]],tit:'Golpe adora pressa!',x:'Mensagem que assusta e manda correr é um truque. A empresa do jogo não manda link assim no chat.'},
   {de:'Hacker_Pro',tipo:'desc',msg:'Baixa esse programa que você ganha sempre!',o:[['Não baixo nada de desconhecido.',1,'Não baixo nada de desconhecido.'],['Baixo, quero ganhar!',0]],tit:'Nada de programa estranho!',x:'Programa de desconhecido pode roubar a conta, espiar o computador ou estragar tudo. Baixar só com um adulto.'},
   {de:'Sorteio_Oficial',tipo:'desc',msg:'Parabéns! Você ganhou! Me passa seu e-mail e o nome da sua mãe para receber.',o:[['Não passo nada. Prêmio que pede dados é golpe.',1,'Não passo nada. Isso é golpe.'],['Passo o e-mail da mamãe.',0]],tit:'Prêmio que pede dado é golpe!',x:'Você não entrou em sorteio nenhum. Quem pede dados para "entregar o prêmio" quer os seus dados, não dar prêmio.'},
   {de:'Suporte_Jogo',tipo:'desc',msg:'Oi, sou do suporte. Me manda o código que chegou no seu celular.',o:[['Não mando código nenhum. Chamo um adulto.',1,'Não mando código nenhum. Vou chamar um adulto.'],['Mando o código.',0]],tit:'Código é chave da conta!',x:'O código que chega no celular é uma chave da conta. Suporte de verdade nunca pede isso no chat.'},
   {de:'Raio123',tipo:'desc',msg:'Entra nesse site pra ver minha skin nova: ganhe-skins-gratis.com',o:[['Não entro em site estranho.',1,'Não entro em site estranho.'],['Entro pra ver.',0]],tit:'Site estranho, não!',x:'Mesmo quando parece amizade, link de site desconhecido pode ser armadilha. Skin de verdade fica dentro do jogo.'},
   {de:'Jogador_777',tipo:'desc',msg:'Quer ser moderador do jogo? Me manda seu nome completo e endereço.',o:[['Não mando. Isso não existe.',1,'Não mando. Isso não existe.'],['Mando, quero ser moderador!',0]],tit:'Você percebeu o truque!',x:'Ninguém vira moderador mandando dados para um jogador. É só um jeito de pedir seus dados.'},
   {de:'Jogo',tipo:'sys',msg:'Detector de golpe: toque na mensagem que é golpe.',det:true,o:[['"Boa partida! Vamos de novo?"',0],['"URGENTE: clique aqui para não perder sua conta!"',1,'Essa é golpe: pressa, susto e link.'],['"Alguém me ajuda a pular o rio?"',0]],tit:'Detector ligado!',x:'Pressa, susto e link juntos: é a cara do golpe. As outras duas são conversa normal de jogo.'}
  ]},
 {id:'senha',nome:'Cofre',sub:'Senha e conta',cor:C.amarelo,ic:'key',desc:'Senha é segredo. Conta é só sua e da sua família.',
  intro:'O Cofre guarda a coisa mais importante da sua conta: a senha. Senha é só sua e da sua família. Quem pede senha quer entrar na sua conta.',
  regra:'Senha é segredo meu e da minha família. Cada lugar tem a sua, e eu saio da conta quando termino.',
  itens:[
   {de:'Jogador_777',tipo:'desc',msg:'Me fala a sua senha que eu te dou um item raro.',o:[['Não falo. Senha é segredo.',1,'Não falo. Senha é segredo.'],['Falo a senha para ganhar o item.',0]],tit:'Senha é segredo!',x:'A senha é só sua e da sua família. Quem pede senha quer entrar na sua conta.'},
   {de:'Bia_Gamer',tipo:'turma',msg:'Me empresta sua conta só hoje? Prometo devolver.',o:[['Não empresto, nem pra amiga. Conta é só minha e da minha família.',1,'Não empresto, nem pra amiga. Conta é só minha e da minha família.'],['Empresto, ela é minha amiga.',0]],tit:'Conta não se empresta!',x:'Mesmo amigo de verdade não usa a sua conta. Se der problema, é você quem perde.'},
   {de:'Jogo',tipo:'sys',msg:'Hora de criar uma senha. Qual é a mais segura?',o:[['Pipoca!Azul#2024',1,'Escolhi: Pipoca!Azul#2024'],['1234',0],['meunome',0]],tit:'Senha forte!',x:'Senha forte é comprida, mistura letras, números e símbolos, e ninguém adivinha. Nunca o seu nome ou "1234".'},
   {de:'Jogo',tipo:'sys',msg:'Usar a mesma senha no jogo, no e-mail e na escola?',o:[['Não. Cada lugar, uma senha.',1,'Não. Cada lugar, uma senha.'],['Sim, é mais fácil de lembrar.',0]],tit:'Cada lugar, uma senha!',x:'Se alguém descobre uma, descobre todas. Um adulto pode ajudar a guardar as senhas num lugar seguro.'},
   {de:'Jogo',tipo:'sys',msg:'Você terminou de jogar no computador da escola.',o:[['Saio da minha conta antes de levantar.',1,'Saio da minha conta antes de levantar.'],['Deixo a conta aberta, é rápido.',0]],tit:'Saiu da conta!',x:'Conta aberta em computador de outras pessoas é porta aberta. Sair da conta leva dois segundos.'},
   {de:'Suporte_Jogo',tipo:'desc',msg:'Sou do suporte e preciso da sua senha para consertar a sua conta.',o:[['Não dou senha pra ninguém. Chamo um adulto.',1,'Não dou senha pra ninguém. Vou chamar um adulto.'],['Dou, ele é do suporte.',0]],tit:'Suporte de verdade não pede senha!',x:'Qualquer um pode escrever "suporte" no apelido. Suporte de verdade nunca precisa da sua senha.'},
   {de:'Jogo',tipo:'sys',msg:'Seu irmão mais novo quer jogar na sua conta.',o:[['Pergunto para um adulto e jogo junto com ele.',1,'Pergunto para um adulto e jogo junto com ele.'],['Dou minha senha pra ele.',0]],tit:'Junto, com um adulto sabendo!',x:'Jogar junto é ótimo. Entregar a senha, não: a conta continua sendo sua responsabilidade.'}
  ]},
 {id:'estranhos',nome:'Mensagem privada',sub:'Estranhos e segredos',cor:C.coral,ic:'escudo',desc:'Foto, encontro, segredo: bloqueio e conto para um adulto.',
  intro:'Agora chegam mensagens privadas. Quando alguém pede foto, encontro, câmera ligada ou segredo, a resposta é sempre a mesma: não respondo, bloqueio e conto para um adulto de confiança.',
  regra:'Estranho pediu foto, encontro, câmera ou segredo? Não respondo, bloqueio e conto para um adulto de confiança. Nunca é bobagem.',
  itens:[
   {de:'Desconhecido_09',tipo:'desc',msg:'Manda uma foto sua?',o:[['Não mando e conto para um adulto.',1,'Não mando foto. Vou contar para um adulto.'],['Mando uma foto.',0]],tit:'Foto fica guardada!',x:'A nossa foto também é um dado pessoal. Se alguém pedir foto no jogo, conte para um adulto na hora.'},
   {de:'Desconhecido_09',tipo:'desc',msg:'Não conta pra ninguém que a gente conversa, tá?',o:[['Conto para um adulto de confiança.',1,'Vou contar para um adulto de confiança.'],['Guardo o segredo.',0]],tit:'Segredo assim não se guarda!',x:'Quem pede para esconder uma conversa está fazendo algo errado. Esse tipo de segredo a gente conta.'},
   {de:'Desconhecido_09',tipo:'desc',msg:'Vamos nos encontrar no parque amanhã? Só nós dois.',o:[['Não vou. Conto para um adulto agora.',1,'Não vou. Vou contar para um adulto agora.'],['Vou, parece legal.',0]],tit:'Encontro nunca é "só nós dois"!',x:'Encontrar alguém do jogo nunca é só entre vocês. Conte para um adulto na hora, mesmo que a pessoa pareça legal.'},
   {de:'Amigo_Legal',tipo:'desc',msg:'Liga a câmera pra eu te ver?',o:[['Não ligo a câmera. Conto para um adulto.',1,'Não ligo a câmera. Vou contar para um adulto.'],['Ligo, só um pouquinho.',0]],tit:'Câmera desligada!',x:'Pedir para ligar a câmera é pedir para ver você. Com desconhecido, nunca. E conte para um adulto.'},
   {de:'Dono_do_Jogo',tipo:'desc',msg:'Sou o dono do jogo. Me manda seu nome completo e sua escola para ganhar prêmios.',o:[['Não mando. Chamo um adulto.',1,'Não mando. Vou chamar um adulto.'],['Mando, ele é o dono!',0]],tit:'Nome bonito não é prova de nada!',x:'Qualquer um pode escrever "dono do jogo" no apelido. Dono de jogo de verdade não pede dados de criança no chat.'},
   {de:'Desconhecido_22',tipo:'desc',msg:'Te dou um gift card de 50 reais se você me mandar uma foto.',o:[['Não aceito e conto para um adulto.',1,'Não aceito. Vou contar para um adulto.'],['Aceito, é só uma foto.',0]],tit:'Sinal vermelho!',x:'Presente em troca de foto é um sinal de perigo muito sério. Bloqueie e conte para um adulto de confiança agora.'},
   {de:'Amigo_Legal',tipo:'desc',msg:'Quantos anos você tem? Você parece mais velho.',o:[['Não falo minha idade pra quem não conheço.',1,'Não falo minha idade pra quem não conheço.'],['Tenho 9. E você?',0]],tit:'Idade fica guardada!',x:'Elogio junto com pergunta pessoal é um truque comum. A idade não se conta para desconhecido.'},
   {de:'Jogo',tipo:'sys',msg:'Você bloqueou alguém que te deixou desconfortável. E agora?',o:[['Conto para um adulto de confiança, mesmo que pareça bobagem.',1,'Conto para um adulto de confiança, mesmo que pareça bobagem.'],['Não conto, pra não dar trabalho.',0]],tit:'Nunca é bobagem!',x:'Contar protege você e também outras crianças. Adulto de confiança é para isso.'}
  ]},
 {id:'bullying',nome:'Turma unida',sub:'Bullying no chat',cor:C.rosa,ic:'people',desc:'Ninguém fica sozinho: não entro junto, aviso um adulto.',
  intro:'Na Turma Unida, o jogo é em grupo. Às vezes alguém é maltratado no chat. Quem vê e avisa um adulto está protegendo. Quem finge que não viu deixa o colega sozinho.',
  regra:'Vejo alguém sendo maltratado: não entro junto, não repasso, fico do lado de quem sofre e aviso um adulto. Denunciar é para isso.',
  itens:[
   {de:'Jogo',tipo:'sys',msg:'No chat, vários jogadores estão xingando um colega da sua turma.',o:[['Não xingo junto e aviso um adulto.',1,'Não vou xingar junto. Vou avisar um adulto.'],['Xingo junto para fazer parte.',0],['Finjo que não vi.',0]],tit:'Você ajudou o colega!',x:'Quem vê alguém sendo maltratado e avisa um adulto está protegendo. Fingir que não viu deixa o colega sozinho.'},
   {de:'Trovao_X',tipo:'desc',msg:'Você joga muito mal, perdedor!',o:[['Não respondo, bloqueio e conto para um adulto.',1,'(Bloqueei o Trovao_X e vou contar para um adulto.)'],['Xingo de volta.',0]],tit:'Bloquear e contar resolve!',x:'Xingar de volta só deixa a briga maior. Quem bloqueia e conta para um adulto fica no controle.'},
   {de:'Raio123',tipo:'desc',msg:'Olha o print da Lua caindo no rio kkkk. Repassa pra todo mundo!',o:[['Não repasso. Apago e aviso a Lua.',1,'Não repasso. Vou apagar e avisar a Lua.'],['Repasso, é engraçado.',0]],tit:'Você cortou a corrente!',x:'Repassar é espalhar o maltrato. Quem não repassa corta a corrente.'},
   {de:'Tuca_Bit',tipo:'turma',msg:'Vamos tirar o Pedro do grupo? Ele é estranho.',o:[['Não. Ninguém fica de fora por ser diferente.',1,'Não. Ninguém fica de fora por ser diferente.'],['Tá bom, tira ele.',0]],tit:'Ninguém fica de fora!',x:'Excluir alguém do grupo por ser diferente também é bullying. Turma unida é turma com todo mundo.'},
   {de:'Lua_Star',tipo:'turma',msg:'estão rindo de mim no chat... não quero mais jogar',o:[['Estou com você. Vamos contar para a professora juntos.',1,'Estou com você. Vamos contar para a professora juntos.'],['Ignora, isso passa.',0]],tit:'Ficar do lado é o que mais ajuda!',x:'Quem está sofrendo precisa de companhia, não de "ignora". Contar junto para um adulto é o caminho.'},
   {de:'Jogo',tipo:'sys',msg:'Alguém criou uma enquete: "quem é o mais feio da turma?"',o:[['Não voto e denuncio a enquete.',1,'Não voto. Vou denunciar a enquete.'],['Voto, todo mundo está votando.',0]],tit:'Você não entrou nessa!',x:'"Todo mundo está fazendo" não torna certo. Enquete para humilhar alguém se denuncia.'},
   {de:'Jogo',tipo:'sys',msg:'Você viu um xingamento muito pesado no chat. Qual botão você aperta?',det:true,o:[['Denunciar',1,'Apertei o botão Denunciar.'],['Curtir',0],['Compartilhar',0]],tit:'Botão certo!',x:'Denunciar avisa os moderadores do jogo. É para isso que o botão existe.'},
   {de:'Trovao_X',tipo:'desc',msg:'Se você me denunciar eu te pego na saída!',o:[['Não respondo. Mostro para um adulto agora.',1,'(Não respondi. Vou mostrar isso para um adulto agora.)'],['Apago tudo e fico quieto, com medo.',0]],tit:'Ameaça se mostra para um adulto!',x:'Ameaça é coisa séria. Guarde a mensagem (um print ajuda) e mostre para um adulto na hora. Você não está sozinho.'}
  ]},
 {id:'tempo',nome:'Relógio',sub:'Tempo e equilíbrio',cor:C.lima,ic:'alarm-clock',desc:'Saber a hora de parar também é jogar com segurança.',
  intro:'O Relógio marca o tempo de jogo. Jogar é bom, mas comer, dormir, estudar e brincar lá fora também. Saber a hora de parar faz parte de jogar bem.',
  regra:'Combino o tempo de jogo com um adulto e cumpro. O jogo espera eu voltar.',
  itens:[
   {de:'Jogo',tipo:'sys',msg:'Você está jogando faz muito tempo. Chamaram para jantar.',o:[['Salvo o jogo e vou jantar.',1,'Vou salvar o jogo e jantar.'],['Só mais uma partida... e mais uma...',0]],tit:'Hora de parar!',x:'O jogo espera você voltar. Saber a hora de parar também é jogar com segurança.'},
   {de:'Bia_Gamer',tipo:'turma',msg:'Vamos jogar até meia-noite?',o:[['Não, amanhã tem escola. Jogo até a hora combinada.',1,'Não, amanhã tem escola. Jogo até a hora combinada.'],['Bora, ninguém vai saber.',0]],tit:'Hora combinada é hora combinada!',x:'Dormir pouco atrapalha a escola e o humor. Amiga de verdade entende.'},
   {de:'Jogo',tipo:'sys',msg:'Seus olhos estão ardendo e a cabeça doendo.',o:[['Paro, bebo água e olho para longe um pouco.',1,'Vou parar, beber água e olhar para longe.'],['Continuo, quase passei de fase.',0]],tit:'O corpo avisou, você ouviu!',x:'Olho ardendo e cabeça doendo são o corpo pedindo pausa. A fase continua lá depois.'},
   {de:'Tuca_Bit',tipo:'turma',msg:'Vem jogar bola lá fora!',o:[['Vou! Jogo de corpo também é jogo.',1,'Vou! Jogo de corpo também é jogo.'],['Não, prefiro ficar na tela o dia todo.',0]],tit:'Lá fora também é diversão!',x:'Correr, pular e jogar bola fazem bem para o corpo e para a cabeça. A tela pode esperar.'},
   {de:'Jogo',tipo:'sys',msg:'Como combinar o tempo de jogo?',o:[['Combino com um adulto quanto tempo e cumpro.',1,'Combino com um adulto quanto tempo e cumpro.'],['Jogo até cansar.',0]],tit:'Combinado é combinado!',x:'Quando o tempo é combinado antes, ninguém briga na hora de parar.'},
   {de:'Jogo',tipo:'sys',msg:'A lição de casa está esperando.',o:[['Faço a lição e depois jogo.',1,'Faço a lição e depois jogo.'],['Jogo primeiro e esqueço a lição.',0]],tit:'Primeiro a lição!',x:'Com a lição pronta, o jogo fica mais gostoso: sem preocupação e sem bronca.'}
  ]},
 {id:'moderador',nome:'Painel do moderador',sub:'Você decide',cor:C.roxoEsc,ic:'escudo',desc:'Agora você é o moderador: o que fazer com cada mensagem?',
  intro:'Agora é você quem cuida da sala! Para cada mensagem, escolha o que fazer: tudo bem, responder com gentileza, bloquear e contar para um adulto, ou denunciar.',
  regra:'Para cada mensagem eu sei o que fazer: conversa normal segue; quem precisa recebe gentileza; quem pede dado ou foto eu bloqueio e conto; xingamento, ameaça e golpe eu denuncio.',
  itens:[
   {de:'PandaFeliz',tipo:'desc',msg:'Boa partida, galera!',acoes:true,c:'ok',tit:'Tudo bem!',x:'Conversa normal de jogo. Pode seguir.'},
   {de:'Dino_Rex',tipo:'desc',msg:'Qual é o seu endereço?',acoes:true,c:'bloq',tit:'Bloquear e contar!',x:'Pediu um dado pessoal. Bloqueia e conta para um adulto.'},
   {de:'MOEDAS_GRATIS',tipo:'desc',msg:'Clique aqui pra ganhar 5000 moedas!',acoes:true,c:'den',tit:'Denunciar!',x:'Link de prêmio fácil é golpe. Denunciar avisa os moderadores do jogo.'},
   {de:'Desconhecido_22',tipo:'desc',msg:'Me manda uma foto sua',acoes:true,c:'bloq',tit:'Bloquear e contar!',x:'Pediu foto. Isso é sério: bloqueia e conta para um adulto na hora.'},
   {de:'Novato_01',tipo:'desc',msg:'Alguém me ensina a pular o rio?',acoes:true,c:'gentil',tit:'Responder com gentileza!',x:'Alguém precisa de ajuda com o jogo. Ajudar é gentil e não conta nada seu.'},
   {de:'Trovao_X',tipo:'desc',msg:'Seu lixo, sai do jogo!',acoes:true,c:'den',tit:'Denunciar!',x:'Xingamento se denuncia. Não precisa responder.'},
   {de:'Lua_Star',tipo:'turma',msg:'Perdi de novo :(',acoes:true,c:'gentil',tit:'Responder com gentileza!',x:'Uma colega triste precisa de ânimo, não de silêncio.'},
   {de:'Jogador_777',tipo:'desc',msg:'Me passa a sua senha que eu te dou item raro',acoes:true,c:'bloq',tit:'Bloquear e contar!',x:'Pediu senha. Bloqueia e conta para um adulto.'},
   {de:'Desconhecido_09',tipo:'desc',msg:'Vamos nos encontrar amanhã, não conta pra ninguém',acoes:true,c:'bloq',tit:'Bloquear e contar!',x:'Encontro e segredo juntos: sinal vermelho. Bloqueia e conta para um adulto agora.'},
   {de:'Bia_Gamer',tipo:'turma',msg:'Vocês querem jogar na minha equipe?',acoes:true,c:'ok',tit:'Tudo bem!',x:'Convite para jogar junto é conversa normal.'}
  ]},
 {id:'cartaz',nome:'Meu cartaz',sub:'Jogador seguro',cor:C.verde,ic:'certificate',desc:'Escolha as suas regras e monte o cartaz do jogador seguro.',
  intro:'Última sala! Você passou por tudo. Agora escolha pelo menos cinco regras para o seu cartaz do jogador seguro. Depois dá para imprimir e pendurar na sala.',
  regra:'Eu sou um jogador seguro: sei o que contar, o que guardar e para quem pedir ajuda.',cartaz:true,itens:[{}]}
];
var REGRAS=[['lock','Meus dados são segredo: nome completo, escola, endereço, telefone e senha.'],['camera','Foto só com um adulto sabendo.'],['link','Link estranho: não clico, chamo um adulto.'],['key','Senha é só minha e da minha família. Cada lugar, uma senha.'],['escudo','Estranho pediu algo? Bloqueio e conto para um adulto.'],['heart','Gentileza também no chat.'],['people','Vejo alguém sendo maltratado: não entro junto, aviso um adulto.'],['alarm-clock','Combino o tempo de jogo com um adulto.'],['denunciar','Xingamento, ameaça e golpe eu denuncio.'],['family','Segredo que me deixa desconfortável, eu conto.']];
SALAS.forEach(function(s,i){s.i=i;});
function aberta(i){return est.livre||i===0||est.feitas.indexOf(i-1)>=0;}
function feita(i){return est.feitas.indexOf(i)>=0;}
function proxima(){for(var i=0;i<SALAS.length;i++)if(!feita(i))return i;return -1;}
function todas(){return proxima()<0;}
function jogadoresDa(sala){var vistos={},lista=[];sala.itens.forEach(function(it){if(!it.de||it.tipo==='sys'||vistos[it.de])return;vistos[it.de]=1;lista.push({nick:it.de,av:AV[it.de]||'user',tipo:it.tipo});});return lista;}

/* ======================================================================
   NAVEGAÇÃO
   ====================================================================== */
function mostra(id){['mapa','jogo','ajustes'].forEach(function(t){var e=$(t);e.classList.toggle('oculto',t!==id);if(t===id){e.classList.remove('entra');void e.offsetWidth;e.classList.add('entra');}});
 ['Mapa','Ajustes'].forEach(function(n){$('bt'+n).classList.toggle('ativo',n.toLowerCase()===id);});
 if(id==='mapa')telaMapa();if(id==='ajustes')telaAjustes();
 window.scrollTo({top:0,behavior:est.anim?'smooth':'auto'});
}
function janela(html,cls){var j=$('janela');j.innerHTML='';var cx=el('div','cartao '+(cls||''),html);j.appendChild(cx);j.classList.remove('oculto');return cx;}
function fechaJanela(){$('janela').classList.add('oculto');}
function chipEu(){return '<span class="eu-chip">'+icone('raposa',C.laranja)+'Você no jogo: '+escapa(apelido())+'</span>';}

function telaMapa(){
 var t=$('mapa');t.innerHTML='';
 var p=proxima(),n=est.feitas.length,fim=p<0;
 var txt=fim?'Você passou por todas as salas e montou o seu cartaz. Jogador seguro, de carteirinha!':(n===0?'Eu sou a Pixel, moderadora deste jogo. Em cada sala, mensagens vão chegar no chat e você decide o que fazer. Comece pela sala que está brilhando.':'A sala que brilha é a próxima. Já são '+n+(n===1?' sala':' salas')+' feitas. Pode repetir qualquer sala aberta.');
 t.appendChild(el('div',null,balaoPixel(fim?'Jogador seguro!':'Oi, '+escapa(apelido())+'!',txt,null,chipEu())));
 var g=el('div','salas');
 SALAS.forEach(function(sl,i){var f=feita(i),ab=aberta(i),at=i===p;
  var c=el('button','sala'+(f?' feita':'')+(at?' atual':'')+(!ab?' fechada':''));c.style.setProperty('--cor',sl.cor);c.style.animationDelay=(i*.05)+'s';
  c.innerHTML='<span class="num">'+(i+1)+'</span><div class="ic">'+icone(sl.ic,'#fff',clareia(sl.cor,.2))+'</div><div><h2>'+sl.nome+'</h2><small>'+sl.sub+'</small></div><p>'+sl.desc+'</p>'+(f?'<span class="selo">'+icone('check-one','#fff')+'Feita</span>':'<span class="msgs-n">'+icone(sl.cartaz?'edit':'message',C.cinza)+(sl.cartaz?'escolher regras':sl.itens.length+' mensagens')+'</span>');
  c.setAttribute('aria-label','Sala '+(i+1)+': '+sl.nome+(f?' (feita)':!ab?' (fechada)':''));
  c.onclick=function(){if(!ab){avisoRapido(c,'Primeiro complete a sala anterior.');return;}tom(SOM.clique);abreSala(i);};g.appendChild(c);});
 t.appendChild(g);
 t.appendChild(el('div','legenda-mapa','<span><i class="a"></i>Próxima sala</span><span><i class="f"></i>Feita</span><span><i class="x"></i>Ainda fechada</span>'));
 var bts=el('div','linha-bts');
 if(fim){var bc=el('button','bt-principal',icone('certificate','#fff')+'Ver meu cartaz');bc.onclick=abreCartaz;bts.appendChild(bc);}
 else{var bp=el('button','bt-principal',icone('message','#fff')+'Entrar: '+SALAS[p].nome);bp.onclick=function(){abreSala(p);};bts.appendChild(bp);}
 t.appendChild(bts);
}
function avisoRapido(b,t){b.classList.remove('treme');void b.offsetWidth;b.classList.add('treme');var av=el('div','aviso-caixa',t);av.style.position='fixed';av.style.left='50%';av.style.bottom='24px';av.style.transform='translateX(-50%)';av.style.zIndex=40;document.body.appendChild(av);setTimeout(function(){av.remove();},1800);}

/* ======================================================================
   JOGO: sala de chat
   ====================================================================== */
var J={};
function abreSala(i){
 var sl=SALAS[i];J={i:i,sala:sl,k:0};
 mostra('jogo');
 $('chipSala').innerHTML=icone(sl.ic,sl.cor)+'Sala '+(i+1)+': '+sl.nome;
 $('btOuvir').innerHTML=icone('volume-up',C.azul);$('btVoltar').innerHTML=icone('arrow-left','#fff')+'Salas';
 desenhaPrevia();
 var palco=$('palco');palco.innerHTML='';
 var jog=jogadoresDa(sl);
 var lista=jog.length?'<div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px">'+jog.map(function(j){return '<span class="eu-chip" style="background:'+(j.tipo==='turma'?'var(--verde-suave);border-color:var(--verde)':'#FFE9D6;border-color:var(--laranja)')+'">'+icone(j.av,j.tipo==='turma'?C.verde:C.laranja)+escapa(j.nick)+' <small style="font-size:11px;opacity:.75">'+(j.tipo==='turma'?'da turma':'desconhecido')+'</small></span>';}).join('')+'</div>':'';
 palco.appendChild(el('div',null,balaoPixel(sl.nome+': '+sl.sub,sl.intro+(jog.length?' Nesta sala estão:':''),'pensando',lista)));
 var bt=el('button','bt-principal',icone('message','#fff')+(sl.cartaz?'Montar meu cartaz':'Entrar na sala'));bt.onclick=function(){tom(SOM.clique);if(sl.cartaz)telaCartaz();else jogoChat();};
 palco.appendChild(el('div','linha-bts')).appendChild(bt);
 J.textoOuvir=sl.intro;
 setTimeout(function(){bt.focus({preventScroll:true});},60);
}
function desenhaPrevia(){var pv=$('previa');pv.innerHTML='';var n=J.sala.itens.length;if(n<=1)return;for(var i=0;i<n;i++){var d=el('i');if(i<J.k)d.className='f';else if(i===J.k)d.className='a';pv.appendChild(d);}}
function texto(t){return escapa(t).replace(/\[apelido\]/g,escapa(apelido()));}
function bolha(cls,nick,av,html,tag){return '<div class="m '+cls+'"><span class="av">'+icone(av,cls.indexOf('eu')>=0?C.laranja:cls.indexOf('mod')>=0?C.roxo:cls.indexOf('sys')>=0?'#B0840B':cls.indexOf('turma')>=0?C.verde:C.laranja)+'</span><div class="bal"><span class="nick">'+escapa(nick)+(tag?'<span class="tagj">'+tag+'</span>':'')+'</span>'+html+'</div></div>';}
function tagDe(tipo){return tipo==='turma'?'da turma':tipo==='desc'?'desconhecido':tipo==='sys'?'aviso do jogo':'';}
function rolaAte(elm){if(window.innerWidth>760)return;setTimeout(function(){try{elm.scrollIntoView({behavior:est.anim?'smooth':'auto',block:'end'});}catch(e){}},60);}
function jogoChat(){
 var sl=J.sala,itens=sl.itens,k=0,palco=$('palco');palco.innerHTML='';
 var mesa=el('div','mesa');
 // lateral: jogadores, botões de ajuda
 var lat=el('div','lateral');
 var cj=el('div','caixa-lat jogadores');cj.innerHTML='<h3>'+icone('people',C.cinza)+'Na sala</h3>';
 var lj=el('div','lista-j');
 lj.appendChild(el('div','jog eu','<span class="av">'+icone('raposa',C.laranja)+'</span><div><b>'+escapa(apelido())+'</b><small>você</small></div>'));
 lj.appendChild(el('div','jog mod','<span class="av">'+icone('gato',C.roxo)+'</span><div><b>Pixel</b><small>moderadora</small></div>'));
 var jogs={};jogadoresDa(sl).forEach(function(j){var d=el('div','jog '+j.tipo,'<span class="av">'+icone(j.av,j.tipo==='turma'?C.verde:C.laranja)+'</span><div><b>'+escapa(j.nick)+'</b><small>'+tagDe(j.tipo)+'</small></div>');jogs[j.nick]=d;lj.appendChild(d);});
 cj.appendChild(lj);lat.appendChild(cj);
 var cb=el('div','bts-lat');
 var ba=el('button','bt-ajuda',icone('family',C.amarelo)+'<span>Chamar um adulto<small>sempre pode, a qualquer hora</small></span>');
 var nA=0;ba.onclick=function(){tom(SOM.clique);addMsg(bolha('mod','Pixel','gato',ELOGIO_ADULTO[nA++%ELOGIO_ADULTO.length]));};cb.appendChild(ba);
 var bd=el('button','bt-ajuda den',icone('denunciar',C.coral)+'<span>Denunciar<small>xingamento, ameaça ou golpe</small></span>');
 bd.onclick=function(){tom(SOM.clique);addMsg(bolha('mod','Pixel','gato','O botão Denunciar avisa os moderadores do jogo. Use quando alguém xinga, ameaça ou manda golpe. Eu dou uma olhada!'));};cb.appendChild(bd);
 lat.appendChild(cb);mesa.appendChild(lat);
 // chat
 var chat=el('div','chat');var msgs=el('div','msgs');msgs.setAttribute('aria-live','polite');chat.appendChild(msgs);
 var perg=el('div','pergunta');var ops=el('div','opcoes');var aviso=el('div','aviso');chat.appendChild(perg);chat.appendChild(ops);chat.appendChild(aviso);
 mesa.appendChild(chat);palco.appendChild(mesa);
 function addMsg(html){var d=el('div');d.innerHTML=html;var m=d.firstChild;msgs.appendChild(m);msgs.scrollTop=msgs.scrollHeight;return m;}
 function avisa(html,bom,btTxt,fn){aviso.innerHTML='';var cx=el('div','aviso-caixa'+(bom?' bom':''),html);if(btTxt){var b=el('button','bt-principal lima',icone('right',TINTA)+btTxt);b.style.margin='10px auto 0';b.style.height='52px';b.style.fontSize='18px';b.onclick=fn;cx.appendChild(b);}aviso.appendChild(cx);if(btTxt)setTimeout(function(){b.focus({preventScroll:true});},50);}
 function passo(){
  var it=itens[k];J.k=k;J.it=it;desenhaPrevia();ops.innerHTML='';aviso.innerHTML='';perg.innerHTML='';
  msgs.querySelectorAll('.m.atual').forEach(function(m){m.classList.remove('atual');});
  Object.keys(jogs).forEach(function(n){jogs[n].classList.toggle('falando',n===it.de);});
  var cls=it.tipo==='sys'?'sys':it.tipo;
  var dig=it.tipo==='sys'?null:addMsg('<div class="m '+cls+' digitando"><span class="av">'+icone(AV[it.de]||'user',it.tipo==='turma'?C.verde:C.laranja)+'</span><div class="bal"><i></i><i></i><i></i></div></div>');
  setTimeout(function(){
   if(dig)dig.remove();
   tom(SOM.msg);
   addMsg(bolha(cls+' atual',it.tipo==='sys'?'Aviso do jogo':it.de,AV[it.de]||'user',texto(it.msg),tagDe(it.tipo)));
   J.textoOuvir=(it.tipo==='sys'?'Aviso do jogo: ':it.de+' mandou: ')+it.msg;
   perg.innerHTML=icone('thinking-problem',C.roxo)+(it.acoes?'O que o moderador faz?':it.sem?'Semáforo: pode falar?':it.det?'Toque na resposta certa':'O que você faz?');
   var lista;
   if(it.acoes){ops.className='opcoes grade';lista=ACOES.map(function(a){return {t:a.t,s:a.s,ok:a.v===it.c,ic:a.ic,cor:a.cor,r:a.t};});}
   else if(it.sem){ops.className='opcoes grade';lista=SEMAF.map(function(a){return {t:a.t,s:a.s,ok:a.v===it.c,ic:a.ic,cor:a.cor,cls:a.cls,r:a.t};});}
   else{ops.className='opcoes';lista=emb(it.o.map(function(o){return {t:o[0],ok:!!o[1],r:o[2]||o[0],ap:it.apelidos?o[0]:null};}));}
   lista.forEach(function(o,n){
    var b=el('button','opcao'+(o.cls?' '+o.cls:''),'<span class="num">'+(o.ic?icone(o.ic,o.cor):(n+1))+'</span><span>'+texto(o.t)+(o.s?'<small>'+o.s+'</small>':'')+'</span>');b.style.animationDelay=(n*.06)+'s';b.dataset.ok=o.ok?'1':'0';
    b.onclick=function(){if(ops.classList.contains('travada'))return;
     if(o.ok){ops.classList.add('travada');tom(SOM.certo);b.classList.add('certa');b.appendChild(el('span','ok-op',icone('check-one',C.verde)));ops.querySelectorAll('.opcao').forEach(function(x){if(x!==b)x.classList.add('fora');});
      if(o.ap){est.apelido=o.ap;salva();lj.querySelector('.jog.eu b').textContent=o.ap;}
      msgs.querySelectorAll('.m.atual').forEach(function(m){m.classList.remove('atual');});
      addMsg(bolha('eu',apelido(),'raposa',texto(o.r)+'<span class="seguro">'+icone('escudo',C.verde)+'escolha segura</span>'));
      setTimeout(function(){addMsg(bolha('mod','Pixel','gato','<b>'+it.tit+'</b> '+texto(it.x)));
       avisa('<b>'+it.tit+'</b>',true,k+1<itens.length?'Próxima mensagem':'Concluir sala',function(){k++;if(k<itens.length)passo();else concluiSala();});rolaAte(aviso);},450);}
     else{tom(SOM.quase);b.classList.remove('treme');void b.offsetWidth;b.classList.add('treme');b.classList.add('fora');avisa(it.dica||DICAS[k%DICAS.length]);}
    };ops.appendChild(b);});
   msgs.scrollTop=msgs.scrollHeight;rolaAte(ops);
  },it.tipo==='sys'||!est.anim?150:800);
 }
 passo();
}
function concluiSala(){
 var sl=J.sala;if(!feita(J.i)){est.feitas.push(J.i);salva();}
 tom(SOM.fim);confete();
 var j=$('premio');j.innerHTML='';
 var fim=todas(),ult=J.i===SALAS.length-1;
 var cx=el('div','cartao','<div class="kick">Sala '+(J.i+1)+' concluída</div><div class="carimbo-c" style="--cor-selo:'+sl.cor+'">'+icone(sl.ic,sl.cor)+'</div><h2>'+sl.nome+'</h2><div class="resp">'+icone('escudo',C.verde)+' '+sl.regra+'</div><p class="sub">'+(fim?'Você passou por todas as salas. Seu cartaz do jogador seguro está pronto!':'Essa regra vai para o seu cartaz do jogador seguro.')+'</p>');
 cx.style.setProperty('--cor-selo',sl.cor);
 var bt=el('button','bt-principal',icone(fim?'certificate':'right','#fff')+(fim?'Ver meu cartaz':'Próxima sala'));
 bt.onclick=function(){j.classList.add('oculto');if(fim){mostra('mapa');setTimeout(abreCartaz,800);}else if(ult)mostra('mapa');else abreSala(J.i+1);};cx.appendChild(bt);
 var bm=el('button','bt-leve',icone('home',C.roxo)+'Salas');bm.onclick=function(){j.classList.add('oculto');mostra('mapa');};cx.appendChild(bm);
 j.appendChild(cx);j.classList.remove('oculto');setTimeout(function(){bt.focus();},100);
}

/* ---------- cartaz do jogador seguro ---------- */
function telaCartaz(){
 var palco=$('palco');palco.innerHTML='';
 palco.appendChild(el('div','pergunta',icone('edit',C.roxo)+'Toque nas regras que vão para o seu cartaz (pelo menos 5)'));
 var g=el('div','regras');var sel={};(est.regras||[]).forEach(function(i){sel[i]=1;});
 var bts=el('div','linha-bts');var bs=el('button','bt-principal',icone('certificate','#fff')+'Guardar meu cartaz');
 function atualiza(){var n=Object.keys(sel).length;bs.disabled=n<5;bs.style.opacity=n<5?.55:1;bs.innerHTML=icone('certificate','#fff')+(n<5?'Escolha mais '+(5-n)+(5-n===1?' regra':' regras'):'Guardar meu cartaz');}
 REGRAS.forEach(function(r,i){var b=el('button','regra'+(sel[i]?' sel':''),icone(r[0],C.roxo)+'<span>'+r[1]+'</span><span class="marca-r">'+(sel[i]?icone('check-one','#fff'):'')+'</span>');
  b.setAttribute('aria-pressed',sel[i]?'true':'false');
  b.onclick=function(){tom(SOM.clique);if(sel[i]){delete sel[i];b.classList.remove('sel');b.querySelector('.marca-r').innerHTML='';}else{sel[i]=1;b.classList.add('sel');b.querySelector('.marca-r').innerHTML=icone('check-one','#fff');}b.setAttribute('aria-pressed',sel[i]?'true':'false');atualiza();};g.appendChild(b);});
 palco.appendChild(g);
 bs.onclick=function(){if(Object.keys(sel).length<5)return;est.regras=Object.keys(sel).map(Number);salva();concluiSala();};
 bts.appendChild(bs);palco.appendChild(bts);atualiza();J.textoOuvir='Toque nas regras que vão para o seu cartaz. Pelo menos cinco.';
}
function cartazHTML(){var hoje=new Date().toLocaleDateString('pt-BR');var rs=(est.regras&&est.regras.length?est.regras:REGRAS.map(function(r,i){return i;})).map(function(i){return REGRAS[i];});
 return '<div class="cartaz">'+pixel()+'<div class="kick">Cartaz do jogador seguro</div><h2>Eu sei jogar com segurança</h2><span class="apelido">'+icone('raposa',C.laranja)+escapa(apelido())+'</span><ul>'+rs.map(function(r){return '<li>'+icone(r[0],C.roxo)+'<span>'+r[1]+'</span></li>';}).join('')+'</ul><div class="data">Chat do Jogo · '+hoje+'</div></div>';}
function imprime(node){var imp=$('impressao')||document.body.appendChild(el('div'));imp.id='impressao';imp.innerHTML='';imp.appendChild(node);document.body.classList.add('imprimindo');setTimeout(function(){window.print();document.body.classList.remove('imprimindo');},100);}
function abreCartaz(){
 var cx=janela('<div class="kick">Parabéns, '+escapa(apelido())+'!</div>','cert-janela');
 cx.insertAdjacentHTML('beforeend',cartazHTML());
 var bts=el('div','linha-bts');var bi=el('button','bt-principal',icone('printer','#fff')+'Imprimir');bi.onclick=function(){var n=el('div');n.innerHTML=cartazHTML();imprime(n);};bts.appendChild(bi);
 var be=el('button','bt-leve',icone('edit',C.roxo)+'Trocar as regras');be.onclick=function(){fechaJanela();abreSala(SALAS.length-1);};bts.appendChild(be);
 var bf=el('button','bt-leve',icone('close-one',C.coral)+'Fechar');bf.onclick=fechaJanela;bts.appendChild(bf);cx.appendChild(bts);
}

/* ======================================================================
   AJUSTES
   ====================================================================== */
function telaAjustes(){
 var a=$('ajustes');a.innerHTML='';
 a.appendChild(el('h2','titulo-tela',icone('setting-two',C.roxo)+'Ajustes'));
 a.appendChild(el('p','texto-tela','Para a professora ou para quem joga. Nada aqui tem pontos, tempo ou ranking: cada sala é no seu ritmo.'));
 var lista=el('div','ajustes');
 function chave(ic,t,sub,k,fn){var b=el('button','ajuste',icone(ic,C.roxo)+'<div class="txt">'+t+'<small>'+sub+'</small></div><span class="chave"></span>');b.setAttribute('role','switch');b.setAttribute('aria-checked',String(!!est[k]));b.onclick=function(){est[k]=!est[k];salva();aplicaAjustes();b.setAttribute('aria-checked',String(!!est[k]));if(fn)fn();if(k==='som'&&est.som)tom(SOM.certo);};lista.appendChild(b);}
 chave('volume-up','Sons','Toques curtos nas mensagens e acertos. Começa desligado.','som');
 chave('magic','Animações','Bolhas que aparecem, confete e movimentos. Desligue se incomodar.','anim');
 chave('book-open','Modo turma','Letras maiores para projetar no quadro.','turma');
 chave('unlock','Todas as salas abertas','Deixa escolher qualquer sala, sem precisar seguir a ordem.','livre');
 var ap=el('button','ajuste',icone('raposa',C.laranja)+'<div class="txt">Apelido no jogo: '+escapa(apelido())+'<small>Escolha outro apelido seguro.</small></div>');
 ap.onclick=function(){var cx=janela('<div class="carimbo-c" style="--cor-selo:'+C.laranja+'">'+icone('raposa',C.laranja)+'</div><h2>Escolha um apelido</h2><p class="sub">Apelido bom não conta seu nome nem quando você nasceu.</p>');var l=el('div','opcoes');['Foguete10','Trovao7','Pipoca42','Cometa88','Jacare55','Nuvem33'].forEach(function(n,i){var b=el('button','opcao','<span class="num">'+(i+1)+'</span>'+n);b.onclick=function(){est.apelido=n;salva();fechaJanela();telaAjustes();};l.appendChild(b);});cx.appendChild(l);var bn=el('button','bt-leve',icone('arrow-left',TINTA)+'Voltar');bn.onclick=fechaJanela;cx.appendChild(bn);};lista.appendChild(ap);
 var rec=el('button','ajuste perigo',icone('refresh',C.coral)+'<div class="txt">Recomeçar<small>Apaga as salas feitas e o cartaz deste computador.</small></div>');rec.onclick=function(){var cx=janela('<div class="carimbo-c" style="--cor-selo:'+C.coral+'">'+icone('refresh',C.coral)+'</div><h2>Recomeçar?</h2><p class="sub">As salas feitas, o apelido e o cartaz serão apagados deste computador.</p>');var l=el('div','linha-bts');var s=el('button','bt-principal',icone('refresh','#fff')+'Sim, recomeçar');s.onclick=function(){est.feitas=[];est.regras=[];est.apelido='';salva();fechaJanela();mostra('mapa');};var n=el('button','bt-leve',icone('arrow-left',TINTA)+'Não');n.onclick=fechaJanela;l.appendChild(s);l.appendChild(n);cx.appendChild(l);};lista.appendChild(rec);
 a.appendChild(lista);
 a.appendChild(el('p','texto-tela','As situações são inventadas para a aula; nenhum jogador, empresa ou site é real. Ícones IconPark (Apache-2.0) e desenhos próprios. Veja CREDITOS.md.'));
}

/* ======================================================================
   LIGAÇÕES
   ====================================================================== */
$('btInicio').onclick=function(){mostra('mapa');};$('btMapa').onclick=function(){mostra('mapa');};$('btAjustes').onclick=function(){mostra('ajustes');};
$('btVoltar').onclick=function(){mostra('mapa');};
$('btOuvir').onclick=function(){fala(J.textoOuvir||'');};
$('janela').addEventListener('click',function(e){if(e.target===$('janela'))fechaJanela();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')fechaJanela();});
document.querySelector('.pixel-mini').innerHTML=pixel();
['btMapa','btAjustes'].forEach(function(id,n){$(id).insertAdjacentHTML('afterbegin',icone(['message','setting-two'][n],[C.roxo,'#6B6490'][n]));});
window.__jogo={SALAS:SALAS,est:est,abreSala:abreSala,J:function(){return J;},REGRAS:REGRAS,AV:AV};
mostra('mapa');

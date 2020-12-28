let connected = false;

var bot;

const mineflayer = require("mineflayer");
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
const Vec3 = require("vec3");

const Discord = require("discord.js");
const client = new Discord.Client();
let messenger;
let denmongConsole;
client.once('ready', () => {
    messenger = client.channels.cache.get("789720071433093180");
    denmongConsole = client.channels.cache.get("792327953907580960");
    messenger.send("나 왔다");
});
const JsonBinIoApi = require("jsonbin-io-api");
const api = new JsonBinIoApi(process.env.jsonToken);

const math = require("mathjs");

let place = {};
let owners = {};
let dialog = {};
api.readBin({
    id: "5fb8d7c504be4f05c9286f33",
    version: "latest"
}).then((data) => {
    place = data.place;
    owners = data.owners;
    dialog = data.dialog;
    console.log(place, owners, dialog);
});

let execution = 0;
let playingMafia = false;
let copChoose = false;
let doctorChoose = false;
let mafiaChoose = false;
let cure = "";
let kill = "";
let mafia = 0;

let playingPiano = false;
let randomMusic = false;

// 팟 솔 솟 라 랏 시 도 돗 레 렛 미 파 팠 솦 솠 랖 랐 싶 돞 돘 렢 렜 밒 팦 팍
noteBook = {
    "징글벨": "도랖솦파도   도랖솦파레   레랐랖솦미   돞돞랐솦랖 파 도랖솦파도   도랖솦파레   레랐랖솦돞돞돞돞렢돞랐솦파   랖랖랖 랖랖랖 랖돞파솦랖   랐랐랐랐랐랖랖랖랖솦솦파솦 돞 랖랖랖 랖랖랖 랖돞파솦랖   랐랐랐랐랐랖랖랖돞돞랐솦파   ",
    "징글벨락": "돞   돞돞   싶  싶싶   랖  싶랖   미       랖  싶랖   미   솦   랖  싶랖   파       레  미파   솦  랖솦   레  미파   솦           랖   랖   랖   랖   미 미         돞  돞돞   싶  싶싶   랖  싶랖   미       " +
    "랖  싶랖   미   솦   랖  싶랖   파       레  미파   솦  랖솦   레  미파   솦           ",
    "엘사?": "미솦돞파 솦미솦미솦돞파 솦미솦미솦돞파 솦미솦미       똑 똑똑똑     도도도솔도미레 미  솦 도도도도솔도미레        도도도도솔도미파미도  라도미파미도도도솔도미솦   레  미 미솦솦솦솦파미파솦 도   라도레 미도   레미레도 레 미 랖  레  미  도도도도솔도미레 미    솦"
    + " 도도도도솔도미레 도                     도   시   도        ",
    "고요한밤": "솦  랖솦 미     솦  랖솦 미     렢   렢 싶     돞   돞 솦     랖   랖 돞  싶랖 솦  랖솦 미     랖   랖 돞  싶랖 솦  랖솦 미     렢   렢 팦  렢싶 돞     밒     돞  솦미 솦  파레 도           ",
    "CREDIT": "미솦미레도솔미레        미솦미레도라미레        미솦미레도라미레    도레미솦   솦솦솦랖 솦솦  미미 레미솦미레도라미레    도레미솦  솦솦솦 랖돞     밒 랖 돞  솦 솦 미미  레레  도도 솔라도         솔라미  도도  솦 미 솦 미 솦랖  솦미" +
    "         도 랖 솦       미   렢   돞                 솦 미 솦 미 솦랖  솦미         도 랖 솦       미   렢   돞         ",
    "눈": "도 랖 미 레 도 랖 미 레 도 랖 미 레 도 랖돞랖솦미레도 랖 미 레 도 랖 레 도 도 랖 미 레 도 랖돞랖솦미레도 도도도 미레  레레레 파미  레도레 미파  레도도 레도  도도도 미레  레레레 파미  레도레 미파  돞돞  렢돞  솦   돞싶  싶   싶돞  랖   렢돞  랖   "
    + "솦솦  돞   밒밒  렢   렢밒  돞   렢밒  돞     ",
    "빌었어": "솔 도 레 미  미미미미 솦  미미미도 레  레레레레 솦  레레레시 레 도   솔 도  레미  도도          솔도 레 미  미미미미 솦  미미미도 레  레레레레 솦  레레레시 레도    솔 도  레미  도도  레미 파     솦 미 솦 미     솦솦 미 솦 미   " +
    "레 레 미 레 도 도   도     솔 도 레 미 파     미   레   솦 미 솦 미     솦솦미 솦 솠     솠   솠솠솠 솠 랖   도 도 솔 도 레 미 파     미   레   도   솦   돞   밒       솠   돞   밒     렢 렢   돞                   돞돞싶 돞 싶     돞   돞돞싶 돞 싶  "
    + "랖 싶 랖 싶  랖 싶  돞  랖    랖랖랖 랖 솦    파   미   레   솦   돞   밒       솠   돞   밒     렢 렢   돞                   돞돞싶 돞 싶     돞   돞돞싶 돞 싶  랖 싶 랖 싶  랖 싶  돞  랖    랖랖랖 랖 솦    파   미   레   도               ",
    "메리크리스마스": "솔 도 도레도시라 라 라 레 레미레도시 솔 시 미 미파미레도 라 솔솔라 레 시 도   솔 도 도 도 시   시 도 시 라 솔   레 미 레레도도솦 솔 솔솔라 레 시 도     ",
    "아마두": "레 미 솦 미 레 레미솦미레도레 미 솦 미 레 레미솦미레도레 파 랖 파 레 레파랖파레도레 파 랖 파 레 레미솦 미 레 미 솦 미 레 레미솦미레도레 미 솦 미 레 레미솦미레도레 파 랖 파 레 레파랖파레도레 파 랖 파 레 레미솦 미          도도라도라도라미솦미" +
    "        도도라도라도라미솦미      도도라도라도라미솦미      도도라도라도라미솦미   랖솦 도도라도라도라미솦미      도도라도라도라미솦미      도도라도라도라파랖파      도도라도라도라파랖파   랖솦 솦랖미레도라"
}
musicSpeed = {"징글벨": 250, "징글벨락": 62, "엘사?": 125, "고요한밤": 400, "CREDIT": 200, "눈": 220, "빌었어": 125, "메리크리스마스": 250, "아마두": 250};
noteBlocks = {
    "팟": [1464, 100, 720], "솔": [1465, 100, 720], "솟": [1466, 100, 720], "라": [1467, 100, 720], "랏": [1468, 100, 720], "시": [1469, 100, 720],
    "도": [1464, 100, 721], "돗": [1465, 100, 721], "레": [1466, 100, 721], "렛": [1467, 100, 721], "미": [1468, 100, 721], "파": [1469, 100, 721],
    "팠": [1464, 100, 722], "솦": [1465, 100, 722], "솠": [1466, 100, 722], "랖": [1467, 100, 722], "랐": [1468, 100, 722], "싶": [1469, 100, 722],
    "돞": [1464, 100, 723], "돘": [1465, 100, 723], "렢": [1466, 100, 723], "렜": [1467, 100, 723], "밒": [1468, 100, 723], "팦": [1469, 100, 723],
    "팍": [1466, 102, 724]
}

let playingDenmongUs = false;
let impostor;
let survivor;
let dead;
let impostorCoolTime = false;

let randomNumbers = [...Array(81).keys()];

let following = false;

function saveData() {
    api.updateBin({
        id: "5fb8d7c504be4f05c9286f33",
        data: {"place": place, "owners": owners, "dialog": dialog},
        versioning: true
    });
}

function delay(n) {
  n = n || 2000;
  return new Promise(done => {
    setTimeout(() => {
      done();
    }, n);
  });
}

async function playMafia() {
    playingMafia = true;
    day = 0;
    players = {};
    mafiaList = [];
    for (var i of playerArray) {
        //job, HP, votingTarget, votedTarget, votingExecution, doingJob
        players[i] = ["citizen", 0, false, 0, false];
    }
    players[playerArray[0]][0] = "cop";
    players[playerArray[1]][0] = "doctor";
    if (playerArray.length <= 6) {
        mafiaList = [playerArray[2]];
        players[playerArray[2]][0] = "mafia";
        mafia = 1;
    } else {
        mafiaList = [playerArray[2], playerArray[3]];
        players[playerArray[2]][0] = "mafia";
        players[playerArray[3]][0] = "mafia";
        mafia = 2;
    }
    bot.chat("■ 옛날부터, 산타 할아버지는 꿈이 있었어요.");
    await delay(8000);
    bot.chat("■ 바로, 아이들의 선물을 들고 토껴서 휴가를 떠나는 꿈이예요.");
    await delay(8000);
    bot.chat("■ 1년 내내 시급도 안 받으며 선물을 만들고, 크리스마스에는 그야말로 극한의 파쿠르를 해야하는 산타 할아버지에게 그것은 이룰 수 없는 꿈이였어요.");
    await delay(8000);
    bot.chat("■ 그러다가 올해, 코로나로 인해 물가가 상승하고 아이들이 비싼 선물을 요구하자, 산타 할아버지는 빡돌아서 계획을 실현하기로 마음먹었어요!");
    await delay(8000);
    bot.chat("■ 그럼 이제 게임을 시작해볼까요?");
    await delay(8000);
    bot.chat("■ 지금부터 여러분의 역할을 정하도록 하겠습니다.");
    await delay(15000);
    if (!playingMafia) {
        bot.chat("산타 게임이 끝났습니다.");
        return;
    }
    for (var i in players) {
        bot.chat(`/w ${i} ${{
            cop: "당신은 크리스마스 요정입니다. 아이들을 자세하게 조사하면서 산타 할아버지를 찾으세요!",
            doctor: "당신은 아침의 요정입니다. 잠든 아이들을 깨우세요!",
            mafia: "당신은 산타입니다. 아이들을 재워 선물을 챙기고 휴가를 즐기세요!",
            citizen: "당신은 어린아이입니다. 잠들지 않고 산타 할아버지를 찾으세요!"
        }[players[i][0]]}`)
        if (mafiaList.length > 1 && players[i][0] == "mafia") {
            bot.chat(`/w ${i} 당신의 파트너는 ${mafiaList[0] != i ? mafiaList[0] : mafiaList[1]}님입니다.`)
        }
    }
    await delay(15000);
    bot.chat("■ 본격적인 게임을 시작하겠습니다.");
    await delay(8000);
    bot.chat("■ 크리스마스 요정은 한 시간마다 한 명을 선택하여 산타 여부를 확인할 수 있습니다. 아침의 요정은 한 시간마다 잠든 한 명을 깨울 수 있습니다.");
    await delay(5000);
    bot.chat("■ 산타는 한 시간마다 한 명을 재울 것입니다.");
    await delay(5000);
    bot.chat("■ 투표를 해서 산타 할아버지를 모두 찾으면 아이들의 승리.");
    await delay(5000);
    bot.chat("■ 깨어 있는 아이들의 수가 줄어 산타 할아버지의 수와 같아지면 산타 할아버지의 승리.");
    await delay(8000);
    bot.chat("■ 지금부터, 여러분들께 자유롭게 이야기할 시간 2분을 드립니다.");
    bot.chat("■ 메리 크리스마스!");
    if (!playingMafia) {
        bot.chat("산타 게임이 끝났습니다.");
        return;
    }
    await delay(60000);
    bot.chat("■ 이야기 시간 1분 남았습니다.");
    if (!playingMafia) {
        bot.chat("산타 게임이 끝났습니다.");
        return;
    }
    await delay(50000);
    bot.chat("■ 이야기 시간 10초 남았습니다. 투표를 준비해주세요.");
    (async () => {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        function* loop() {
            yield 10000;
            bot.chat("■ 지금부터 투표로 산타로 의심되는 아이 한 명을 뽑겠습니다.");
            for (var i in players) {
                players[i][2] = true;
                players[i][3] = 0;
            }
            yield 8000;
            bot.chat("■ 뽑을 아이의 닉네임을 채팅으로 말해주세요. (35초)");
            yield 35000;
            for (var i in players) {
                players[i][2] = false;
            }
            target = "";
            for (var i in players) {
                if (players[i][3] > Object.keys(players).length / 2) {
                    target = i;
                }
            }
            if (target != "") {
                bot.chat(`■ 가장 많은 표를 받은 ${target}님, 마지막 반론. (30초, 참가자 전원 쉿!)`);
                yield 30000;
                bot.chat("■ 채팅으로 간지럽히기에 찬성하시는 분은 '찬성'을, 반대하시는 분은 '반대'를 입력해주세요. (15초)");
                for (var i in players) {
                    players[i][4] = true;
                }
                execution = 0;
                yield 15000;
                for (var i in players) {
                    players[i][4] = false;
                }
                if (execution > Object.keys(players).length / 2) {
                    if (players[target][0] == "mafia") {
                        bot.chat(`■ ${target}을(를) 간지럽혔습니다. ${target}님은 산타 할아버지가 맞았습니다.`);
                        mafia --;
                    } else {
                        bot.chat(`■ ${target}을(를) 간지럽혔습니다. ${target}님은 산타 할아버지가 아니였습니다.`);
                    }
                    delete players[target];
                } else {
                    bot.chat(`■ ${target}을(를) 간지럽히지 않았습니다.`);
                }
            } else {
                bot.chat("■ 투표가 기권되었습니다.");
            }
            if (mafia == 0) {
                bot.chat("■ 아이 팀의 승리!");
                playingMafia = false;
                return;
            }
            if (Object.keys(players).length / 2 <= mafia) {
                bot.chat("■ 산타 팀의 승리!");
                yield 5000;
                bot.chat("■ 산타 할아버지는...");
                yield 3000;
                if (mafiaList.length == 1) {
                    bot.chat(`${mafiaList[0]}님이였습니다!`);
                } else {
                    bot.chat(`${mafiaList[0]}님, ${mafiaList[1]}님이였습니다!`);
                }
                playingMafia = false;
                return;
            }
            yield 8000;
            bot.chat(`■ ${day}시 30분이 되었습니다.`);
            day ++;
            copChoose = true;
            doctorChoose = true;
            mafiaChoose = true;
            cure = "";
            kill = "";
            yield 8000;
            bot.chat("■ 산타 할아버지는 제게 귓속말로, 잠재울 아이의 이름을 보내주세요.");
            yield 2000;
            bot.chat("■ 아침의 요정은 제게 귓속말로, 깨울 아이의 이름을 보내주세요.");
            yield 2000;
            bot.chat("■ 크리스마스 요정은 제게 귓속말로, 조사할 아이의 이름을 보내주세요.");
            yield 5000;
            bot.chat("■ 30초 드리겠습니다. (귓속말 보내는법: /w ShidaBot)");
            yield 30000;
            copChoose = false;
            doctorChoose = false;
            mafiaChoose = false;
            bot.chat(`■ ${day}시가 되었습니다.`);
            yield 8000;
            if (kill == "") {
                bot.chat("■ 30분 전, 산타 할아버지는 그 누구도 재우지 않았습니다.");
            } else if (kill == cure) {
                bot.chat(`■ 30분 전, 산타 할아버지가 ${kill}을(를) 재웠지만, 아침의 요정이 깨워주었습니다.`);
            } else {
                bot.chat(`■ 30분 전, 산타 할아버지가 ${kill}을(를) 재웠고, ${kill}은(는) 꿀잠을 자고 있습니다.`);
                delete players[kill];
            }
            yield 2000;
            if (Object.keys(players).length / 2 <= mafia) {
                bot.chat("■ 산타 팀의 승리!");
                yield 5000;
                bot.chat("■ 산타 할아버지는...");
                yield 3000;
                if (mafiaList.length == 1) {
                    bot.chat(`${mafiaList[0]}님이였습니다!`);
                } else {
                    bot.chat(`${mafiaList[0]}님, ${mafiaList[1]}님이였습니다!`);
                }
                playingMafia = false;
                return;
            }
            yield 8000;
            bot.chat("■ 지금부터, 여러분들께 자유롭게 이야기할 시간 2분을 드립니다.");
            yield 120000;
            bot.chat("■ 이야기 시간 1분 남았습니다.");
            yield 50000;
            bot.chat("■ 이야기 시간 10초 남았습니다. 투표를 준비해주세요.");
        }
        let ctx = loop();
        while (true) {
            if (!playingMafia) {
                bot.chat("산타 게임이 종료되었습니다.");
                return;
            }
            const data = ctx.next();
            if (data.done) ctx = loop();
            else await sleep(data.value);
        }
    })();
}

async function noteBlockMusic() {
    playingPiano = true;
    while (playingPiano) {
        if (randomMusic) {
            title = Object.keys(noteBook)[Math.floor(Math.random() * Object.keys(noteBook).length)];
            note = noteBook[title];
            await delay(2000);
        }
        for (i of note) {
            if (i != " ") {
                //bot.activateBlock(bot.blockAt(new Vec3(...noteBlocks[i])));
                if (i == "똑") {
                    bot.activateBlock(bot.blockAt(new Vec3(1463, 101, 723)));
                    bot.swingArm();
                } else if (i == "릴") {
                    bot.chat("릴보이 성공하자!");
                    await delay(5000);
                    bot.chat("빠끄!!!");
                } else {
                    bot.lookAt(new Vec3(...noteBlocks[i]), true, () => {
                        bot.swingArm();
                        bot._client.write('block_dig', {
                          status: 0,
                          location: new Vec3(...noteBlocks[i])
                        });
                        setTimeout(() => {
                            bot._client.write('block_dig', {
                              status: 1,
                              location: new Vec3(...noteBlocks[i])
                            })
                        }, 30);
                    });
                }
            }
            await delay(musicSpeed[title]);
            if (!playingPiano) {
                break;
            }
        }
    }
    playingPiano = false;
}

client.on("message", (message) => {
    if (message.channel.id == "789720071433093180") {
        if (message.content.includes("접속") && !connected) {
            connected = true;
            message.channel.send("어우 귀찮아");
            bot = mineflayer.createBot({
                host: "denvers.kro.kr",
                port: 25565,
                username: process.env.mcId,
                password: process.env.mcPw,
                version: false
            });
            navigatePlugin(bot);
            bot.once('spawn', () => {
                //mineflayerViewer(bot, { port: 3007, firstPerson: true })
                setTimeout(() => {
                    bot.on("playerJoined", (user) => {
                        username = user.username
                        if (owners.includes(username)) {
                            bot.chat(`${username} ㅎㅇ`);
                        }
                    });
                }, 10000);
                bot.on("playerLeft", (user) => {
                    if (owners.filter(a => (Object.keys(bot.players).includes(a))).length == 0) {
                        bot.chat("퇴근");
                        connected = false;
                        bot.quit();
                    }
                });
                bot.chat("ㅎㅇ '시다야'라고 부르셈");
                const mcData = require("minecraft-data")(bot.version);
                bot.on('chat', function (username, message) {
                    if (username == "TodoRoki__Shoto" && message.startsWith("시다야 추첨")) {
                        randomIndex = Math.floor(Math.random() * randomNumbers.length);
                        bot.chat((randomNumbers[Math.floor(Math.random() * randomNumbers.length)] + 1).toString())
                    }
                    if (owners.includes(username)) {
                        switch (true) {
                            case /^시다야 도움말/.test(message):
                                bot.chat(`/w ${username} 옛다 명령어 목록`);
                                bot.chat(`/w ${username} 시다야 커맨드 추가 [입력] [출력] / 산타게임 시작 [플레이어 닉네임, 띄어쓰기로 구분] / 시다야 노래 [노래제목] / 시다야 노래목록 / 시다야 계산 [계산 내용] / 시다야 나가 / 시다야 추첨`);
                                break;
                            case /^시다야 커맨드 추가/.test(message):
                                rawInput = message.split(" ");
                                if (rawInput.length >= 5) {
                                    if (rawInput.slice(4).join(" ").length <= 30) {
                                        dialog[rawInput[3]] = rawInput.slice(4).join(" ");
                                        bot.chat("ㅇ");
                                    } else {
                                        bot.chat("너무 김 그걸 어케 외워");
                                    }
                                    saveData();
                                } else {
                                    bot.chat("어쩌라는거지");
                                }
                                break;
                            case /^시다야 노래 종료/.test(message):
                                playingPiano = false;
                                randomMusic = false;
                                break;
                            case /^시다야 노래목록/.test(message):
                                bot.chat("비행기/징글벨/징글벨락/엘사?/고요한밤/CREDIT/눈/빌었어/메리크리스마스/아마두")
                                break;
                            case /^시다야 노래 랜덤/.test(message):
                                if (!playingPiano) {
                                    randomMusic = true;
                                    noteBlockMusic();
                                } else {
                                    bot.chat("치고 있잖아;");
                                }
                                break;
                            case /^시다야 노래 /.test(message):
                                if (!playingPiano) {
                                    title = message.split(" ")[2]
                                    if (noteBook[title]) {
                                        bot.chat(`OK ${title} 렛츠기릿`);
                                        note = noteBook[title];
                                        noteBlockMusic();
                                    } else {
                                        bot.chat("그게 뭔데;");
                                    }
                                } else {
                                    bot.chat("치고 있잖아;");
                                }
                                break;
                            case /^시다야 계산 /.test(message):
                                try {
                                    bot.chat(math.evaluate(message.split(" ")[2]).toString());
                                } catch (e) {
                                    bot.chat("ㅇ?");
                                }
                                break;
                            case /^시다야 나가/.test(message):
                                bot.chat("개꿀");
                                connected = false;
                                bot.quit();
                                break;
                            case /^시다야 따라와/.test(message):
                                following = true;
                                if (bot.players[username].entity && bot.players[username].entity.position.distanceTo(bot.entity.position) < 5) {
                                    bot.navigate.to(bot.players[username].entity.position);
                                    bot.navigate.on("arrived", () => {
                                        if (following && bot.players[username].entity) {
                                            setTimeout(() => {
                                                bot.navigate.to(bot.players[username].entity.position);
                                            }, 500);
                                        }
                                    });
                                } else {
                                    bot.chat("어딘데;");
                                }
                                break;
                            case /^시다야 멈춰/.test(message):
                                following = false;
                                bot.navigate.stop();
                                break;
                            case /^시다야/.test(message):
                                command = message.split(" ")[1] ? message.split(" ")[1] : undefined;
                                if (dialog[command] != undefined) {
                                    bot.chat(dialog[command]);
                                } else {
                                    bot.chat("ㅇ?");
                                }
                                break;
                            case /^산타게임 시작/.test(message):
                                if (!playingMafia) {
                                    playerArray = message.split(" ");
                                    if (playerArray.length <= 2) {
                                        bot.chat("플레이어 닉네임 쓰라고 ㅡㅡ");
                                    } else {
                                        playerArray = playerArray.slice(2);
                                        playerArray.sort(() => Math.random() - 0.5);
                                        if (playerArray.length < 4) {
                                            bot.chat("플레이어 수 부족함 ㅅㄱㅇ");
                                        } else {
                                            playMafia();
                                        }
                                    }
                                } else {
                                    bot.chat("산타게임 하고 있는거 안보이냐");
                                }
                                break;
                            case /^덴몽어스 시작/.test(message):
                                if (!playingDenmongUs) {
                                    playerArray = message.split(" ");
                                    if (playerArray.length <= 2) {
                                        bot.chat("플레이어 닉네임 쓰라고 ㅡㅡ");
                                    } else {
                                        playerArray = playerArray.slice(2);
                                        if (playerArray.length < 4) {
                                            bot.chat("플레이어 수 부족함 ㅅㄱ");
                                        } else {
                                            playingDenmongUs = true;
                                            impostorIndex = Math.floor(Math.random() * playerArray.length);
                                            impostor = playerArray[impostorIndex];
                                            survivor = playerArray.slice();
                                            dead = [];
                                            survivor.splice(impostorIndex, 1);
                                            denmongConsole.send(`IMPOSTOR ${impostor}`);
                                            for (i of survivor) {
                                                denmongConsole.send(`SURVIVOR ${i}`);
                                            }
                                        }
                                    }
                                } else {
                                    bot.chat("덴몽어스 하고 있는거 안보이냐");
                                }
                                break;
                            case /^덴몽어스 종료/.test(message):
                                bot.chat("END");
                                playingDenmongUs = false;
                                break;
                        }
                    }
                    if (playingMafia) {
                        if (players[username] != undefined && players[username][2] && players[message.replace(" ", "")] != undefined) {
                            players[username][2] = false;
                            players[message.replace(" ", "")][3] ++;
                            bot.chat(`/w ${username} 투표가 성공적으로 완료되었습니다.`);
                        } else if (players[username] != undefined && players[username][4]) {
                            if (message.replace(" ", "") == "찬성") {
                                players[username][4] = false;
                                bot.chat(`/w ${username} 투표가 성공적으로 완료되었습니다.`);
                                execution ++;
                            } else if (message.replace(" ", "") == "반대") {
                                players[username][4] = false;
                                bot.chat(`/w ${username} 투표가 성공적으로 완료되었습니다.`);
                            }
                        } else if (players[username] != undefined && players[username][0] != "citizen" && eval(`${players[username][0]}Choose`) && message.startsWith("me]") && players[message.replace(" ", "").replace("me]", "")] != undefined) {
                            switch (players[username][0]) {
                                case "cop":
                                    bot.chat(`/w ${username} ${message.replace(" ", "").replace("me]", "")}님은 산타 할아버지가 ${players[message.replace(" ", "").replace("me]", "")][0] == "mafia" ? "맞습" : "아닙"}니다.`);
                                    copChoose = false;
                                    break;
                                case "doctor":
                                    bot.chat(`/w ${username} ${message.replace(" ", "").replace("me]", "")}님을 깨웁니다.`);
                                    cure = message.replace(" ", "").replace("me]", "");
                                    doctorChoose = false;
                                    break;
                                case "mafia":
                                    if (username != message.replace(" ", "").replace("me]", "")) {
                                        bot.chat(`/w ${username} ${message.replace(" ", "").replace("me]", "")}님을 재웠습니다.`);
                                        kill = message.replace(" ", "").replace("me]", "");
                                        mafiaChoose = false;
                                    }
                                    break;
                            }
                        }
                    }
                    if (message.includes("산타게임 종료") && username != "ShidaBot") {
                        playingMafia = false;
                    }
                });
                bot.on("message", (message) => {
                    if (message.json.extra != undefined && message.json.extra[1] != undefined && /덴버 서버 첫 방문을 환영합니다/.test(message.json.extra[1].text)) {
                        bot.chat(`${message.json.extra[0].text}님, 어서오세요! 야생 시작하시기 전에 스폰 지역에 있는 표지판 한번씩 숙지해주시고 플레이 해주시면 감사 드리겠습니다. :D`);
                    }
                });
                bot.on("entitySwingArm", (attacker) => {
                    if (playingDenmongUs && attacker.type == "player") {
                        for (var i in bot.players) {
                            target = bot.players[i].entity;
                            if (target && ((attacker.username == impostor && !impostorCoolTime) || survivor.includes(attacker.username)) && survivor.includes(target.username)) {
                                const { height, position, yaw, pitch } = attacker;
                                const cursor = position.offset(0, height, 0)

                                const x = -Math.sin(yaw) * Math.cos(pitch)
                                const y = Math.sin(pitch)
                                const z = -Math.cos(yaw) * Math.cos(pitch)

                                const step = new Vec3(x, y, z).scaled(1 / 8)

                                for (let i = 0; i < 4 / (1 / 8); ++i) {
                                    cursor.add(step)
                                    const block = bot.blockAt(cursor)
                                    if (block && block.type !== 0) {
                                        break;
                                    }
                                    if (cursor.xzDistanceTo(target.position) <= 0.6 && target.position.y - 0.5 <= cursor.y && target.position.y + 1.8 >= cursor.y) {
                                        if (attacker.username == impostor && !dead.includes(target.username) && survivor.includes(target.username)) {
                                            denmongConsole.send(`DEATH ${target.username}`);
                                            dead.push(target.username);
                                            impostorCoolTime = true;
                                            setTimeout(() => {
                                                impostorCoolTime = false;
                                            }, 2500);
                                        } else if (dead.includes(target.username) && survivor.includes(target.username)) {
                                            denmongConsole.send(`FOUND ${target.username}`);
                                            survivor.splice(survivor.indexOf(target.username), 1);
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                });
            });
        } else if (message.content.includes("나가") && connected) {
            connected = false;
            playingMafia = false;
            playingDenmongUs = false;
            playingPiano = false;
            message.channel.send("개꿀");
            setTimeout(() => bot.quit(), 3000);
        }
    }
});

client.login(process.env.discordToken);

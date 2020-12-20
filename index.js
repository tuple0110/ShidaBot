let connected = false;

var bot;

const mineflayer = require("mineflayer");
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear } = require('mineflayer-pathfinder').goals
//const mineflayerViewer = require("prismarine-viewer").mineflayer;
const Vec3 = require("vec3");

const Discord = require("discord.js");
const client = new Discord.Client();
let messenger;
client.once('ready', () => {
    messenger = client.channels.cache.get("789720071433093180");
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

// 팟 솔 솟 라 랏 시 도 돗 레 렛 미 파 팠 솦 솠 랖 랐 싶 돞 돘 렢 렜 밒 팦 팍
noteBook = {
    "비행기": "시  라솔 라 시 시 시   라 라 라   시 시 시   시  라솔 라 시 시 시   라 라 시  라솔",
    "징글벨": "도랖솦파도   도랖솦파레   레랐랖솦미   돞돞랐솦랖 파 도랖솦파도   도랖솦파레   레랐랖솦 돞돞돞돞렢돞랐솦파   랖랖랖 랖랖랖 랖돞파솦랖   랐랐랐랐랐랖랖랖랖솦솦파솦 돞 랖랖랖 랖랖랖 랖돞파솦랖   랐랐랐랐랐랖랖랖돞돞랖솦파",
    "징글벨락": "돞   돞돞   싶  싶싶   랖  싶랖   미       랖  싶랖   미   솦   랖  싶랖   파       레  미파   솦  랖솦   레  미파   솦           랖   랖   랖   랖   미 미         돞  돞돞   싶  싶싶   랖  싶랖   미       " +
    "랖  싶랖   미   솦   랖  싶랖   파       레  미파   솦  랖솦   레  미파   솦           "
}
musicSpeed = {"비행기": 125, "징글벨": 250, "징글벨락": 62}
noteBlocks = {
    "팟": [1499, 102, 692], "솔": [1499, 102, 693], "솟": [1499, 102, 694], "라": [1499, 102, 695], "랏": [1499, 102, 696],
    "시": [1498, 102, 697], "도": [1497, 102, 697], "돗": [1496, 102, 697], "레": [1495, 102, 697], "렛": [1494, 102, 697],
    "미": [1493, 102, 696], "파": [1493, 102, 695], "팠": [1493, 102, 694], "솦": [1493, 102, 693], "솠": [1493, 102, 692],
    "랖": [1494, 102, 691], "랐": [1495, 102, 691], "싶": [1496, 102, 691], "돞": [1497, 102, 691], "돘": [1498, 102, 691],
    "렢": [1497, 100, 693], "렜": [1497, 100, 694], "밒": [1497, 100, 695], "팦": [1495, 100, 695], "팍": [1495, 100, 693]
}

let playingDevade = false;
let hunter;
let survivor;
let hunterCoolTime = false;

function saveData() {
    api.updateBin({
        id: "5fb8d7c504be4f05c9286f33",
        data: {"place": place, "owners": owners, "dialog": dialog},
        versioning: true
    });
}

function waitPortal(world, cb) {
    waitPortalLoop = setInterval(() => {
        if (bot.game.dimension == world) {
            clearInterval(waitPortalLoop);
            cb();
        }
    }, 2000);
}

function journey(path, pathIndex, cb) {
    if (pathIndex < path.length) {
        bot.pathfinder.goto(new GoalNear(...path[pathIndex].slice(1), 1), () => {
            place = path[pathIndex][0];
            saveData();
            journey(path, pathIndex + 1, cb);
        });
    } else {
        cb();
    }
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
    day = 1;
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
    bot.chat("■ 반갑습니다. 이번 마피아 게임의 사회를 맡게 된 ShidaBot입니다.");
    await delay(8000);
    bot.chat("■ 지금부터 여러분들의 직업을 정하도록 하겠습니다.");
    await delay(15000);
    for (var i in players) {
        bot.chat(`/w ${i} ${{
            cop: "당신은 경찰입니다. 철저한 수사를 통해 마피아를 밝혀내십시오.",
            doctor: "당신은 의사입니다. 마피아의 공격으로부터 사람들을 살려내십시오.",
            mafia: "당신은 마피아입니다. 은밀하게 시민들을 제거하여 마을을 장악하십시오.",
            citizen: "당신은 시민입니다. 현명하게 시민의 권리를 행사하여 마피아 패거리로부터 마을을 지켜내십시오."
        }[players[i][0]]}`)
        if (mafiaList.length > 1 && players[i][0] == "mafia") {
            bot.chat(`/w ${i} 당신의 파트너는 ${mafiaList[0] != i ? mafiaList[0] : mafiaList[1]}님입니다.`)
        }
    }
    await delay(15000);
    bot.chat("■ 본격적인 게임을 시작하겠습니다.");
    await delay(8000);
    bot.chat("■ 경찰은 밤마다 한 명을 선택하여 마피아 여부를 확인할 수 있습니다. 의사는 밤마다 한 명을 마피아의 공격으로부터 살릴 수 있습니다.");
    await delay(5000);
    bot.chat("■ 마피아는 밤이 될 때마다 한 명을 살해할 것입니다.");
    await delay(5000);
    bot.chat("■ 투표를 해서 마피아를 모두 찾으면 시민의 승리.");
    await delay(5000);
    bot.chat("■ 시민 수가 줄어 마피아의 수와 같아지면 마피아의 승리.");
    await delay(8000);
    bot.chat("■ 지금부터, 여러분들께 자유롭게 대화할 시간 2분을 드립니다.");
    bot.chat("■ 행운을 빕니다.");
    await delay(60000);
    bot.chat("■ 대화 시간 1분 남았습니다.");
    await delay(50000);
    bot.chat("■ 대화 시간 10초 남았습니다. 투표를 준비해주세요.");
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    function* loop() {
        yield 10000;
        bot.chat("■ 지금부터 투표로 마피아로 의심되는 사람 한 명을 뽑겠습니다.");
        for (var i in players) {
            players[i][2] = true;
            players[i][3] = 0;
        }
        yield 8000;
        bot.chat("■ 뽑을 사람의 닉네임을 채팅으로 말해주세요. (35초)");
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
            bot.chat(`■ 가장 많은 표를 받은 ${target}님, 최후의 반론. (30초, 참가자 전원 쉿!)`);
            yield 30000;
            bot.chat("■ 채팅으로 처형에 찬성하시는 분은 '찬성'을, 반대하시는 분은 '반대'를 입력해주세요. (15초)");
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
                    bot.chat(`■ ${target}님이 처형당했습니다. ${target}님은 마피아가 맞았습니다.`);
                    mafia --;
                } else {
                    bot.chat(`■ ${target}님이 처형당했습니다. ${target}님은 마피아가 아니였습니다.`);
                }
                delete players[target];
            } else {
                bot.chat(`■ ${target}님이 처형되지 않았습니다.`);
            }
        } else {
            bot.chat("■ 투표가 기권되었습니다.");
        }
        if (mafia == 0) {
            bot.chat("■ 시민 팀의 승리!");
            playingMafia = false;
            break;
        }
        if (Object.keys(players).length / 2 <= mafia) {
            bot.chat("■ 마피아 팀의 승리!");
            yield 5000;
            bot.chat("■ 마피아는...");
            yield 3000;
            if (mafiaList.length == 1) {
                bot.chat(`${mafiaList[0]}님이였습니다!`);
            } else {
                bot.chat(`${mafiaList[0]}님, ${mafiaList[1]}님이였습니다!`);
            }
            playingMafia = false;
            break;
        }
        yield 8000;
        bot.chat(`■ ${day} 번째 밤이 되었습니다.`);
        day ++;
        copChoose = true;
        doctorChoose = true;
        mafiaChoose = true;
        cure = "";
        kill = "";
        yield 8000;
        bot.chat("■ 마피아는 제게 귓속말로, 살해할 사람의 이름을 보내주세요.");
        yield 2000;
        bot.chat("■ 의사는 제게 귓속말로, 치료할 사람의 이름을 보내주세요.");
        yield 2000;
        bot.chat("■ 경찰은 제게 귓속말로, 조사할 사람의 이름을 보내주세요.");
        yield 5000;
        bot.chat("■ 30초 드리겠습니다. (귓속말 보내는법: /w ShidaBot)");
        yield 30000;
        copChoose = false;
        doctorChoose = false;
        mafiaChoose = false;
        bot.chat(`■ ${day} 번째 날 아침이 밝았습니다.`);
        yield 8000;
        if (kill == "") {
            bot.chat("■ 어젯밤, 마피아의 총구는 그 누구도 겨누지 않았습니다.");
        } else if (kill == cure) {
            bot.chat(`■ 어젯밤, ${kill}님이 마피아의 총에 맞았으나, 의사의 치료를 받고 살아났습니다.`);
        } else {
            bot.chat(`■ 어젯밤, ${kill}님이 마피아의 총에 맞고 숨졌습니다.`);
            delete players[kill];
        }
        yield 2000;
        if (Object.keys(players).length / 2 <= mafia) {
            bot.chat("■ 마피아 팀의 승리!");
            yield 5000;
            bot.chat("■ 마피아는...");
            yield 3000;
            if (mafiaList.length == 1) {
                bot.chat(`${mafiaList[0]}님이였습니다!`);
            } else {
                bot.chat(`${mafiaList[0]}님, ${mafiaList[1]}님이였습니다!`);
            }
            playingMafia = false;
            break;
        }
        yield 8000;
        bot.chat("■ 지금부터, 여러분들께 자유롭게 대화할 시간 2분을 드립니다.");
        yield 120000;
        bot.chat("■ 대화 시간 1분 남았습니다.");
        yield 50000;
        bot.chat("■ 대화 시간 10초 남았습니다. 투표를 준비해주세요.");
    }
    let ctx = loop();
    while (true) {
        if (stopped) return;
        const data = ctx.next();
        if (data.done) ctx = loop();
        else await sleep(data.value);
    }
}

async function noteBlockMusic() {
    playingPiano = true;
    for (i of note) {
        if (i != " ") {
            //bot.activateBlock(bot.blockAt(new Vec3(...noteBlocks[i])));
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
        await delay(musicSpeed[title]);
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
            bot.loadPlugin(pathfinder);
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
                const defaultMove = new Movements(bot, mcData);
                defaultMove.canDig = false;
                bot.pathfinder.setMovements(defaultMove);
                bot.on('chat', function (username, message) {
                    if (owners.includes(username)) {
                        switch (true) {
                            case /^시다야 도움말/.test(message):
                                bot.chat(`/w ${username} 옛다 명령어 목록`);
                                bot.chat(`/w ${username} 시다야 커맨드 추가 [입력] [출력] / 마피아 시작 [플레이어 닉네임, 띄어쓰기로 구분] / 시다야 노래 [노래제목] / 시다야 노래목록 / 시다야 계산 [계산 내용] / 시다야 나가`);
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
                            case /^시다야 노래 /.test(message):
                                title = message.split(" ")[2]
                                if (!playingPiano) {
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
                            case /^시다야/.test(message):
                                command = message.split(" ")[1] ? message.split(" ")[1] : undefined;
                                if (dialog[command] != undefined) {
                                    bot.chat(dialog[command]);
                                } else {
                                    bot.chat("ㅇ?");
                                }
                                break;
                            case /^마피아 시작/.test(message):
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
                                    bot.chat("마피아 하고 있는거 안보이냐");
                                }
                                break;
                            case /^데바데 시작/.test(message):
                                if (!playingDevade) {
                                    playerArray = message.split(" ");
                                    if (playerArray.length <= 2) {
                                        bot.chat("플레이어 닉네임 쓰라고 ㅡㅡ");
                                    } else {
                                        playerArray = playerArray.slice(2);
                                        if (playerArray.length < 2) {
                                            bot.chat("플레이어 수 부족함 ㅅㄱ");
                                        } else {
                                            bot.chat("Dead by...");
                                            setTimeout(() => bot.chat("DAYLIGHT"), 3000);
                                            playingDevade = true;
                                            hunter = playerArray[0];
                                            survivor = playerArray.slice(1);
                                        }
                                    }
                                } else {
                                    bot.chat("데바데 하고 있는거 안보이냐");
                                }
                                break;
                            case /^데바데 종료/.test(message):
                                bot.chat("END");
                                playingDevade = false;
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
                                    bot.chat(`/w ${username} ${message.replace(" ", "").replace("me]", "")}님은 마피아가 ${players[message.replace(" ", "").replace("me]", "")][0] == "mafia" ? "맞습" : "아닙"}니다.`);
                                    copChoose = false;
                                    break;
                                case "doctor":
                                    bot.chat(`/w ${username} ${message.replace(" ", "").replace("me]", "")}님을 진찰합니다.`);
                                    cure = message.replace(" ", "").replace("me]", "");
                                    doctorChoose = false;
                                    break;
                                case "mafia":
                                    if (username != message.replace(" ", "").replace("me]", "")) {
                                        bot.chat(`/w ${username} ${message.replace(" ", "").replace("me]", "")}님에게 총을 쏘았습니다.`);
                                        kill = message.replace(" ", "").replace("me]", "");
                                        mafiaChoose = false;
                                    }
                                    break;
                            }
                        }
                    }
                    if (message.includes("마피아 종료") && username != "ShidaBot") {
                        playingMafia = false;
                    }
                });
                bot.on("message", (message) => {
                    if (message.json.extra != undefined && message.json.extra[1] != undefined && /덴버 서버 첫 방문을 환영합니다/.test(message.json.extra[1].text)) {
                        bot.chat(`${message.json.extra[0].text}님, 어서오세요! 야생 시작하시기 전에 스폰 지역에 있는 표지판 한번씩 숙지해주시고 플레이 해주시면 감사 드리겠습니다. :D`);
                    }
                });
                bot.on("entitySwingArm", (attacker) => {
                    if (playingDevade && attacker.type == "player" && !hunterCoolTime) {
                        hunterCoolTime = true;
                        setTimeout(() => {
                            hunterCoolTime = false;
                        }, 2500);
                        for (var i in bot.players) {
                            target = bot.players[i].entity;
                            if (target && attacker.username == hunter && survivor.includes(target.username)) {
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
                                        bot.chat(`/w ${target.username} ATTACKED`);
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
            playingDevade = false;
            playingPiano = false;
            message.channel.send("개꿀");
            setTimeout(() => bot.quit(), 3000);
        }
    }
});

client.login(process.env.discordToken);

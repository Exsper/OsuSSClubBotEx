const CommandsInfo = require("./CommandsInfo");
const getBeatmapData = require("./api/beatmap/getBeatmapData");
const getScoreData = require("./api/score/getScoreData");
const getUserData = require("./api/user/getUserData");

class RunCommand {
    // TODO
    async run(osuApi, command, argObjects) {
        // 下达任务
        const commandsInfo = new CommandsInfo();
        if (command.commandType === commandsInfo.apiType.beatmap)
            return await new getBeatmapData().getData(osuApi, argObjects);
        else if ((command.commandType === commandsInfo.apiType.score) || (command.commandType === commandsInfo.apiType.scoreVs))
            return await new getScoreData().getData(osuApi, argObjects);
        else if (command.commandType === commandsInfo.apiType.user)
            return await new getUserData().getData(osuApi, argObjects);
        else if (command.commandType === commandsInfo.apiType.scoreTop)
            return await new getScoreData().getTopData(osuApi, argObjects);
    }
}

module.exports = RunCommand;
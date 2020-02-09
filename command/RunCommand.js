const CommandsInfo = require("./CommandsInfo");
const getBeatmapData = require("./api/beatmap/getBeatmapData");
const getScoreData = require("./api/score/getScoreData");

class RunCommand {
    // TODO
    async run(osuApi, command, argObjects) {
        // 下达任务
        if (command.commandType === new CommandsInfo().apiType.beatmap)
            return await new getBeatmapData().getData(osuApi, argObjects);
        else if (command.commandType === new CommandsInfo().apiType.score)
            return await new getScoreData().getData(osuApi, argObjects);
    }
}

module.exports = RunCommand;
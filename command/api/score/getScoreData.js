const ScoreObject = require("./ScoreObject");


class getScoreData {
    async getScoreObject(osuApi, argObject) {
        try {
            const scores = await osuApi.getScores(argObject);
            let scoreObject = new ScoreObject(scores);
            return scoreObject;
        }
        catch (ex) {
            delete argObject.k; // 不显示token
            if (ex.message === "Not found") return "找不到成绩 " + JSON.stringify(argObject) + "\n";
            return "从Osu!api获取数据出错\n" + ex.message;
        }
    }

    async getData(osuApi, argObjects) {
        let scoreObjects = [];
        for (let i = 0, len = argObjects.length; i < len; i++) {
            let item = await this.getScoreObject(osuApi, argObjects[i]);
            scoreObjects.push(item);
        }
        let output = "";
        output = output + scoreObjects[0].toString(true, argObjects[0]);
        for (let i = 1, len = scoreObjects.length; i < len; i++) {
            output = output + scoreObjects[i].toString(false, argObjects[i]);
        }
        return output;
    }

    async getTopData(osuApi, argObjects) {
        // limit = 1 即为最高分
        argObjects[0].limit = 1;
        let scoreObject = await this.getScoreObject(osuApi, argObjects[0]);
        return scoreObject.toString(true, argObjects[0]);
    }

}


module.exports = getScoreData;
const UserObject = require("./UserObject");


class getUserData {
    async getUserObject(osuApi, argObject) {
        try {
            const user = await osuApi.getUser(argObject); // user不是数组
            let usersObject = new UserObject(user);
            return usersObject;
        }
        catch (ex) {
            delete argObject.k; // 不显示token
            if (ex.message === "Not found") return "找不到玩家 " + JSON.stringify(argObject);
            return "从Osu!api获取数据出错\n" + ex.message;
        }
    }

    async getData(osuApi, argObjects) {
        let userObject = await this.getUserObject(osuApi, argObjects[0]);
        return userObject.toString();
    }

}

module.exports = getUserData;
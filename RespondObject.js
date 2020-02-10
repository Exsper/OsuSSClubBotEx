const UserInfo = require("./user/UserInfo");
const CommandObject = require("./command/CommandObject");

class RespondObject {
    constructor(meta, nedb, osuApi, msg) {
        this.meta = meta;
        this.nedb = nedb;
        this.osuApi = osuApi;
        this.msg = msg;
    }

    async sendReply() {
        let userInfo = new UserInfo(this.meta);
        let userOsuInfo = await userInfo.getUserOsuInfo(this.meta.userId, this.nedb);
        let commandObject = new CommandObject(this.meta, this.msg);
        let reply = await commandObject.execute(this.osuApi, userOsuInfo, this.nedb);
        if (reply !== "") this.meta.$send(reply);
    };
}

module.exports = RespondObject;

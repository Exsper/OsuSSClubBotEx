const UserInfo = require("./user/UserInfo");
const CommandObject = require("./command/CommandObject");

class RespondObject {
    constructor(meta, osuApi, msg) {
        this.meta = meta;
        this.osuApi = osuApi;
        this.msg = msg;
    }

    async sendReply() {
        let userInfo = new UserInfo(this.meta);
        let userOsuInfo = await userInfo.getUserOsuInfo();
        let commandObject = new CommandObject(this.msg);
        let reply = await commandObject.execute(this.osuApi, userOsuInfo);
        if (reply !== "") this.meta.$send(reply);
    };
}

module.exports = RespondObject;

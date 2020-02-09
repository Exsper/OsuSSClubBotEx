class UserInfo {
    constructor(meta) {
        this.userId = meta.userId;
    }

    async dbGetUserOsuId() {
        // TODO
        return -1;
    }
    async dbGetUserOsuName() {
        // TODO
        return "";
    }
    async dbGetUserDefaultMode() {
        // TODO
        return "0";
    }

    async getUserOsuInfo() {
        /**
        * @var userOsuInfo
        * @property {string} osuName osu用户名
        * @property {string} osuId osuId
        * @property {string} defaultMode 默认游戏模式（0:std 1:taiko 2:ctb 3:mania）
        */
        let userOsuInfo = {};
        userOsuInfo.osuId = await this.dbGetUserOsuId();
        userOsuInfo.osuName = await this.dbGetUserOsuName();
        userOsuInfo.defaultMode = await this.dbGetUserDefaultMode();
        return new Promise((resolve) => {
            resolve(userOsuInfo);
        });
    }

}

module.exports = UserInfo;
const ApiOptions = require("./api/apiOptions");


class Command {
    constructor(commandType, commandInfo) {
        this.commandType = commandType;
        this.commandInfo = commandInfo;
        this.isCommand = true;
        this.isError = false;
        this.errorMessage = "";
    }

    /*
    getCommandType() {
        return this.commandType;
    }
    getCommandInfo() {
        return this.commandInfo;
    }
    isCommand() {
        return this.isCommand;
    }
    isError() {
        return this.isError;
    }
    */
    getErrorMessage() {
        return this.errorMessage;
    }

    getHelpContent() {
        let help = "";
        help = help + this.commandInfo.info + "\n";
        help = help + "指令：" + this.commandInfo.command.join("/") + "\n";
        help = help + "参数：" + this.commandInfo.argsInfo + "\n";
        help = help + this.commandInfo.note;
        return help;
    }

    setNotCommand() {
        this.isCommand = false;
        return this;
    }
    setError(errorMessage) {
        this.isError = true;
        this.errorMessage = errorMessage;
        return this;
    }

    getApiOptions(argsString, userOsuInfo) {
        const mr = this.commandInfo.reg.exec(argsString);
        if (mr === null) {
            setError("参数格式解析错误：" + argsString);
            return new ApiOptions();
        }
        let args = {};
        for (let i = 1; i < mr.length; ++i) {
            if (mr[i] === undefined) {
                if (!this.commandInfo.argsFromUserInfo[i]) continue;
                let key = this.commandInfo.args[i];
                let value = "";
                if (userOsuInfo.osuId > 0 && this.commandInfo.args[i] === "u") value = userOsuInfo.osuId;
                else if (userOsuInfo.defaultMode && this.commandInfo.args[i] === "m") value = userOsuInfo.defaultMode;
                else continue;
                Object.assign(args, { [key]: value });
            }
            else {
                let key = this.commandInfo.args[i];
                Object.assign(args, { [key]: mr[i].trim() });
            }
        }
        let user = [args.u, args.u2];
        user = user.filter(item => item); // 去除空值
        return new ApiOptions(args.b, user, args.limit, args.mods, args.m);
    }

}

module.exports = Command;
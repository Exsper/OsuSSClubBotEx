const CommandsInfo = require("./CommandsInfo");
const Command = require("./Command");
const RunCommand = require("./RunCommand");

class CommandObject {
    constructor(msg) {
        this.msg = msg.trim();
    }

    getCommandPrefixIndex(commandsInfo) {
        return this.msg.indexOf(commandsInfo.prefix);
    }

    getCommandBase(commandsInfo) {
        return this.msg.split(" ")[0].trim().substring(commandsInfo.prefix.length);
    }

    getCommandArgsString(commandString) {
        const startIndex = this.msg.indexOf(commandString) + commandString.length;
        if (startIndex >= this.msg.length) return null;
        else {
            const argsString = this.msg.substring(startIndex).trim();
            if (argsString === "") return null;
            else return argsString;
        }
    }

    getCommandInfoFromApi(commandsInfo, commandString) {
        const apis = commandsInfo.apiCommands;
        for (let api of apis) {
            if (api.command.includes(commandString)) {
                return new Command(api.type, api);
            }
        }
        return new Command().setNotCommand();
    }



    async execute(osuApi, userOsuInfo) {
        const commandsInfo = new CommandsInfo()
        const prefixIndex = this.getCommandPrefixIndex(commandsInfo);
        if (prefixIndex !== 0) return "";
        const commandString = this.getCommandBase(commandsInfo);
        const argsString = this.getCommandArgsString(commandString);
        // 帮助
        if (commandString === "help") {
            let command = this.getCommandInfoFromApi(commandsInfo, argsString);
            if (!argsString) return "输入 "+commandsInfo.prefix+"help + 具体指令 来查看指令功能";
            if (!command.isCommand) return "未实现的指令：" + argsString;
            else return command.getHelpContent();
        }
        // 查找指令
        let command = this.getCommandInfoFromApi(commandsInfo, commandString);
        if (!command.isCommand) return "";
        let apiOptions = command.getApiOptions(argsString, userOsuInfo);
        if (command.isError) return command.getErrorMessage();
        let argObjects = apiOptions.getArgObjects();
        return await new RunCommand().run(osuApi, command, argObjects);
    }

}


module.exports = CommandObject;
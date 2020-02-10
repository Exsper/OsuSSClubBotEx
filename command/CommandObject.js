const CommandsInfo = require("./CommandsInfo");
const Command = require("./Command");
const RunApiCommand = require("./RunApiCommand");
const RunBotCommand = require("./RunBotCommand");

class CommandObject {
    constructor(meta, msg) {
        this.meta = meta;
        this.msg = msg.trim();
        this.apiClass = "api";
        this.botClass = "bot";
    }

    /*
    getCommandPrefixIndex(commandsInfo) {
        return this.msg.indexOf(commandsInfo.prefix);
    }

    getCommandBase(commandsInfo) {
        return this.msg.split(" ")[0].trim().substring(commandsInfo.prefix.length);
    }
    */

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
                return new Command(this.apiClass, api.type, api);
            }
        }
        return new Command().setNotCommand();
    }

    getCommandInfoFromBot(commandsInfo, commandString) {
        const botComs = commandsInfo.botCommands;
        for (let c of botComs) {
            if (c.command.includes(commandString)) {
                return new Command(this.botClass, c.type, c);
            }
        }
        return new Command().setNotCommand();
    }



    async execute(osuApi, userOsuInfo, nedb) {
        const commandsInfo = new CommandsInfo()
        /*
        const prefixIndex = this.getCommandPrefixIndex(commandsInfo);
        if (prefixIndex !== 0) return "";
        */
        const msgPrefix = this.msg.substring(0,1);
        if ((msgPrefix !== commandsInfo.prefix) && (msgPrefix !== commandsInfo.prefix2)) return "";
        //const commandString = this.getCommandBase(commandsInfo);
        const commandString = this.msg.split(" ")[0].trim().substring(1);
        const argsString = this.getCommandArgsString(commandString);
        // 帮助
        if (commandString === "help") {
            if (!argsString) return "输入 " + commandsInfo.prefix + "help + 具体指令 来查看指令功能";
            let command = this.getCommandInfoFromApi(commandsInfo, argsString);
            if (!command.isCommand) command = this.getCommandInfoFromBot(commandsInfo, argsString);
            if (!command.isCommand) return "未实现的指令：" + argsString;
            else return command.getHelpContent();
        }
        // 查找指令
        let command = this.getCommandInfoFromApi(commandsInfo, commandString);
        if (!command.isCommand) {
            command = this.getCommandInfoFromBot(commandsInfo, commandString);
            if (!command.isCommand) return "";
            else {
                let argObjects = command.getBotOptions(argsString);
                if (command.isError) return command.getErrorMessage();
                return await new RunBotCommand().run(this.meta, osuApi, command, argObjects, nedb);
            }
        }
        else {
            let apiOptions = command.getApiOptions(argsString, userOsuInfo);
            if (command.isError) return command.getErrorMessage();
            let argObjects = apiOptions.getArgObjects();
            return await new RunApiCommand().run(osuApi, command, argObjects);
        }
    }
}


module.exports = CommandObject;
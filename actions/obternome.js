import { select, input, confirm } from "@inquirer/prompts"
import chalk from "chalk"
// import fs from "fs/promises"
// import path from "path"
// import { fileURLToPath } from "url"

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// const caminho = path.join(__dirname, '../historico.json')

export async function obterNomeDoJogador() {
    let historico = []

    try {
        const conteudo = await fetch("https://nodeproject-wizi.onrender.com/")
            historico = await conteudo.json()
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.log(chalk.red(`Erro ao ler o histórico: ${err.message}`))
        } else {
            console.log(chalk.gray("Nenhum histórico encontrado. Um novo será criado."))
        }
    }

    let nome

    if (historico.length > 0) {
        const escolha = await select({
            message: chalk.cyan("Selecione seu nome ou crie um novo:"),
            choices: [
                ...historico.map(j => ({
                    name: `${j.player} ${chalk.gray(`(recorde: ${j.score} tentativa${j.score > 1 ? 's' : ''})`)}`,
                    value: j.player
                })),
                { name: chalk.gray("➕ Usar um novo nome"), value: "__novo" }
            ]
        })

        if (escolha === "__novo") {
            nome = await input({ message: chalk.yellow("Digite seu novo nome:") })

            const confirmar = await confirm({
                message: chalk.yellow(`Deseja mesmo criar um novo registro para "${nome}"?`)
            })

            if (!confirmar) {
                console.log(chalk.gray("Registro cancelado."))
                return null
            }
        } else {
            nome = escolha
        }
    } else {
        nome = await input({ message: chalk.yellow("Digite seu nome:") })
    }

    return nome
}

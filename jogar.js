import {number } from "@inquirer/prompts"
import chalk from "chalk"
import {obterNomeDoJogador} from './actions/obternome.js'
import {salvarSeForRecorde} from './actions/salvar.js'

export async function jogar() {
    try {
        const nome = await obterNomeDoJogador()
        if (!nome) return

        const numeroAleatorio = Math.floor(Math.random() * 101)
        let chances = 7
        let tentativasFeitas = 0
        let numerosJaTentados = []

        while (chances > 0) {
            let palpite = await number({ message: chalk.bold.yellow("Digite um número de 0 a 100:") })  

            // Verifica se o número já foi tentado
            if (numerosJaTentados.includes(palpite)) {
                console.log(chalk.red("⚠️  Você já tentou esse número! Tente outro."))
                console.log(chalk.gray(`Números já tentados: ${numerosJaTentados.join(', ')}`))
                continue // Volta para o início do loop sem reduzir tentativas
            }

            // Adiciona o número à lista de tentativas
            numerosJaTentados.push(palpite)

            if (palpite === numeroAleatorio) {
                console.log(chalk.bold.green(`\n🎉 Parabéns, você acertou! com ${tentativasFeitas} tentativas`))
                await salvarSeForRecorde(nome, tentativasFeitas)
                break
            } else if (palpite > numeroAleatorio) {
                console.log(chalk.blue("Muito alto,") + chalk.rgb(170, 32, 197)("tente um número") + chalk.rgb(0, 185, 231) (" menor"))
            } else if (palpite < numeroAleatorio) {
                console.log(chalk.blue("Muito baixo,") + chalk.rgb(170, 32, 197)("tente um número") + chalk.rgb(0, 185, 231) (" maior"))
            } else {
                chances++
                console.log("Entrada não é um número válido")
            }

            chances--
            tentativasFeitas++
        }

        if (chances === 0) {

            console.log(chalk.red(`Tentativas acabaram, o número era ${numeroAleatorio}`))
        }
        

    } catch(error) {
        console.log('Programa encerrado pelo usuário ')
        console.log(error)
    }

}


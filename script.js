class ApiWorker {
    constructor() {}

    static getFullBrain(netTrain = null, randomColor = null) {
        const http = new XMLHttpRequest()
        http.open('GET', 'https://frozen-basin-04994.herokuapp.com/api/brain')
        http.onloadend = () => {
            data = JSON.parse(http.response).map((c) => ({ input: c.input, output: c.output }))
            if (netTrain != null) {
                net.train(data)
            }
            if (randomColor != null) {
                setRandomColor()
            }
        }
        http.send()
    }

    static addNewBrainItem(value) {
        const http = new XMLHttpRequest()
        http.open('POST', 'https://frozen-basin-04994.herokuapp.com/api/brain')
        http.setRequestHeader('content-type', 'application/json')
        http.onloadend = () => {
            this.getFullBrain()
            setRandomColor()
        }
        http.send(JSON.stringify({
            input: color,
            output: [value]
        }))
    }
}

const net = new brain.NeuralNetwork()

let data;

const colorEl = document.querySelector('#bg-color-area')
const guessEl = document.querySelector('#AI-text')
const whiteButton = document.querySelector('#white-btn')
const blackButton = document.querySelector('#black-btn')
const bgControlBtn = document.querySelector('#bg-control-btn')
const trainBtn = document.querySelector('#train-btn')

let color
ApiWorker.getFullBrain('netTrain', 'randomColor')

trainBtn.addEventListener('click', () => {
    whiteButton.style.display = 'unset'
    blackButton.style.display = 'unset'
    trainBtn.style.display = 'none'
})

whiteButton.addEventListener('click', () => {
    ApiWorker.addNewBrainItem(1)
})

blackButton.addEventListener('click', () => {
    ApiWorker.addNewBrainItem(0)
})

bgControlBtn.addEventListener('click', () => {
    setRandomColor()
})

function setRandomColor() {
    color = {
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
    }
    const guess = net.run(color)[0]
    guessEl.style.color = guess > .5 ? '#FFF' : '#000'
    colorEl.style.backgroundColor =
        `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`
}
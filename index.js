loadGame()
polyfillKey()


/**
 * Função de game over.
 */
function gameOver() {
  /**
   * Seta o status do jogo como falso
   */
  gameOn = false
  document.getAnimations().forEach(function (anim) {
    anim.pause()
    return []
  })

  document.getElementById('game-over').classList.add('indeed')
}


function loadGame() {
  /**
   * Cria o botão de start game.
   */
  const button = document.createElement('button')

  /**
   * Seta o conteúdo do botão.
   */
  button.textContent = 'Start Game'

  /**
   * Pega a posição do menu.
   */
  const menu = document.getElementById('menu')

  /**
   * Coloca a o botão de start game de baixo do menu.
   */
  menu.appendChild(button)

  /**
   * Cria as regras.
   */
  const rules = document.createElement('p')

  /**
   * Seta o conteúdo da regra.
   */
  rules.textContent =
    'Ao cair as letras... pressione a tecla correta para salva-las antes de serem queimadas no fogo ardente do inferno!'

  /**
   * Coloca a regra debaixo do menu.
   */
  menu.appendChild(rules)

  /**
   * Evento de click no botão de start game.
   */
  button.addEventListener('click', function startIt(e) {
    /**
     * Remove todo o conteúdo do menu.
     */
    menu.textContent = ''

    /**
     * Chama a função que irá executar o jogo.
     */
    playGame()
  })
}

/**
 * Função que será responsável por gerar todo o jogo.
 */
function playGame(replay) {
  /**
   * Letras que serão randomizadas para caírem ao inferno.
   */
  const lettersToFall = [...'abcdefghijklmnopqrstuvwxyz']

  /**
   * Letras com animações.
   */
  let animationsLetters = {
    a: [],
    b: [],
    c: [],
    d: [],
    e: [],
    f: [],
    g: [],
    h: [],
    i: [],
    j: [],
    k: [],
    l: [],
    m: [],
    n: [],
    o: [],
    p: [],
    q: [],
    r: [],
    s: [],
    t: [],
    u: [],
    v: [],
    w: [],
    x: [],
    y: [],
    z: []
  }

  /**
   * Seta o status do jogo.
   */
  let gameOn = true

  /**
   * Seta o intervalo entre o inicio de cada letra.
   */
  let timeOffset = 1000

  /**
   * Tempo inicial que irá levar para a letra chegar ao inferno, aumentará conforme for acertando as letras.
   */
  const timeToLetterArriveHell = 10000

  /**
   * Pega o menu.
   */
  const menu = document.getElementById('menu')

  /**
   *  Pega o header da página.
   */
  let header = document.querySelector('header')

  /**
   * Pega o score.
   */
  let scoreElement = document.getElementById('score')

  /**
   * Garante que o score seja um número.
   */
  let score = parseFloat(scoreElement.textContent)

  /**
   * Valor inicial da queda.
   */
  let fall = 1

  /**
   * Valor que será acrescido por letra para ir incrementando a velocidade da queda.
   */
  const fallInterval = 0.15

  /**
   * Inicia se houve erro, por padrão inicia sem erro.
   */
  let misses = 0

  /**
   * Função responsável por criar e gerenciar as animações.
   */
  function create() {
    /**
     * Randomiza um indice aleatório dentro do array para gerar a letra.
     */
    const index = Math.floor(Math.random() * lettersToFall.length)

    /**
     * Randomiza a posição que será gerada a letra.
     */
    const positionToGenerateLetter = Math.random() * 85 + 'vw'

    /**
     * Cria um elemento div.
     */
    const container = document.createElement('div')

    /**
     * Cria um elemento span para por a letra randomizada.
     */
    const span = document.createElement('span')

    /**
     * Cria um elemento bold para por dentro do span.
     */
    const bold = document.createElement('b')

    /**
     * Seta o conteúdo com a letra randomizada.
     */
    bold.textContent = lettersToFall[index]

    /**
     * Coloca o bold dentro do span.
     */
    span.appendChild(bold)

    /**
     * Coloca o span dentro do container.
     */
    container.appendChild(span)

    /**
     * Coloca o container dentro do menu.
     */
    menu.appendChild(container)

    /**
     * Cria a animação da letra.
     */
    const animation = container.animate(
      [
        { transform: 'translate3d(' + positionToGenerateLetter + ',-2.5vh,0)' },
        { transform: 'translate3d(' + positionToGenerateLetter + ',82.5vh,0)' }
      ],
      {
        duration: timeToLetterArriveHell,
        easing: 'linear',
        fill: 'both'
      }
    )

    /**
     * Seta a animação.
     */
    animationsLetters[lettersToFall[index]].splice(0, 0, {
      animation,
      element: container
    })

    /**
     * Incrementa a velocidade de queda.
     */
    fall = fall + fallInterval
    animation.playbackRate = fall

    /**
     * Se uma animação chegar no final irá contabilizar como erro e assim irá chamar a função de game over.
     */
    animation.onfinish = function (e) {
      gameOver()
    }
  }

  function onPress(e) {
    var char = e.key
    if (char.length === 1) {
      char = char.toLowerCase()
      if (animationsLetters[char] && animationsLetters[char].length) {
        var popped = animationsLetters[char].pop()
        popped.animation.pause()
        var target = popped.element.querySelector('b')
        var degs = [
          Math.random() * 1000 - 500,
          Math.random() * 1000 - 500,
          Math.random() * 2000 - 1000
        ]
        target.animate(
          [
            {
              transform: 'scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
              opacity: 1
            },
            {
              transform:
                'scale(0) rotateX(' +
                degs[0] +
                'deg) rotateY(' +
                degs[1] +
                'deg) rotateZ(' +
                degs[2] +
                'deg)',
              opacity: 0
            }
          ],
          {
            duration: Math.random() * 500 + 850,
            easing: 'ease-out',
            fill: 'both'
          }
        )
        addScore()
        header.textContent += char
      }
    }
  }
  function addScore() {
    score++
    scoreElement.textContent = score
  }

  document.body.addEventListener('keypress', onPress)

  function setupNextLetter() {
    if (gameOn) {
      create()
      setTimeout(function () {
        setupNextLetter()
      }, timeOffset)
    }
  }
  setupNextLetter()
}

function polyfillKey() {
  if (!('KeyboardEvent' in window) || 'key' in KeyboardEvent.prototype) {
    return false
  }

  console.log('polyfilling KeyboardEvent.prototype.key')
  var keys = {}
  var letter = ''
  for (var i = 65; i < 91; ++i) {
    letter = String.fromCharCode(i)
    keys[i] = letter.toUpperCase()
  }
  for (var i = 97; i < 123; ++i) {
    letter = String.fromCharCode(i)
    keys[i] = letter.toLowerCase()
  }
  var proto = {
    get: function (x) {
      var key = keys[this.which || this.keyCode]
      console.log(key)
      return key
    }
  }
  Object.defineProperty(KeyboardEvent.prototype, 'key', proto)
}
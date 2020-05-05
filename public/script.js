document.addEventListener('DOMContentLoaded', ()=>{

  const socket = io.connect()

  const pencil = {
    active: false,
    move: false,
    posCurrent: {x: 0, y: 0},
    posAfter: null
  }

  const canvas = document.querySelector('#board')
  canvas.width = 1000
  canvas.height = 600

  const context = canvas.getContext('2d')
  context.lineWidth = 3
  context.strokeStyle = 'teal'

  const drawLine = (line) => {
    if(line){
      context.beginPath()
      context.moveTo(line.posAfter.x, line.posAfter.y)
      context.lineTo(line.posCurrent.x, line.posCurrent.y)
      context.stroke()
    }
    else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  canvas.onmousedown = () => { pencil.active = true }
  canvas.onmouseup = () => { pencil.active = false }
  canvas.onmousemove = event => { 
    pencil.posCurrent.x = event.clientX
    pencil.posCurrent.y = event.clientY
    pencil.move = true
  }

  socket.on('draw', line => {
    drawLine(line)
  })

  const cycle = () => {
    if (pencil.active && pencil.move && pencil.posAfter){
      socket.emit('draw', {posCurrent: pencil.posCurrent, posAfter: pencil.posAfter})
      // drawLine({posCurrent: pencil.posCurrent, posAfter: pencil.posAfter})
      pencil.move = false
    }
    pencil.posAfter = { x: pencil.posCurrent.x, y: pencil.posCurrent.y}

    setTimeout(cycle, 10)
  }

  cycle()

  document.body.addEventListener('keyup', e => {
    if(e.keyCode === 32){
      socket.emit('clear')
    }
  })

})
const audio = document.getElementById('audio')
const bassSlider = document.getElementById('bass')
const midSlider = document.getElementById('mid')
const trebleSlider = document.getElementById('treble')
const volumeBoost = document.getElementById('volume-boost')
const fileInput = document.getElementById('fileInput')
const dropArea = document.getElementById('dropArea')

const audioCtx = new AudioContext()
const source = audioCtx.createMediaElementSource(audio)

const gainNode = audioCtx.createGain()
source.connect(gainNode)
gainNode.connect(audioCtx.destination)

const bass = audioCtx.createBiquadFilter()
bass.type = 'lowshelf'
bass.frequency.setValueAtTime(200, audioCtx.currentTime)

const mid = audioCtx.createBiquadFilter()
mid.type = 'peaking'
mid.frequency.setValueAtTime(1000, audioCtx.currentTime)

const treble = audioCtx.createBiquadFilter()
treble.type = 'highshelf'
treble.frequency.setValueAtTime(3000, audioCtx.currentTime)

source
  .connect(gainNode)
  .connect(bass)
  .connect(mid)
  .connect(treble)
  .connect(audioCtx.destination)

const loopCheckbox = document.getElementById('loop')
loopCheckbox.checked = audio.loop

function updateGain(filter, value) {
  filter.gain.setValueAtTime(value, audioCtx.currentTime)
}

/* EVENTS */

bassSlider.addEventListener('input', (e) => {
  updateGain(bass, e.target.value)
})

midSlider.addEventListener('input', (e) => {
  updateGain(mid, e.target.value)
})

trebleSlider.addEventListener('input', (e) => {
  updateGain(treble, e.target.value)
})

audio.addEventListener('play', () => {
  audioCtx.resume()
})

volumeBoost.addEventListener('input', (e) => {
  gainNode.gain.setValueAtTime(e.target.value, audioCtx.currentTime)
})

loopCheckbox.addEventListener('change', () => {
  audio.loop = loopCheckbox.checked
})

const play = file => {
  if (file) {
    audio.src = URL.createObjectURL(file)
    audio.play()
  }
}

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0]
  play(file)
})


dropArea.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropArea.style.backgroundColor = '#f0f0f0'
})

dropArea.addEventListener('dragleave', () => {
    dropArea.style.backgroundColor = 'transparent'
})

dropArea.addEventListener('drop', (e) => {
    e.preventDefault()
    dropArea.style.backgroundColor = 'transparent'
    fileInput.files = e.dataTransfer.files
    const file = e.dataTransfer.files[0]
    play(file)
})

dropArea.addEventListener('click', () => fileInput.click())
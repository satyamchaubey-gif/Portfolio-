// Simple lightweight particle background + subtle parallax for emojis
(() => {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const PARTICLE_COUNT = Math.max(28, Math.floor((w * h) / 90000)); // scale with screen

  function rand(min, max){ return Math.random() * (max - min) + min; }

  class P {
    constructor(){
      this.reset();
    }
    reset(){
      this.x = rand(0, w);
      this.y = rand(0, h);
      this.r = rand(0.6, 2.6);
      this.vx = rand(-0.15, 0.15);
      this.vy = rand(0.1, 0.6);
      this.alpha = rand(0.06, 0.22);
      this.phase = rand(0, Math.PI * 2);
    }
    step(){
      this.x += this.vx;
      this.y += this.vy + Math.sin(this.phase) * 0.06;
      this.phase += 0.01;
      if (this.y > h + 20 || this.x < -60 || this.x > w + 60) this.reset();
    }
    draw(){
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function init(){
    particles.length = 0;
    for (let i=0;i<PARTICLE_COUNT;i++) particles.push(new P());
  }

  let raf;
  function loop(){
    ctx.clearRect(0,0,w,h);
    for (let p of particles) { p.step(); p.draw(); }
    raf = requestAnimationFrame(loop);
  }

  function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    init();
  }

  window.addEventListener('resize', resize);
  init(); loop();

  // Parallax on mouse for emojis
  const root = document.documentElement;
  let lastX = 0, lastY = 0;
  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth - 0.5);
    const ny = (e.clientY / window.innerHeight - 0.5);
    const left = document.querySelector('.emoji-left');
    const right = document.querySelector('.emoji-right');
    if (left) left.style.transform = `translate3d(${nx * -8}px, ${ny * -10}px, 0) rotate(${nx * 4}deg)`;
    if (right) right.style.transform = `translate3d(${nx * 10}px, ${ny * -8}px, 0) rotate(${nx * -4}deg)`;
  });

  // reduce CPU when tab not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else loop();
  });
})();

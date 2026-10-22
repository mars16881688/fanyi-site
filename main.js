(() => {
  'use strict';

  // 记住手动选择的语言，根目录不再按浏览器语言跳转。
  document.querySelectorAll('[data-lang]').forEach(link => {
    link.addEventListener('click', () => {
      try { localStorage.setItem('suiyi-lang', link.dataset.lang); } catch (e) { /* 存储不可用时忽略 */ }
    });
  });

  const demo = document.getElementById('demo');
  const output = document.getElementById('demo-text');
  const status = document.getElementById('demo-status');
  const toggle = document.getElementById('demo-toggle');
  if (!demo || !output || !status || !toggle) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fullText = output.textContent;
  const DURATION = 9000;
  // 文案由页面提供，便于多语言版本共用脚本
  const text = {
    status: demo.dataset.status || '示意动画',
    still: demo.dataset.static || '示意图',
    pause: demo.dataset.pause || '暂停',
    play: demo.dataset.play || '播放',
    pauseLabel: demo.dataset.pauseLabel || '暂停示意动画',
    playLabel: demo.dataset.playLabel || '播放示意动画'
  };
  const stageNames = (demo.dataset.stages || '选中前|选中英文句子|出现按钮|结合上下文翻译|完成').split('|');
  // [结束时间, 阶段说明]，阶段编号即数组下标
  const ENDS = [900, 2000, 3200, 5600, DURATION];
  const STAGES = ENDS.map((end, index) => [end, stageNames[index] || '']);
  const TYPE_START = 3400;
  const TYPE_END = 5200;

  let elapsed = 0;
  let last = null;
  let frame = null;
  let paused = false;

  const stageAt = time => STAGES.findIndex(([end]) => time < end);

  const render = time => {
    const stage = stageAt(time);
    demo.dataset.stage = String(stage);
    const ratio = Math.min(1, Math.max(0, (time - TYPE_START) / (TYPE_END - TYPE_START)));
    output.textContent = stage < 3 ? '' : fullText.slice(0, Math.ceil(fullText.length * ratio));
    status.textContent = `${text.status} · ${STAGES[stage][1]}`;
  };

  const tick = now => {
    if (last !== null) elapsed = (elapsed + now - last) % DURATION;
    last = now;
    render(elapsed);
    frame = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    last = null;
  };

  const start = () => {
    if (frame === null && !paused && !reduceMotion.matches && !document.hidden) {
      frame = requestAnimationFrame(tick);
    }
  };

  const sync = () => {
    stop();
    if (reduceMotion.matches) {
      // 减少动态效果：直接显示最终状态
      toggle.hidden = true;
      render(DURATION - 1);
      status.textContent = text.still;
      return;
    }
    toggle.hidden = false;
    toggle.textContent = paused ? text.play : text.pause;
    toggle.setAttribute('aria-label', paused ? text.playLabel : text.pauseLabel);
    render(elapsed);
    start();
  };

  toggle.addEventListener('click', () => {
    paused = !paused;
    sync();
  });
  reduceMotion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  sync();
})();

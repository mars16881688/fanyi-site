(() => {
  'use strict';

  const demo = document.getElementById('demo');
  const output = document.getElementById('demo-text');
  const status = document.getElementById('demo-status');
  const toggle = document.getElementById('demo-toggle');
  if (!demo || !output || !status || !toggle) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fullText = output.textContent;
  const DURATION = 9000;
  // [结束时间, 阶段说明]，阶段编号即数组下标
  const STAGES = [
    [900, '选中前'],
    [2000, '选中英文句子'],
    [3200, '出现 Fanyi 按钮'],
    [5600, '结合上下文翻译'],
    [DURATION, '完成']
  ];
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
    status.textContent = `示意动画 · ${STAGES[stage][1]}`;
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
      status.textContent = '示意图';
      return;
    }
    toggle.hidden = false;
    toggle.textContent = paused ? '播放' : '暂停';
    toggle.setAttribute('aria-label', paused ? '播放示意动画' : '暂停示意动画');
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

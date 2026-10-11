// HUD layout and status UI.

export default function HUD() {
  return (
    <div className="hud">
      <div className="hud__top">
        <div>
          <span className="hud__label">SYSTEM</span>

          <strong className="hud__status">ONLINE</strong>
        </div>

        <div className="hud__prototype">FLIGHT PROTOTYPE // 001</div>
      </div>

      <div className="hud__bottom">
        <div className="controls">
          <span>
            <kbd>W</kbd>
            THRUST
          </span>

          <span>
            <kbd>S</kbd>
            REVERSE
          </span>

          <span>
            <kbd>A</kbd>
            LEFT
          </span>

          <span>
            <kbd>D</kbd>
            RIGHT
          </span>

          <span>
            <kbd>SPACE</kbd>
            UP
          </span>

          <span>
            <kbd>CTRL</kbd>
            DOWN
          </span>

          <span>
            <kbd>SHIFT</kbd>
            BOOST
          </span>
        </div>
      </div>
    </div>
  );
}
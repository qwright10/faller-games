import React from 'react';
import GameButton from './components/game-button';
import Toggle from './components/toggle';
import sites from './sites';
import "./styles.css";

const dave = 'https://i.pinimg.com/originals/e0/e8/7e/e0e87e8cd5d771dd8923077bb5025e0b.jpg';

interface AppState {
  dark: boolean;
  game: number;
}

function findGame(this: App) {
  if (window.location.hash !== '0') {
    for (let i = 0; i < sites.length; i++) {
      const site = sites[i]!;
      const shortName = site.name.toLowerCase().replace(/ +/g, '-');
      const hash = window.location.hash.slice(1, window.location.hash.length);
      if (shortName === hash) {
        this.state = { ...this.state, game: i };
        break;
      }
    }
  }
}

export default class App extends React.Component<{}, AppState> {
  public state = { 
    dark: true,
    game: 0,
  };
  private iframe = React.createRef<HTMLIFrameElement>();

  public constructor(props: {}) {
    super(props);

    findGame.call(this);    

    window.addEventListener('popstate', findGame.bind(this));
  }

  public render() {
    const { dark, game } = this.state;
    const { name, src } = sites[game]!;

    const classList = document.body.classList;
    if (dark) classList.add('dark');
    else classList.remove('dark');

    return (
      <React.Fragment>
        <header>
          <h1>
            <span id="what-the-faller">what.the.faller</span>
            <span id="games">.games</span>
          </h1>
          <p id="memoriam">In memory of <a href={dave}>David Lawrence Ramsey III</a></p>
        </header>
        <section id="games-list">
          <ul>
            {sites.map(({ name }, i) => (
              <li key={name}>
                <GameButton
                  label={name}
                  key={name}
                  active={game === i} 
                  onClick={(shortName) => {
                    this.setState({ game: i });
                    window.history.pushState(null, name, `#${shortName}`);
                    console.log('Set game to:', sites[i]!.name);
                  }}/>
              </li>
            ))}
          </ul>
        </section>
        <main>
          <div id="game-bar">
            <h2>{name}</h2>
            <GameButton
              label="Go Fullscreen"
              activeOnHover
              onClick={() => {
                if (this.iframe.current?.requestFullscreen) {
                  this.iframe.current.requestFullscreen();
                } else {
                  void alert('Unable to enter fullscreen, try again later');
                }
              }}/>
            <Toggle app={this} />
          </div>
          <iframe
            src={src}
            title={name}
            ref={this.iframe}
            frameBorder="0"
            loading="lazy"

            allow="fullscreen *; camera 'none'; microphone 'none'"
          />
        </main>
        <footer>
          <p>what.the.faller.fun is not affiliated, associated, authorized, endorsed by, or in any way officially connected with PCHS or its employees.</p>
        </footer>
      </React.Fragment>
    );
  }
}

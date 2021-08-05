import React from 'react';
import GameButton from './components/game-button';
import SearchBar from './components/search-bar';
import Toggle from './components/toggle';
import defaultSites from './sites';
import "./styles.css";

import create from 'zustand';

export const useStore = create<{
  [K in keyof AppState]: AppState[K];
}>(set => ({
  dark: true,
  game: 0,
  sites: defaultSites,

  setAppearance: (dark: boolean) => set({ dark }),

  setGame: (game: number) => set({ game }),

  filterSites: (term: string) => set(state => 
    ({
      sites: defaultSites.filter((s, i) => {
        return s.name.includes(term) || state.game === i;
      })
    })),
  resetSites: () => set({ sites: defaultSites }),
}));

const gh = require('./gh.png');

const dave = 'https://i.pinimg.com/originals/e0/e8/7e/e0e87e8cd5d771dd8923077bb5025e0b.jpg';

interface AppState {
  dark: boolean;
  game: number;
  sites: IGame[];
}

interface IGame {
  name: string;
  src: string;
}

function findGame(this: App) {
  if (window.location.hash !== '0') {
    for (let i = 0; i < defaultSites.length; i++) {
      const site = defaultSites[i]!;
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
    sites: defaultSites,
  };

  private unsub?: () => void;
  private iframe = React.createRef<HTMLIFrameElement>();

  public constructor(props: {}) {
    super(props);

    findGame.call(this);    

    window.addEventListener('popstate', findGame.bind(this));
  }

  public componentDidMount() {
    this.unsub = useStore.subscribe(
      ({ dark, game, sites }) => {
        this.setState({ dark, game, sites });
        console.log('Updated App.tsx state', { dark, game, sites });
      }, state => ({
        dark: state.dark,
        game: state.game,
        sites: state.sites,
      }),
    );

    const { dark, game, sites } = useStore.getState();
    this.setState({ dark, game, sites });
  }

  public componentWillUnmount() {
    this.unsub?.();
  }

  public render() {
    const { dark, game, sites } = this.state;
    const { name, src } = defaultSites[game]!;

    const classList = document.body.classList;
    if (dark) {
      classList.add('dark');
      document.body.parentElement!.style.backgroundColor = '#222';
      document.body.style.backgroundColor = '#222';
    } else {
      classList.remove('dark');
      document.body.parentElement!.style.backgroundColor = 'whitesmoke';
      document.body.style.backgroundColor = 'whitesmoke';
    }

    return (
      <React.Fragment>
        <header>
          <h1>
            <span id="what-the-faller">what.the.faller</span>
            <span id="games">.games</span>
          </h1>
          <div id="subline">
            <p id="memoriam">In memory of <a href={dave}>David Lawrence Ramsey III</a></p>
          </div>
        </header>
        <section id="games-list">
          <ul>
            <SearchBar />
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
            <Toggle />
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
          <a href="https://github.com/qwright10/faller-games"><img src={gh} alt="github logo" /></a>
          <p>what.the.faller.fun is not affiliated, associated, authorized, endorsed by, or in any way officially connected with PCHS or its employees.</p>
        </footer>
      </React.Fragment>
    );
  }
}

import React from 'react';
import './toggle.css';

interface ToggleState {
  value: boolean;
}

interface ToggleProps {
  app: { setState({ dark }: { dark: boolean }): void; }
}

export default class Toggle extends React.Component<ToggleProps, ToggleState> {
  public readonly state = { value: false };

  public render() {
    const { value } = this.state;

    return (
      <div
        className={`toggle${value?' active':''}`}
        onClick={() => {
          const { value } = this.state;
          this.setState({ value: !value });
          this.props.app.setState({ dark: value });
        }}
      >
      </div>
    );
  }
}
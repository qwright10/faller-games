import React from 'react';
import './game-button.css';

export default ({ active = false, activeOnHover = false, label, onClick }:
  { active?: boolean; activeOnHover?: boolean; label: string, onClick(shortName: string, e: React.MouseEvent<HTMLButtonElement>): void }) => {
  const shortName = label.toLocaleLowerCase().replace(/ +/g, '-').replace(/\./g, '_');
  return (<button
    className={`game-button${active?' active':''}${activeOnHover?' aoh':''}`}
    id={shortName}
    onClick={onClick.bind(this, shortName)}
  >{label}</button>);
};
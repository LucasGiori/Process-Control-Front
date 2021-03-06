import React, { useState } from 'react';

import Select from 'react-select';
import { colourOptions } from '../data';

export default function SelectCustom() {
  const [ariaFocusMessage, setAriaFocusMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const style = {
    blockquote: {
      fontStyle: 'italic',
      fontSize: '.75rem',
      margin: '1rem 0',
    },
    label: {
      fontSize: '.75rem',
      fontWeight: 'bold',
      lineHeight: 2,
    },
  };

  const onFocus = ({ focused, isDisabled }) => {
    const msg = `You are currently focused on option ${focused.label}${
      isDisabled ? ', disabled' : ''
    }`;
    setAriaFocusMessage(msg);
    return msg;
  };

  const onMenuOpen = () => setIsMenuOpen(true);
  const onMenuClose = () => setIsMenuOpen(false);

  return (
    <form>
      <label style={style.label} id="aria-label" htmlFor="aria-example-input">
        Select a color
      </label>

      {!!ariaFocusMessage && !!isMenuOpen && (
        <blockquote style={style.blockquote}>"{ariaFocusMessage}"</blockquote>
      )}

      <Select
        aria-labelledby="aria-label"
        ariaLiveMessages={{
          onFocus,
        }}
        inputId="aria-example-input"
        name="aria-live-color"
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
        options={colourOptions}
      />
    </form>
  );
}

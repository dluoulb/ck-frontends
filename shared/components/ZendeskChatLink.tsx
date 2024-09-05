import React from 'react';
import classNames from 'classnames';

export default function ZendeskChatLink({
  msg = 'Connect with live chat',
  className = '',
  onClick = () => {},
}) {
  const zdAvailable =
    (window.zEACLoaded || false) &&
    process.env.NEXT_PUBLIC_ENV !== 'development';

  const openChat = () => {
    if (zdAvailable) {
      window.zE('messenger', 'open');
    } else {
      console.warn('The chat widget is not fully loaded');
    }
  };

  return (
    <span
      onClick={() => {
        openChat();
        onClick();
      }}
      className={classNames('cursor-pointer', className)}
    >
      {msg}
    </span>
  );
}

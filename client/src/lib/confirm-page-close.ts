const eventHandler = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  return (e.returnValue = '');
};

export const confirmPageClose = () => {
  console.log('blocking page closes');
  window.addEventListener('beforeunload', eventHandler, { capture: true });
};

export const allowPageClose = () => {
  console.log('unblocking page closes');
  window.removeEventListener('beforeunload', eventHandler, { capture: true });
};

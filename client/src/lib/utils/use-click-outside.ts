export function clickOutside(element: any, callbackFunction: Function) {
  function onClick(event: any) {
    if (!element.contains(event.target)) {
      callbackFunction();
    }
  }

  document.body.addEventListener('click', onClick);

  return {
    update(newCallbackFunction: Function) {
      callbackFunction = newCallbackFunction;
    },
    destroy() {
      document.body.removeEventListener('click', onClick);
    },
  };
}

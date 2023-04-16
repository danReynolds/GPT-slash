const commands = {
  "graph": "Implement a complete working code block of an IIFE that first injects d3 as a page script, waits for it to load with addEventListener, and then injects a second additional, separate page script that uses d3 to graph the above data and finally inserts the graph into the last DOM element matching selector 'main .group' (don't use last-child to do this)"
}

let $submitInput;
let graphCount = 0;

function submitCommand(command) {
  $submitInput.value = command;
  const submitKeyEvent = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13
  });
  $submitInput.dispatchEvent(submitKeyEvent);
}

function pollDivChanges(element, callback) {
  let previousValue = element.innerHTML;
  
  // Create a new MutationObserver
  const observer = new MutationObserver(() => {
    const currentValue = element.innerHTML;
    if (previousValue !== currentValue && element.querySelector('code.hljs')) {
      previousValue = currentValue;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        observer.disconnect();
        callback();
      }, 2000);
    }
  });

  // Configure and start the observer
  const config = { childList: true, subtree: true };
  observer.observe(element, config);

  // Create a timeout to stop the observer after 250ms of no changes
  let timeoutId = setTimeout(() => {
    observer.disconnect();
    callback();
  }, 2000);
}

function watchCommandResponse() {
  const $responseAreas = document.querySelectorAll('main .group');
  const $currentResponseArea = $responseAreas[$responseAreas.length -1];
  
  pollDivChanges($currentResponseArea, () => {
    const responseCode = $currentResponseArea.querySelector('code.hljs').innerText;
    eval(responseCode);
  });
}

function initialize() {
  $submitInput = document.querySelector('form textarea');

  if ($submitInput) {
    $submitInput.addEventListener('keydown', async function(event) {
      if (event.key === 'Enter') {
        const inputStr = $submitInput.value;

        if (inputStr.startsWith('/')) {
          const inputCommandStr = inputStr.slice(1);
          const command = commands[inputCommandStr];

          if (command) {
            event.stopPropagation();
            submitCommand(command);
            setTimeout(() => {
              watchCommandResponse();
            }, 1000);
          }
        }
      }
    }, { capture: true });
  }
}
  
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "initialize") {
      initialize();
  }
});
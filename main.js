Hooks.once("init", () => {
  game.settings.register("maps-in-cyberspace", "seen-chat-message", {
    scope: "world",
    restricted: true,
    type: Boolean,
    default: false,
  })
})
Hooks.once("ready", () => {
  if (!game.user.isGM) return

  if (game.settings.get("maps-in-cyberspace", "seen-chat-message")) return

  const hasPreviousMessage = game.messages.contents.some(msg => {
    return msg.speaker.alias === "CodaBool" && msg.title === "Maps in Cyberspace";
  })
  if (hasPreviousMessage || localStorage.getItem("maps-in-cyberspace-skip")) {
    // console.log("DEBUG: storage =", localStorage.getItem("maps-in-cyberspace-skip"), " | previous msg =", hasPreviousMessage)
    // might not be necessary but just in case leave some time for the HTML to render
    setTimeout(() => {
      addListeners()
    }, 1_000)
    return
  }

  ChatMessage.create({
    speaker: {
      alias: "CodaBool",
    },
    title: "Maps in Cyberspace",
    whisper: [game.user.id],
    content: `
    <div id="maps-in-cyberspace-chat" style="position: relative; overflow: hidden;">
      <div class="confetti">
        <div class="maps-in-cyberspace-confetti-piece" style="left: 3%; background:#f44336; animation-duration:5s; top:-20vh; --start-rot:20deg; --end-rot:380deg;"></div>
        <div class="maps-in-cyberspace-confetti-piece" style="left: 10%; background:#e91e63; animation-duration:6.2s; top:-30vh; --start-rot:-30deg; --end-rot:330deg;"></div>
        <div class="maps-in-cyberspace-confetti-piece" style="left: 17%; background:#9c27b0; animation-duration:5.5s; top:-15vh; --start-rot:90deg; --end-rot:720deg;"></div>
        <div class="maps-in-cyberspace-confetti-piece" style="left: 24%; background:#3f51b5; animation-duration:7s; top:-40vh; --start-rot:-45deg; --end-rot:270deg;"></div>
        <div class="maps-in-cyberspace-confetti-piece" style="left: 31%; background:#03a9f4; animation-duration:4.8s; top:-25vh; --start-rot:60deg; --end-rot:600deg;"></div>
        <div class="maps-in-cyberspace-confetti-piece" style="left: 38%; background:#009688; animation-duration:6.6s; top:-10vh; --start-rot:10deg; --end-rot:190deg;"></div>
        <div class="maps-in-cyberspace-confetti-piece" style="left: 45%; background:#8bc34a; animation-duration:5.2s; top:-35vh; --start-rot:-80deg; --end-rot:180deg;"></div>
        <div class="maps-in-cyberspace-confetti-piece" style="left: 52%; background:#cddc39; animation-duration:6.4s; top:-22vh; --start-rot:0deg; --end-rot:450deg;"></div>
        <div class="maps-in-cyberspace-confetti-piece" style="left: 59%; background:#ffc107; animation-duration:5.9s; top:-28vh; --start-rot:-10deg; --end-rot:90deg;"></div>
        <div class="maps-in-cyberspace-confetti-piece" style="left: 66%; background:#ff9800; animation-duration:6.1s; top:-18vh; --start-rot:45deg; --end-rot:400deg;"></div>
        <div class="maps-in-cyberspace-confetti-piece" style="left: 73%; background:#ff5722; animation-duration:4.9s; top:-33vh; --start-rot:120deg; --end-rot:680deg;"></div>
        <div class="maps-in-cyberspace-confetti-piece" style="left: 80%; background:#795548; animation-duration:6.3s; top:-12vh; --start-rot:-60deg; --end-rot:360deg;"></div>
        <div class="maps-in-cyberspace-confetti-piece" style="left: 87%; background:#607d8b; animation-duration:5.4s; top:-27vh; --start-rot:30deg; --end-rot:540deg;"></div>
        <div class="maps-in-cyberspace-confetti-piece" style="left: 94%; background:#673ab7; animation-duration:6.7s; top:-19vh; --start-rot:75deg; --end-rot:300deg;"></div>
      </div>

      <div style="font-size: 1.2em">
        <h1 style="font-size: 2.1em">Maps in Cyberspace Update</h1>
        ${game.release.generation > 12
        ? "<p>Foundry has added door animations and sounds.</p>"
        : "<p>Foundry has added door sounds.</p>"
      }

        <p>I've written a macro to assist with configuring your doors</p>
        <p>You can find the and run the macro straight from the compendium. Or just click the button below.</p>
        <button style="margin-left: 0.5em; width: 95%" id="maps-in-cyberspace-btn" onclick='(() => {console.log("ran button")})()'>
          Try macro
        </button>
        <div style="text-align: center">
          <input type='checkbox' id="maps-in-cyberspace-check" onclick='(() => {console.log("clicked checkbox")})()' name="dontShowAgain"/>
          <label style="" for="dontShowAgain">
            don't show this again
          </label>
        </div>
      </div>
    </div>
    `,
  }).then(r => {
    // console.log("DEBUG: Chat message created, adding listeners")
    // needs sometime for the HTML to render
    setTimeout(() => {
      addListeners()
    }, 1_000)
  })
})


function addListeners() {
  const buttons = document.querySelectorAll("#maps-in-cyberspace-btn");
  const checkboxes = document.querySelectorAll("#maps-in-cyberspace-check")

  // console.log("DEBUG: init addListeners, found btn", buttons, "| and checkbox", checkboxes)

  buttons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const macro = await game.packs.get("maps-in-cyberspace.cybermaps-macros").getDocument("Y26poMwoBLVhtDcC")
      macro.execute()
    });
  })

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", (event) => {
      // console.log("DEBUG: Checkbox state changed:", event.target.checked);
      if (event.target.checked) {
        localStorage.setItem("maps-in-cyberspace-skip", "true")
        game.settings.set("maps-in-cyberspace", "seen-chat-message", true)
      } else {
        localStorage.removeItem("maps-in-cyberspace-skip")
        game.settings.set("maps-in-cyberspace", "seen-chat-message", false)
      }
    });
  })
}

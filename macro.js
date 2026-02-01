const doorColors = [
  "modules/maps-in-cyberspace/doors/blue.webp",
  "modules/maps-in-cyberspace/doors/baby_blue.webp",
  "modules/maps-in-cyberspace/doors/cyan.webp",
  "modules/maps-in-cyberspace/doors/default.webp",
  "modules/maps-in-cyberspace/doors/dim_green.webp",
  "modules/maps-in-cyberspace/doors/green.webp",
  "modules/maps-in-cyberspace/doors/hot_pink.webp",
  "modules/maps-in-cyberspace/doors/orange.webp",
  "modules/maps-in-cyberspace/doors/pink.webp",
  "modules/maps-in-cyberspace/doors/purple.webp",
  "modules/maps-in-cyberspace/doors/red.webp",
  "modules/maps-in-cyberspace/doors/yellow.webp",
]
const doorSound = [
  "futuristicFast",
  "futuristicHydraulic",
  "futuristicForcefield",
  "industrial",
  "industrialCreaky",
  "jail",
  "magicDoor",
  "magicWall",
  "metal",
  "slidingMetal",
  "slidingMetalHeavy",
  "slidingModern",
  "slidingWood",
  "stoneBasic",
  "stoneRocky",
  "stoneSandy",
  "woodBasic",
  "woodCreaky",
  "woodHeavy",
  "none",
]
const animationTypes = [
  "ascend",
  "descend",
  "slide",
  "swing",
  "swivel",
  "none",
]
const radioStyle = `style="appearance:auto; -webkit-appearance:radio; opacity:1; position:relative; z-index:2; width: 21px; height: 21px"`;


// Write the html for the dialog
const hasAnimations = game.release.generation > 12
let content = `<form><div class="form-group" style="display: flex; flex-direction: column; align-items: flex-start"><h1>Welcome!</h1><p>I wrote this to help edit all the doors in the scene. Since Foundry has now added door sounds${hasAnimations ? " and animations" : ""}.</p>`

if (hasAnimations) {
  content += "<p>If you want an animated door you will first need to pick a door color. Just pick one which best matches your scene.</p>"
  // add the door color options
  doorColors.forEach((color, index) => {
    content += `
      <label for="color-${index}" style="display:flex; align-items:center; gap:8px; cursor:pointer; flex:none">
        <input ${radioStyle} type="radio" name="color" value="${index}" id="color-${index}">
        <img src="${color}" width="227" height="46" style="margin: 1px; background: black">
      </label>
    `
  })
  // start the animation section
  content += '<br/><p>Next set the animation type for all doors. I recommend either Ascend or slide. If you don\'t want an animation, select "none"</p>'
  // add the animation options
  animationTypes.forEach((type, index) => {
    content += `
      <label for="type-${index}" style="display:flex; align-items:center; gap:8px; cursor:pointer; flex:none">
        <input ${radioStyle} type="radio" name="type" value="${index}" id="type-${index}">
        <span>${type}</span>
      </label>
    `
  })
}




// start the sound section
content += '<br/><p>Pick a sound effect for all doors. I recommend either futuristicFast or futuristicHydraulic. If you don\'t want a sound, select "none"</p>'

// add the sound options
doorSound.forEach((type, index) => {
  content += `
    <label for="sound-${index}" style="display:flex; align-items:center; gap:8px; cursor:pointer; flex:none">
      <input ${radioStyle} type="radio" name="sound" value="${index}" id="sound-${index}">
      <span>${type}</span>
    </label>
  `
})

if (hasAnimations) {
  // double doors option
  content += '<br/><p>Finally, specifiy if two doors are shown per each door. This is recommended if using the slide animation.</p>'
  content += `<div style="flex:none">
    <input type="checkbox" id="doubleDoors">
    <label>Double Doors</label>
  </div>`
}

// give warning and finish form
content += `<br/><p>WARNING: This will overwrite any door settings on the currently viewed scene. If you have set door sounds${hasAnimations ? ", animations, double doors, door textures yourself" : ""}. THESE WILL BE OVERWRITTEN</p>`
content += '</div></form>'

foundry.applications.api.DialogV2.wait({
  window: { title: "Animate Doors" },
  position: { width: window.innerWidth * .4, height: window.innerHeight * .7 },
  content,
  id: "select-door-dialog",
  buttons: [{
    action: "1",
    label: `Overwrite all door settings on ${canvas?.scene?.name || "the current scene"}`,
    icon: "fas fa-check",
    callback: async () => {
      const color = document.querySelector('#select-door-dialog input[name="color"]:checked')?.value
      const animation = document.querySelector('#select-door-dialog input[name="type"]:checked')?.value
      const sound = document.querySelector('#select-door-dialog input[name="sound"]:checked')?.value
      const double = document.querySelector('#select-door-dialog #doubleDoors:checked')?.value === "on"

      // color and animation require each other
      if ((typeof color === "undefined" && typeof animation !== "undefined") || (typeof color !== "undefined" && typeof animation === "undefined")) {
        ui.notifications.error("If you specify a color, you must also specify an animation and vice versa.")
        return
      }
      const selectedColor = doorColors[color]
      let selectedAnimation, selectedSound
      // index 5 is "none" type
      if (animation && animation !== "5") {
        selectedAnimation = animationTypes[animation]
      } else {
        selectedAnimation = ""
      }

      // index 19 is the "none" choice
      if (sound && sound !== "19") {
        selectedSound = doorSound[sound]
      } else {
        selectedSound = ""
      }

      // Get all door walls
      const doors = canvas.walls.placeables.filter(w => w.isDoor)

      if (doors.length === 0) {
        ui.notifications.error("No doors found on the current scene")
        return
      }

      // Prepare update data
      const updates = doors.map(wall => {
        return {
          _id: wall.id,
          animation: {
            double,
            texture: selectedColor,
            type: selectedAnimation,
          },
          doorSound: selectedSound,
        }
      });

      // Perform the update
      await canvas.scene.updateEmbeddedDocuments("Wall", updates);

      ui.notifications.info(`updated ${doors.length} doors. ${hasAnimations ? "You may need to refresh the page to see all the changes." : ""}`)
    }
  }],
})

setTimeout(() => {
  // add a scrollbar to dialog
  document.querySelector("#select-door-dialog section").style.overflow = "auto"
  // scroll to top
  document.querySelector("#select-door-dialog section").scrollTop = 0
}, 200)

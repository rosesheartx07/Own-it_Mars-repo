# Game design

> Probabilities, costs and timers are **design values**, checked in a playtest with about 10 people (see [limitations.md](limitations.md)). They are not NASA data.

## Player bars
Energy (0–10), Food, Equipment, Health and Time (0–5) and Data (0–5, starts at 0), as in the prototype (see [prototype.md](prototype.md)). There is no hunger or thirst: the player does not get weak for missing meals. Food only comes from the Greenhouse.

## Map
The JavaScript game uses the same map as the Twine prototype: a tap map with six places in two columns and three rows. The player taps a place to open it. A ✅ marks a place that is done.

| | Left | Right |
|---|---|---|
| Top | Expedition | Greenhouse |
| Middle | Habitat | Solar panels |
| Bottom | Robot garage | Spaceship |

The laboratory is not on the map: it is opened from the Expedition, and only after an expedition. Exact positions are in `game/src/game/content.js` (`pos`).

## One day
There are no daily cycles. The whole game happens in **a single day**. The player taps places on the map in any order, and each place can be used once. The game ends when the final mission is completed or when the player gets a Game Over.

## Random events
Important events (solar storm, dust storm) are **not planned**: they can show up at a random moment during the day, and the player does not know when, so they must keep the base ready. An event can be the very first thing that happens when the player enters the game, or it can arrive after the player finishes a task (a visit to a place). When one arrives, a window opens over the map with a timer and the player chooses an option. The chance of each event is in `events.json` (`eventProbability`, design values). The Twine prototype only has a fixed solar storm alert in Solar panels; the random version is in the JavaScript game.

How it works in the JavaScript game (decisions listed in [prototype.md](prototype.md#decisions-taken-in-the-javascript-version)):
- The game rolls for an event once when the mission starts and again after every task. At most one event per roll, and each event happens at most once.
- Each event has a 30% chance per roll. The solar storm gives 30 seconds to decide and the dust storm 15 seconds.
- If the timer runs out, the base does nothing: the solar storm becomes "Stay connected" and the dust storm becomes "Keep working as usual".
- A solar storm that has not happened yet arrives when the player visits Solar panels. Either way it counts as that task.
- Options and effects of each event: [events.md](events.md).

## Music and sound
The game has background music (our own song, in a loop) and sound effects made in code, with an always-visible mute button and a low default volume. See [audio.md](audio.md).

## Stations

### Habitat (maintenance)
If maintenance is not done, there is a chance that one of these fails: thermoregulation and survival systems, the computer networks, or communication and navigation equipment. It is also possible that nothing happens. Failure of any one of these can be very serious.
Source: CSA, Spacewalks.

### Solar panels
Without maintenance, solar power can fail. Solar storms and dust storms happen here (see [events.md](events.md)).
Sources: NASA / JPL pages listed in [events.md](events.md).

### Greenhouse
Growing food in space needs a controlled environment close to what plants are used to on Earth. The player keeps temperature, humidity and lighting under control. This follows the Advanced Plant Habitat (APH) described by CSA.
Source: CSA, Growing food in space.

### Robot garage
Shows how a robotics operation works: the team coordinates the robots with communications, electrical and computer systems; plans camera positions and the robot's path, software updates and possible problems; and engineering support helps throughout.
Source: CSA, Robotics mission control centre.

### Expedition
The player goes out to collect data. Real context: missions to the Moon and Mars mean more time in weightlessness, more radiation exposure, longer communication delays with Earth, and less ability to rely on Earth for food, materials and emergency medical help.
Source: CSA, Why we conduct science experiments in space.

| Option | Data | Cost |
|---|---|---|
| Go back for the suit and stay longer | All the data | Radiation exposure: lose some health, energy, equipment and time |
| Stay without the shield | All the data | 50% chance the mission is lost (Game Over); otherwise lose almost all health |

The option "Leave early" from the first design is not in the final prototype.

### Laboratory
Available only after an expedition. To open it the player needs data and energy. Data must be analyzed and sent to Earth. The lab supports two goals described by CSA: preparing for deep-space destinations and improving quality of life on Earth.

| Option | Energy | Risk |
|---|---|---|
| Fast analysis | Less | 10% chance it goes wrong and all data is lost |
| Full analysis | A lot | Data is obtained successfully |

### Spaceship (final mission)
The ship launches only when the Habitat, Greenhouse, Solar panels, Robot garage and Expedition are done and the player has at least 1 of Energy, Food, Health, Time and Data. If something is missing, the ship says what is left. On launch, a mission log shows *What you protected* and *What it cost*.

## Game over
Health is the only bar that ends the game. When Health reaches 0 the mission is lost, a **Game Over** screen appears (with the real science about radiation), and the player restarts the game from the beginning. Other bars going down do not end the game by themselves.

## Food requirement for the Expedition (design rule)
The player does not get hungry or thirsty. Instead, **food is a requirement**: to go on the Expedition the player needs a minimum percentage of food. Food only increases in the Greenhouse, so the player has to take care of the plants before going out.

- Minimum food to open the Expedition: **3 out of 5 (60%)**. This is a design value, not NASA data.
- If the player does not have enough food, the Expedition stays closed and the game says why and points to the Greenhouse.
- Food is not lost by skipping meals. It can still go down because of events and failures (for example, spoiled food or lost crops).

## Dead ends
If the fast lab analysis wipes all the data, the ship can never launch. The game detects this: the map and the ship say so and offer to start again.

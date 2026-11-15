# Game design

> Probabilities, costs and timers are **design values** to be tuned in playtests. They are not NASA data.

## Player bars (0–100)
Health, food and base energy. There is no hunger or thirst: the player does not get weak for missing meals. Food only comes from the Greenhouse.

## Map
The JavaScript game uses the same map as the Twine prototype: a tap map with six places in two columns and three rows. The player taps a place to open it. A ✅ marks a place that is done.

| | Left | Right |
|---|---|---|
| Top | Expedition | Greenhouse |
| Middle | Habitat | Solar panels |
| Bottom | Robot garage | Spaceship |

The laboratory is not on the map: it is opened from the Expedition, and only after an expedition. Exact positions are in `game/data/stations.json` (`mapPosition`).

## One day
There are no daily cycles. The whole game happens in **a single day**. The player taps places on the map in any order, and each place can be used once. The game ends when the final mission is completed or when the player gets a Game Over.

## Random events
Important events (solar storm, dust storm) are **not planned**: they can show up at a random moment during the day, and the player does not know when, so they must keep the base ready. An event can be the very first thing that happens when the player enters the game, or it can arrive after the player finishes a task (a visit to a place). When one arrives, a window opens over the map with a timer and the player chooses an option. The chance of each event is in `events.json` (`eventProbability`, design values). The Twine prototype only has a fixed solar storm alert in Solar panels; the random version is for JavaScript.

To decide:
- Exactly when the game rolls for an event: once when the game starts and again after each task is done (proposal), and the chance of each roll.
- Maximum number of events in the game, and whether an event can repeat.
- How long the dust storm lasts, now that there are no days.
- Whether the Twine prototype's solar storm options or the ones in `events.json` are kept (see [prototype.md](prototype.md)).

## Music and sound
Background music and sounds are planned for the JavaScript version. See [audio.md](audio.md).

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
| Use the suit and stay longer | Some data, not all | Radiation exposure, lose health |
| Leave early | None | None |
| Stay without the suit | All the data | Lose almost all health |

### Laboratory
Available only after an expedition. To open it the player needs data and energy. Data must be analyzed and sent to Earth. The lab supports two goals described by CSA: preparing for deep-space destinations and improving quality of life on Earth.

| Option | Energy | Risk |
|---|---|---|
| Fast analysis | Less | 30% chance it goes wrong and all data is lost |
| Full analysis | A lot | Data is obtained successfully |

### Spaceship (final mission)
The player needs all the data and must send it to Earth to repair the ship.

## Game over
Health is the only bar that ends the game. When Health reaches 0 the player does not die: the mission is lost, a **Game Over** screen appears, and the game restarts from the beginning. Other bars going down do not end the game by themselves.

## Food requirement for the Expedition (design rule)
The player does not get hungry or thirsty. Instead, **food is a requirement**: to go on the Expedition the player needs a minimum percentage of food. Food only increases in the Greenhouse, so the player has to take care of the plants before going out.

- Minimum food to open the Expedition: [X]% (to be decided in playtests; design value, not NASA data).
- If the player does not have enough food, the Expedition stays closed and the game says why and points to the Greenhouse.
- Food is not lost by skipping meals. It can still go down because of events and failures (for example, spoiled food or lost crops).

## To be decided
- Final values for probabilities and costs.

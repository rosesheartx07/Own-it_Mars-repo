# Game design

> Probabilities, costs and timers are **design values** to be tuned in playtests. They are not NASA data.

## Player bars (0–100)
Health, hunger, thirst and base energy.

## Daily cycle (sol)
1. Morning: the game checks whether an event happens. An event may or may not happen on a given day.
2. Day: the player walks the map and has a limited number of actions.
3. When an event triggers, a window opens with a timer. The player chooses an option.

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

## Hunger and thirst (design rule)
Missing meals or water adds up: a first day without eating has a small chance of making the player weak, a second day a bigger chance, a third day hurts health. Exact numbers are tuned in playtests.

## To be decided
- Number of sols per game.
- Final values for probabilities and costs.
- What happens when a bar reaches zero (non-punitive design for kids: the mission pauses and the player retries).

// Game content ported from game/prototype/Mission Trainer.twee (final prototype)
// and game/data/events.json + stations.json. Probabilities and costs are design values, not NASA data.

export const SOURCES = {
  spacewalks: { publisher: 'Canadian Space Agency', title: 'Spacewalks', url: 'https://www.asc-csa.gc.ca/eng/astronauts/about-the-job/spacewalks.asp' },
  aph: { publisher: 'Canadian Space Agency', title: 'Growing food in space (APH)', url: 'https://www.asc-csa.gc.ca/eng/multimedia/search/video/18896?search=food&type=1' },
  robotics: { publisher: 'Canadian Space Agency', title: 'Robotics mission control centre', url: 'https://www.asc-csa.gc.ca/eng/iss/robotics/robotics-mission-control-centre.asp' },
  science: { publisher: 'Canadian Space Agency', title: 'Why do we conduct science experiments in space?', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp' },
  solarStorm: { publisher: 'NASA / JPL-Caltech', title: 'Large Solar Storm Sparks Global Aurora and Doubles Radiation Levels on the Martian Surface', url: 'https://www.jpl.nasa.gov/news/large-solar-storm-sparks-global-aurora-and-doubles-radiation-levels-on-the-martian-surface/' },
  dustStorm: { publisher: 'NASA', title: '10 Things: Massive Dust Storm on Mars', url: 'https://science.nasa.gov/solar-system/planets/mars/10-things-massive-dust-storm-on-mars/' },
  panelDust: { publisher: 'NASA', title: 'Solar-Panel Dust Accumulation and Cleanings', url: 'https://science.nasa.gov/photojournal/solar-panel-dust-accumulation-and-cleanings/' },
};

// ---------- Solar storm options (Twine prototype rules; used at Solar panels and in the random pop-up) ----------
const SOLAR_STORM_OPTIONS = [
  {
    id: 'disconnect_all', label: 'Disconnect everything.',
    base: { effects: { food: -2, energy: 2 }, flags: ['food_lost'], text: 'You turned everything off. The base stayed dark and cold all night, and the food in the freezer spoiled.' },
    branches: [{ p: 30, effects: { equipment: -1 }, flags: ['equipment_damaged'], text: 'A small surge still reached the base, and one machine stopped working.' }],
    otherwise: { text: 'The equipment came through the storm fine.' },
  },
  {
    id: 'stay_connected', label: 'Stay connected.',
    branches: [{ p: 70, effects: { equipment: -2, energy: -2 }, flags: ['equipment_damaged'], text: 'The storm hits hard. A power surge runs through the base, and some of the equipment burns out.' }],
    otherwise: { text: 'The storm passes without hitting the base. Everything keeps working, and the equipment is fine.' },
  },
  {
    id: 'disconnect_science', label: 'Disconnect only the science equipment.',
    base: { effects: { energy: -1 }, flags: ['data_lost'], text: "You shut down the science instruments and kept the essentials on. Tonight's data is lost." },
    branches: [{ p: 30, effects: { equipment: -1 }, flags: ['equipment_damaged'], text: 'A small surge still got through, and one machine stopped working.' }],
    otherwise: { text: 'Nothing else was damaged.' },
  },
];

const SOLAR_STORM_SCIENCE = {
  text: 'Sometimes the Sun unleashes a massive explosion that sends very fast-moving particles toward Mars. We call this a solar storm. In September 2017 one reached Mars and lit up an aurora more than 25 times brighter than any seen before by NASA’s MAVEN orbiter. Radiation on the ground was twice as high as any earlier measurement.',
  source: SOURCES.solarStorm,
};

// ---------- Stations (map places) ----------
export const STATIONS = [
  {
    id: 'expedition', name: 'Expedition', title: 'Investigation Crater', art: 'crater', pos: { x: 25, y: 18 },
    doneFlag: 'expedition_done',
    intro: [
      'A huge round hole in the ground with steep rocky walls. Scientists come here to study how space affects the human body, and to find ways to treat and prevent the problems. The goal is to make space travel safer.',
      'Missions to the Moon and Mars are longer, and that brings more risks:',
      { list: ['More time floating in weightlessness.', 'More exposure to radiation.', 'Longer delays when talking to Earth.', 'Less help from Earth with food, supplies, and emergency medical care.'] },
    ],
    startLabel: 'Start the expedition',
    doneText: 'The expedition is over.',
    prompt: [
      'The science team has been measuring radiation in the crater. Mars has a thin atmosphere, so much more radiation reaches the ground than on Earth. The detectors hold the data scientists need to keep astronauts safe, but their batteries are almost empty.',
      'Your radiation suit is back at the base. Going to get it takes time, and the detectors keep running down.',
      'How do you do the expedition?',
    ],
    options: [
      {
        id: 'suit_stay_longer', label: 'Go back for the suit and stay longer',
        base: { effects: { data: 5, health: -1, energy: -1, equipment: -1, time: -1 }, text: 'You work for hours with your suit on. The detectors collect a good amount of data. The suit blocks part of the radiation, but not all of it, and your health drops a little.' },
      },
      {
        id: 'no_suit', label: 'Stay without the radiation shield.',
        base: { text: 'You stay out without the shield until every detector has finished.' },
        branches: [{ p: 50, set: { health: 0 }, flags: ['died_radiation'], text: "The radiation is far stronger than your body can take. Your legs give out, and the team carries you back to the base. The doctors do everything they can, but it's too late. You don't survive." }],
        otherwise: { effects: { data: 5, health: -4, energy: -1 }, text: 'You bring back all the data, but the radiation leaves you weak and dizzy. You were lucky this time.' },
      },
    ],
    science: {
      text: 'Missions to the Moon and Mars mean more time in weightlessness, more radiation exposure, longer communication delays with Earth, and less ability to rely on Earth for food, materials and emergency medical help. Scientists study these risks to make space travel safer.',
      source: SOURCES.science,
    },
  },
  {
    id: 'greenhouse', name: 'Greenhouse', title: 'Greenhouse', art: 'greenhouse', pos: { x: 75, y: 18 },
    doneFlag: 'greenhouse_done',
    intro: [
      "A long room with plants growing under bright purple lights. There's lettuce, potatoes, and radishes in trays, with pipes that carry water to each row.",
      'This is where the crew gets its fresh food. It is the only place on the base where food can grow.',
    ],
    startLabel: 'Check the plants',
    doneText: 'The greenhouse is stable for now.',
    prompt: [
      'The panel shows three readings drifting: temperature, humidity, and lighting.',
      'You can set all three right, but it would use most of the energy you have left. If the conditions are not right, it could harm the harvest.',
    ],
    options: [
      {
        id: 'control_all', label: 'Control all three. It uses a lot of energy.',
        base: { effects: { energy: -2, food: 1 }, text: 'All the settings are perfect, but it uses a lot of energy. The plants keep growing and the harvest is great.' },
      },
      {
        id: 'skip_humidity', label: 'Fix the temperature and the lighting.',
        base: { effects: { energy: -1 }, text: 'The temperature and lights are set, but the humidity is still off and the air stays too damp.' },
        branches: [{ p: 50, effects: { food: -2 }, flags: ['mold_found'], text: "By evening there's mold on one of the trays. You have to throw out the whole tray." }],
        otherwise: { text: 'The plants handled the extra moisture. Nothing grew on them this time, but the risk is still there.' },
      },
      {
        id: 'skip_temperature', label: 'Fix the humidity and the lighting.',
        base: { text: 'The humidity and lights are set, but the heater shuts down overnight to save energy, and the room gets colder.' },
        branches: [{ p: 50, effects: { food: -2 }, flags: ['plants_stunted'], text: 'The cold slows the plants down. They stop growing, and the harvest will be much smaller.' }],
        otherwise: { text: "The plants made it through the cold. They look a little pale, but they're alive." },
      },
    ],
    science: {
      text: 'Growing food in space needs a controlled environment close to what plants are used to on Earth. In the Advanced Plant Habitat, the temperature, humidity and lighting are all kept under control.',
      source: SOURCES.aph,
    },
  },
  {
    id: 'habitat', name: 'Habitat', title: 'Habitat', art: 'habitat', pos: { x: 25, y: 50 },
    doneFlag: 'habitat_done',
    intro: [
      "This is where the crew lives and sleeps. It's a sealed building with bunks, a small kitchen, and a control panel for air and power.",
      'Along the back wall are the systems that keep everyone alive: the heating and air equipment, the computers, and the radio and navigation gear. They all need regular maintenance.',
    ],
    startLabel: 'Check the maintenance panel',
    doneText: 'The maintenance is done for today.',
    prompt: [
      'The panel shows three systems due for service: temperature and life support, the computer network, and communication and navigation.',
      "Servicing everything uses a lot of energy. A system that isn't serviced might fail, and a failure in any of them could put the whole base at risk.",
    ],
    options: [
      {
        id: 'service_all', label: 'Service everything.',
        base: { effects: { energy: -1, time: -1 }, text: 'You spend the afternoon checking every system, changing filters, and updating the computers. Everything passes.' },
      },
      {
        id: 'life_support_only', label: 'Service only the life support.',
        base: { effects: { energy: -1 }, text: "You service the heating and air systems. They're ready to run." },
        branches: [
          { p: 25, effects: { equipment: -1 }, flags: ['network_failed'], text: "That night the computer network crashes. The control panel goes blank, and the crew has to run the base by hand until it's rebooted." },
          { p: 25, effects: { equipment: -1 }, flags: ['comms_failed'], text: "Communication and navigation go down. The base can't reach Earth, and the rover can't find its way back until it's fixed." },
        ],
        otherwise: { text: 'Nothing else breaks this time. The other systems are still overdue for service.' },
      },
      {
        id: 'skip', label: 'Skip the maintenance.',
        base: { text: 'You leave the maintenance for later.' },
        branches: [
          { p: 20, effects: { energy: -1 }, flags: ['thermo_failed'], text: 'The heating and air system stops. The temperature drops and the air gets stale. The crew works through the night to restart it. A failure like this could cost the whole base.' },
          { p: 20, effects: { equipment: -1 }, flags: ['network_failed'], text: "The computer network crashes. The control panel goes blank, and the crew has to run the base by hand until it's rebooted." },
          { p: 20, effects: { equipment: -1 }, flags: ['comms_failed'], text: "Communication and navigation go down. The base can't reach Earth, and the rover can't find its way back until it's fixed." },
        ],
        otherwise: { text: 'Nothing breaks this time. The systems still need service, and the risk is still there.' },
      },
    ],
    science: {
      text: "Maintenance takes up a big part of an astronaut's time and energy on the space station. If it is not done, the thermoregulation and survival systems, the computer networks, or the communication and navigation equipment can fail. A failure in any one of them can be very serious.",
      source: SOURCES.spacewalks,
    },
  },
  {
    id: 'solar_panels', name: 'Solar Panels', title: 'Solar Panels', art: 'solar', pos: { x: 75, y: 50 },
    doneFlag: 'storm_done',
    intro: [
      'Rows of flat panels face the Sun. They turn sunlight into the power the whole base runs on.',
      'Mars is dusty, and the wind blows red dust onto the panels all the time.',
    ],
    alarm: 'An alarm goes off at the control box. A solar storm is heading for the base.',
    startLabel: 'Check the alert',
    doneText: 'The panels are quiet now. The storm is over.',
    promptTitle: 'Storm alert',
    prompt: [
      'A solar storm is coming. It could last a few hours or the whole night. Strong bursts from the Sun can damage electronics. If all the energy is turned off, the lights, the heat, and the radio will stop working.',
    ],
    options: SOLAR_STORM_OPTIONS,
    science: SOLAR_STORM_SCIENCE,
  },
  {
    id: 'robot_garage', name: 'Robot Garage', title: 'Robot Garage', art: 'garage', pos: { x: 25, y: 82 },
    doneFlag: 'garage_done',
    intro: [
      'Two machines live here: a long robotic arm and a smaller robot with two hands for delicate jobs. On the space station, the real ones are called Canadarm2 and Dextre.',
      "A robot job isn't just pressing a button. The team has to line up the robot's work with the base's other systems, like communications, electricity, and computers. They plan where the cameras go and what path the arm will follow. They also check which software updates are needed and look for problems ahead of time. Engineers on the support team help at every step.",
    ],
    startLabel: "Check tomorrow's robot job",
    doneText: 'The robots are ready for tomorrow.',
    prompt: [
      'Tomorrow the arm has to move a heavy part to the solar panels. Three jobs need to be done first: coordinate with the base\'s other systems, plan the cameras and the arm\'s path, and update the software and look for problems.',
      "There's time and energy to do all three, but it will use a lot of energy.",
    ],
    options: [
      {
        id: 'all_jobs', label: 'Do all three jobs. The robot is fully ready.',
        base: { effects: { energy: -1, equipment: 1 }, text: 'You spend the day on every step. The systems are lined up, the cameras are placed, and the software is up to date. The arm moves the part without a problem. The base is low on energy tonight.' },
      },
      {
        id: 'skip_software', label: 'Coordinate the systems and plan the path, but skip the software update.',
        base: { effects: { energy: -1 }, text: "The systems are lined up and the arm's path is planned." },
        branches: [{ p: 40, effects: { equipment: -1 }, flags: ['robot_glitch'], text: "Halfway through the job, the robot's software freezes. The arm stops in the middle of the move, and you have to restart it before it can finish." }],
        otherwise: { text: "The old software held up this time. It's still overdue for an update." },
      },
      {
        id: 'skip_coordination', label: 'Plan the path and update the software, but skip the coordination.',
        base: { effects: { energy: -1 }, text: 'The path is planned and the software is up to date.' },
        branches: [{ p: 40, effects: { energy: -1 }, flags: ['comms_dip'], text: 'When the arm starts moving, it pulls a lot of power. The radio and the lights go out for a while, because nobody planned for it.' }],
        otherwise: { text: 'The power held up this time. Nobody checked how the arm would affect the other systems.' },
      },
    ],
    science: {
      text: 'A robotics operation needs a whole team: they coordinate the robots with the communications, electrical and computer systems, plan the camera positions and the robot\'s path, prepare software updates and look for possible problems. Engineering support helps the whole way.',
      source: SOURCES.robotics,
    },
  },
  {
    id: 'spaceship', name: 'Spaceship', title: 'Spaceship', art: 'ship', pos: { x: 75, y: 82 },
    intro: [
      "The ship that brought the crew to Mars. It landed at the edge of the base and hasn't moved since.",
      'Inside there\'s a cockpit with screens and controls, a small cargo bay, and the seats the crew strapped into during the trip. Most of the equipment is turned off to save power.',
    ],
  },
];

export const LAB = {
  id: 'laboratory', name: 'Laboratory', title: 'Investigation Lab', art: 'lab',
  intro: [
    'A sealed tent with white tables and a computer that analyzes data. Labs like this let scientists use the unique conditions of space to run experiments that prepare us for deep-space trips. What they learn also helps improve life on Earth.',
    'To open the lab you need two things: data to analyze and energy to run the equipment. The results get sent to Earth.',
  ],
  options: [
    {
      id: 'fast_analysis', label: 'Analyze it fast. It uses little energy, but there\'s a 10% chance something goes wrong and you lose all the data.',
      base: { effects: { energy: -1 } },
      branches: [{ p: 10, set: { data: 0 }, flags: ['lab_wiped'], text: "Halfway through, the analyzer crashes and wipes the files. All the data is gone, and there's no way to get it back." }],
      otherwise: { flags: ['lab_done', 'data_sent'], text: 'The quick analysis works. You send the results to Earth.' },
    },
    {
      id: 'full_analysis', label: 'Analyze it carefully. It uses a lot of energy, but you get all the data.',
      needsEnergy: 2,
      base: { effects: { energy: -2 }, flags: ['lab_done', 'data_sent'], text: 'You run the full analysis. It takes a lot of energy, but every piece of data is checked and nothing is lost. You send the results to Earth.' },
    },
  ],
  science: {
    text: 'Labs in space let scientists use the unique conditions of space for experiments. They have two goals: preparing for trips to deep-space destinations, and improving the quality of life on Earth.',
    source: SOURCES.science,
  },
};

// ---------- Random events (events.json). They pop up over the map with a timer. ----------
export const EVENTS = [
  {
    id: 'solar_storm', name: 'Solar storm', icon: '☀️', art: 'solar',
    eventProbability: 0.3, decisionSeconds: 30,
    skipIf: 'storm_done', // the storm at Solar panels already happened
    doneFlag: 'storm_done',
    alert: 'Fast particles from the Sun are heading for the base right now! Strong bursts from the Sun can damage electronics. Choose fast!',
    options: SOLAR_STORM_OPTIONS,
    timeoutOption: 'stay_connected',
    timeoutText: 'Time ran out! Nobody switched anything off, so the base stayed connected.',
    science: SOLAR_STORM_SCIENCE,
  },
  {
    id: 'dust_storm', name: 'Dust storm', icon: '🌪️', art: 'dust',
    eventProbability: 0.3, decisionSeconds: 15,
    doneFlag: 'dust_done',
    alert: 'A huge cloud of red dust is blowing over the base. It blocks the sunlight the solar panels need. What do you do?',
    options: [
      {
        id: 'power_saving', label: 'Power-saving mode', mode: 'independent',
        base: { effects: { time: -1 }, text: 'You pause the science work and save power until the dust settles, like NASA did with Opportunity.' },
        branches: [{ p: 25, effects: { energy: -2 }, flags: ['dust_on_panels'], text: 'Dust stayed on the panels. You need to clean them.' }],
        otherwise: { text: 'The wind blew most of the dust off the panels. Lucky!' },
      },
      {
        id: 'keep_working', label: 'Keep working as usual', mode: 'independent',
        base: { text: 'You keep every system running while the dust blocks the Sun.' },
        branches: [{ p: 55, effects: { energy: -2, food: -1, health: -1 }, flags: ['battery_drained'], text: 'The battery ran out. Heating failed: some crops were lost and you got very cold.' }],
        otherwise: { text: 'The battery held on until the dust cleared. That was close.' },
      },
      {
        id: 'cut_to_essentials', label: 'Cut to essentials and choose one thing to protect', mode: 'independent',
        base: { effects: { energy: -1 }, text: 'You turn off everything except heat, air and the radio.' },
        branches: [
          { p: 35, effects: { data: -1 }, flags: ['results_lost'], text: 'The results of what you turned off were lost.' },
          { p: 25, effects: { energy: -1 }, flags: ['dust_on_panels'], text: 'Dust stayed on the panels. You need to clean them.' },
        ],
        otherwise: { text: 'The essentials kept running, and nothing was lost.' },
      },
    ],
    timeoutOption: 'keep_working',
    timeoutText: 'Time ran out! Nobody changed anything, so the base kept working as usual.',
    science: {
      text: "A storm of tiny dust particles covered much of Mars and made NASA's Opportunity rover suspend its science work. Opportunity runs on sunlight, and the dust blocks it. NASA's Curiosity rover has a nuclear-powered battery that works day and night, so it was mostly unaffected. Dust also settles on solar panels and reduces the sunlight they receive. Sometimes wind clears it away, but that is luck, not a plan.",
      source: SOURCES.dustStorm,
      extraSource: SOURCES.panelDust,
    },
  },
];

// ---------- Ending ----------
export const LAUNCH_LOG = {
  protected: [
    [s => s.flags.data_sent, 'The radiation data reached Earth.'],
    [s => s.flags.lab_done, 'The science results were analyzed.'],
    [s => !s.flags.food_lost, 'The food survived the storm.'],
    [s => !s.flags.equipment_damaged, 'The equipment came through the storm.'],
    [s => s.flags.habitat_done && !s.flags.thermo_failed && !s.flags.network_failed && !s.flags.comms_failed, 'Every habitat system kept working.'],
  ],
  cost: [
    [s => s.flags.food_lost, 'The food in the freezer spoiled in the storm.'],
    [s => s.flags.equipment_damaged, 'The storm damaged the equipment.'],
    [s => s.flags.data_lost, 'Some science data was lost.'],
    [s => s.flags.thermo_failed, 'The heating and air system failed.'],
    [s => s.flags.network_failed, 'The computer network crashed.'],
    [s => s.flags.comms_failed, 'Communications went down.'],
    [s => s.flags.mold_found, 'Mold ruined a tray of plants.'],
    [s => s.flags.plants_stunted, 'The cold slowed the plants down.'],
    [s => s.flags.robot_glitch, "The robot's software froze mid-job."],
    [s => s.flags.comms_dip, 'The radio and lights went out when the arm started moving.'],
    [s => s.flags.battery_drained, 'The battery ran out in the dust storm.'],
    [s => s.flags.dust_on_panels, 'Dust stayed on the solar panels.'],
    [s => s.flags.results_lost, 'Results were lost when you cut power in the dust storm.'],
  ],
};

export const GAME_OVER = {
  radiation: [
    "You didn't survive the radiation.",
    "Out on Mars there is very little to block radiation from space. In a big dose, it damages the body's cells, and the body can't repair them fast enough. That's why astronauts wear protection, plan every trip outside, and follow strict limits on how much radiation they can take.",
    'Look back at your choices. You chose the data over your safety, and the crew lost you.',
  ],
  other: [
    'Your health ran out.',
    'On Mars, the base is the only thing between the crew and a freezing, airless planet. When power and heat fail, people get sick fast. That\'s why astronauts plan for storms and protect the systems that keep them alive.',
  ],
};

export const MISSING_TEXT = {
  habitat_done: 'Habitat', greenhouse_done: 'Greenhouse', storm_done: 'Solar Panels', garage_done: 'Robot Garage', expedition_done: 'Investigation Crater',
  energy: 'Energy: the engines need power.',
  food: 'Food: the crew has to eat on the way.',
  health: "Health: the crew isn't fit to travel.",
  time: 'Time: the launch window is closing.',
  data: 'Data: the scientists are waiting for the results from the crater.',
};

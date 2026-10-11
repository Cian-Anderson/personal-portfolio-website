# Cat Splash

> **A simple embedded game written in C for an STM32 microcontroller, featuring custom sprites, music, sound effects, collision detection, scoring, and two gameplay modes.**

Cat Splash was developed as a microcontroller programming project using **C**.  
The aim was to build a complete playable game at a low level: drawing sprites to a small LCD, reading physical button inputs, generating music and sound effects, handling collisions, and managing the full gameplay loop directly on the microcontroller.

## Gameplay

The player controls a cat while avoiding falling rain.

The game includes two modes:

### Normal Mode

The objective is to guide the cat safely to an umbrella while avoiding the falling rain.

- The umbrella appears at a random position
- Reaching it safely increases the score
- Each successful round increases the game difficulty
- Falling rain becomes progressively faster
- If the cat is hit by rain, the run ends and the score is displayed

### Time Trial

Time Trial removes the umbrella objective and instead challenges the player to survive for as long as possible.

- The score is measured in seconds
- Rain speed increases as time passes
- Difficulty increases every five seconds
- The background music also speeds up as the game becomes more difficult
- The run ends when the cat is hit

After either mode ends, the score screen is displayed before returning to the main menu.

## Controls

The game uses four physical directional inputs connected to the STM32 GPIO pins.

| Input | Action                             |
| ----- | ---------------------------------- |
| Left  | Move cat left / select Normal Mode |
| Right | Move cat right / select Time Trial |
| Up    | Move cat up                        |
| Down  | Move cat down                      |

## Graphics and Animation

The game uses a **128 × 160 colour LCD** connected to the STM32 over SPI.

Custom sprite data is stored directly in the program and includes:

- Standing cat
- Moving cat
- Cat under umbrella
- Umbrella
- Falling rain
- Cloud/background graphics

Movement is animated by alternating between standing and movement sprites.  
Sprites can also be horizontally inverted so the cat faces the direction it is travelling.

The display code provides low-level drawing functionality including:

- Pixel drawing
- Images
- Lines
- Rectangles
- Circles
- Filled shapes
- Text
- Scaled text
- Numeric output

## Collision Detection

Collision handling is implemented directly in the game loop.

The program checks whether selected points on the cat intersect with the falling rain sprite. A collision:

1. Stops the current run
2. Plays the death sound
3. Opens the score screen
4. Returns the player to the menu

In Normal Mode, collision checks are also used to determine whether:

- Rain has struck the umbrella
- The player has successfully reached the umbrella

Reaching the umbrella triggers a short success sound and increases the score and difficulty.

## Music and Sound

Audio is generated directly by the microcontroller using **TIM14**.

The timer produces square-wave tones at musical-note frequencies defined in `musical_notes.h`.

The game includes:

- A looping gameplay melody
- Movement sounds during menu animations
- A rising success jingle
- A descending death sound
- Increasing music tempo during Time Trial as difficulty rises

No prerecorded audio files are used; the music and sound effects are generated from note frequencies in code.

## Game Loop

At a high level, the program follows this loop:

```text
Startup Animation
       ↓
Main Menu
       ↓
Select Game Mode
       ↓
Read Player Input
       ↓
Move / Animate Cat
       ↓
Update Rain
       ↓
Collision Detection
       ↓
Update Score / Difficulty
       ↓
Continue Until Hit
       ↓
Score Screen
       ↓
Return to Menu
```

The project uses a SysTick interrupt for millisecond timing, allowing the game to coordinate movement, scoring, delays, music playback, and increasing difficulty.

## Hardware and Embedded Programming

The project targets an **STM32F031x6** microcontroller.

It works directly with STM32 peripheral registers to configure and control:

- GPIO
- SPI
- SysTick
- TIM14
- System clock / PLL
- Display control pins
- Physical button inputs

This project therefore combines gameplay programming with lower-level embedded systems concepts rather than relying on a game engine or operating system.

## Technical Highlights

- Embedded C
- STM32 microcontroller programming
- Direct peripheral register access
- GPIO input handling
- SPI display communication
- Timer/PWM audio generation
- SysTick timing
- Custom sprite graphics
- Sprite animation and orientation
- Collision detection
- Randomised game elements
- Multiple game states
- Dynamic scoring and difficulty
- Real-time gameplay loop

## Project Structure

```text
.
├── main.c
├── display.c
├── display.h
├── sound.c
├── sound.h
├── musical_notes.h
├── font5x7.h
└── README.md
```

### `main.c`

Contains the main game logic, sprite data, player movement, game modes, scoring, collision detection, animations, music sequencing, GPIO setup, and overall game loop.

### `display.c` / `display.h`

Provides the LCD interface and graphics functions, including SPI communication, image rendering, primitive drawing, and text output.

### `sound.c` / `sound.h`

Configures TIM14 and generates musical tones used by the game.

### `musical_notes.h`

Defines note frequencies used for the game music and sound effects.

### `font5x7.h`

Contains the 5×7 ASCII bitmap font used for display text.

The font data is credited in the source to **Pascal Stang (2001)**.

## What I Built

For the game itself, I designed and implemented the:

- Gameplay loop
- Player movement
- Normal and Time Trial game modes
- Collision logic
- Difficulty progression
- Scoring system
- Sprite graphics and animation
- Gameplay music
- Win and death sound effects
- Menu and score-screen behaviour

The project demonstrates how a complete interactive game can be built directly in C on resource-constrained embedded hardware, combining graphics, audio, input, timing, and game-state logic without a traditional game engine.

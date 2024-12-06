# Zwift Workout Builder

A modern, user-friendly web application for creating and editing Zwift workouts. Build your custom workouts with an intuitive interface and export them directly to Zwift's .zwo format.

Try it now: [Zwift Workout Builder](https://tcrevel.github.io/ZwiftWorkoutBuilder/)

![Zwift Workout Builder](screenshot.png)

## Features

- 📊 Visual workout builder with power graph preview
- 🎯 Support for all workout segment types:
  - Steady state
  - Intervals
  - Warmup
  - Cooldown
- ⚡ Advanced metrics:
  - Training Stress Score (TSS)
  - Normalized Power (NP)
  - Intensity Factor (IF)
  - Work in kilojoules (kJ)
- 🔄 Power zone analysis:
  - Time in zones breakdown
  - Zone distribution visualization
  - Power zone targeting
- 💪 Workout classification:
  - Workout type detection
  - Energy system focus
  - Recovery recommendations
- 🍪 Nutrition guidance:
  - CHO2 estimation
  - Hourly carb requirements
- 💾 Workout management:
  - Import existing .zwo files
  - Export to Zwift-compatible format
  - Save workouts to library
- 🎮 User experience:
  - Drag and drop segment reordering
  - Precise duration control
  - Undo/Redo functionality (Ctrl+Z, Ctrl+Y)
  - Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tcrevel/ZwiftWorkoutBuilder.git
cd ZwiftWorkoutBuilder
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Creating a Workout**
   - Enter workout name and description
   - Select segment type (Steady, Interval, Warmup, or Cooldown)
   - Set duration and power targets
   - Click "Add Segment" to add to your workout

2. **Editing Segments**
   - Click the edit icon on any segment to modify its parameters
   - Drag and drop segments to reorder them
   - Use undo/redo buttons to reverse changes

3. **Importing Workouts**
   - Click the "Import .zwo" button
   - Select a Zwift workout file (.zwo)
   - The workout will be loaded into the builder

4. **Exporting to Zwift**
   - Click "Export .zwo" to download the workout file
   - Place the downloaded file in your Zwift workouts folder:
     - Windows: `Documents\Zwift\Workouts\[Your Zwift ID]`
     - Mac: `Documents/Zwift/Workouts/[Your Zwift ID]`

## Built With

- [React](https://reactjs.org/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [Material-UI](https://mui.com/) - Component Library
- [Recharts](https://recharts.org/) - Charting Library
- [Vite](https://vitejs.dev/) - Build Tool

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request to the [GitHub repository](https://github.com/tcrevel/ZwiftWorkoutBuilder).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to Zwift for inspiring this project
- Built with ❤️ by [Thibault Crevel](https://github.com/tcrevel)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/tcrevel/ZwiftWorkoutBuilder/issues).

## Repository

- GitHub: [https://github.com/tcrevel/ZwiftWorkoutBuilder](https://github.com/tcrevel/ZwiftWorkoutBuilder)

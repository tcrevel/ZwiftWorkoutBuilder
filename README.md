# Zwift Workout Builder

A web-based tool for creating and managing Zwift workouts with advanced training metrics and nutrition guidance.

## Features

### Core Features
- Visual workout builder with real-time power graph preview
- Support for all workout segment types (Steady, Intervals, Warmup, Cooldown)
- Import and export Zwift-compatible .zwo files
- Drag and drop segment reordering
- Undo/Redo functionality with keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- Duration presets for quick workout creation

### Advanced Metrics
- Training Stress Score (TSS) calculation
- Normalized Power (NP) estimation
- Intensity Factor (IF) analysis
- Work calculation in kilojoules (kJ)

### Power Analysis
- Time in zones breakdown
- Zone distribution visualization
- Power zone targeting
- Workout type classification

### Training Guidance
- Energy system focus detection
- Recovery recommendations
- Nutrition guidance with calorie and carb calculations
- Hydration recommendations
- Fueling strategy suggestions
- Pre-workout nutrition timing tips

### User Experience
- Intuitive segment creation and editing
- Precise duration control
- Responsive design for all devices
- Modern, clean interface
- Automatic workout saving
- Workout library for saving and loading workouts

### Workout Analysis
- Power zone distribution visualization
- Training metrics (TSS, IF, Normalized Power)
- Workout Difficulty Estimator
  - Smart difficulty calculation based on multiple training factors
  - Color-coded ratings from Easy to Extreme
  - Hover tooltips with detailed difficulty descriptions
  - Helps athletes gauge workout intensity and plan training appropriately

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Zwift account and installation

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

## Technical Details

### Workout Difficulty Calculation
The workout difficulty is calculated using a weighted scoring system:
- 40% - Intensity Factor (IF)
- 20% - Workout Duration
- 30% - High-intensity Zone Time
- 10% - Training Stress Score (TSS)

Difficulty levels:
- Easy (0-39): Recovery or endurance focused workout
- Moderate (40-59): Steady endurance with some intensity
- Hard (60-79): Challenging workout with significant threshold work
- Very Hard (80-89): High intensity with substantial anaerobic work
- Extreme (90-100): Maximum effort workout with extensive high-intensity intervals

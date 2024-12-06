# Zwift Workout Builder

A modern, user-friendly web application for creating and editing Zwift workouts. Build your custom workouts with an intuitive interface and export them directly to Zwift's .zwo format.

![Zwift Workout Builder](screenshot.png)

## Features

- 📊 Visual workout builder with power graph preview
- 🎯 Support for all workout segment types:
  - Steady state
  - Intervals
  - Warmup
  - Cooldown
- ⚡ Power settings from 50% to 170% FTP
- 🔄 Import existing .zwo files
- 💾 Export workouts to Zwift-compatible .zwo format
- 🎮 Drag and drop segment reordering
- ⏱️ Precise duration control with minutes and seconds
- 🔄 Undo/Redo functionality
- 💻 Responsive design for desktop, tablet, and mobile
- 🚴‍♂️ Optional cadence targets for each segment

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/zwift-workout-builder.git
cd zwift-workout-builder
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

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to Zwift for inspiring this project
- Built with ❤️ by Thibault Crevel

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/zwift-workout-builder/issues).

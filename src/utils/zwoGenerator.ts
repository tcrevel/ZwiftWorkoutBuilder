import { Workout, WorkoutSegment, IntervalSegment, RampSegment, SteadySegment } from '../types/workout';

export const parseZwoFile = async (file: File): Promise<Workout> => {
  const text = await file.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");

  const name = xmlDoc.querySelector('name')?.textContent || 'Imported Workout';
  const description = xmlDoc.querySelector('description')?.textContent || '';

  const segments: WorkoutSegment[] = [];
  const workoutElements = xmlDoc.querySelectorAll('workout > *');

  workoutElements.forEach((element) => {
    const duration = parseInt(element.getAttribute('Duration') || '0');
    const cadence = element.getAttribute('Cadence') ? parseInt(element.getAttribute('Cadence')!) : undefined;

    switch (element.tagName.toLowerCase()) {
      case 'steadystate':
        const power = Math.round(parseFloat(element.getAttribute('Power') || '0') * 100);
        segments.push({
          type: 'steady',
          duration,
          powerPercent: power,
          cadence,
        });
        break;

      case 'intervalst':
        const onPower = Math.round(parseFloat(element.getAttribute('OnPower') || '0') * 100);
        const offPower = Math.round(parseFloat(element.getAttribute('OffPower') || '0') * 100);
        const onDuration = parseInt(element.getAttribute('OnDuration') || '0');
        const offDuration = parseInt(element.getAttribute('OffDuration') || '0');
        const repeat = parseInt(element.getAttribute('Repeat') || '0');
        segments.push({
          type: 'interval',
          duration: (onDuration + offDuration) * repeat,
          powerTarget1Percent: onPower,
          powerTarget2Percent: offPower,
          repetitions: repeat,
          onDuration,
          offDuration,
          cadence,
        });
        break;

      case 'warmup':
      case 'cooldown':
        const powerLow = Math.round(parseFloat(element.getAttribute('PowerLow') || '0') * 100);
        const powerHigh = Math.round(parseFloat(element.getAttribute('PowerHigh') || '0') * 100);
        segments.push({
          type: element.tagName.toLowerCase() as 'warmup' | 'cooldown',
          duration,
          startPowerPercent: powerLow,
          endPowerPercent: powerHigh,
          cadence,
        });
        break;
    }
  });

  return {
    id: crypto.randomUUID(),
    name,
    description,
    segments,
  };
};

const generateZwoXml = (workout: Workout): string => {
  const header = `<?xml version="1.0" encoding="UTF-8"?>`;
  const workoutName = workout.name || 'Untitled Workout';
  const description = workout.description || '';
  //const author = workout.author || 'Zwift Workout Builder';
  const sportType = 'bike'; // Default to bike workouts for now

  const generateSegmentXml = (segment: WorkoutSegment): string => {
    if (segment.type === 'interval') {
      const intervalSegment = segment as IntervalSegment;
      const powerTarget1 = (intervalSegment.powerTarget1Percent / 100).toFixed(2);
      const powerTarget2 = (intervalSegment.powerTarget2Percent / 100).toFixed(2);
      
      return `        <IntervalsT 
            Repeat="${intervalSegment.repetitions}"
            OnDuration="${intervalSegment.onDuration}"
            OffDuration="${intervalSegment.offDuration}"
            OnPower="${powerTarget1}"
            OffPower="${powerTarget2}"${intervalSegment.cadence ? `
            Cadence="${intervalSegment.cadence}"` : ''}
        />`;
    } else if (segment.type === 'steady') {
      const steadySegment = segment as SteadySegment;
      const power = (steadySegment.powerPercent / 100).toFixed(2);
      
      const attributes = [
        `Duration="${steadySegment.duration}"`,
        `Power="${power}"`,
      ];

      if (steadySegment.cadence) {
        attributes.push(`Cadence="${steadySegment.cadence}"`);
      }

      return `        <SteadyState ${attributes.join(' ')}/>`;
    } else {
      const rampSegment = segment as RampSegment;
      // Convert power percentages to decimal values (e.g., 75% -> 0.75)
      const powerLow = (rampSegment.startPowerPercent / 100).toFixed(2);
      const powerHigh = (rampSegment.endPowerPercent / 100).toFixed(2);
      
      // Convert segment type to Zwift-specific naming
      const zwiftType = segment.type === 'warmup' ? 'Warmup' : 'Cooldown';

      // Build the XML attributes
      const attributes = [
        `Duration="${rampSegment.duration}"`,
        `PowerLow="${powerLow}"`,
        `PowerHigh="${powerHigh}"`,
      ];

      if (rampSegment.cadence) {
        attributes.push(`Cadence="${rampSegment.cadence}"`);
      }

      return `        <${zwiftType} ${attributes.join(' ')}/>`;
    }
  };

  const workoutXml = `
<workout_file>
    <name>${workoutName}</name>
    <description>${description}</description>
    <sportType>${sportType}</sportType>
    <tags></tags>
    <workout>
${workout.segments.map(generateSegmentXml).join('\n')}
    </workout>
</workout_file>`;

  return header + workoutXml;
};

export const generateZwoFile = (workout: Workout): Blob => {
  const xmlContent = generateZwoXml(workout);
  return new Blob([xmlContent], { type: 'application/xml' });
}; 
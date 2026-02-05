import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Global Chart Defaults
ChartJS.defaults.font.family = "'Inter', sans-serif";
ChartJS.defaults.color = '#616161';
ChartJS.defaults.scale.grid.color = '#EEEEEE';

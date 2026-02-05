import React, { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import '../../utils/chartSetup'; // Ensure ChartJS is registered

const RevenueChart = ({ data, period = 'daily' }) => {
    const chartData = useMemo(() => {
        if (!data) return { labels: [], datasets: [] };

        const isDaily = period === 'daily';

        return {
            labels: isDaily
                ? data.map(item => {
                    const date = new Date(item.date);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                })
                : data.map(item => item.month),
            datasets: [
                {
                    label: 'Doanh thu (VNĐ)',
                    data: data.map(item => item.revenue),
                    borderColor: '#00796B',
                    backgroundColor: isDaily ? 'rgba(0, 121, 107, 0.1)' : '#00796B',
                    borderWidth: 2,
                    pointBackgroundColor: '#FFFFFF',
                    pointBorderColor: '#00796B',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: isDaily,
                    tension: 0.4, // Smooth curve
                }
            ]
        };
    }, [data, period]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#212121',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                callbacks: {
                    label: (context) => {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    borderDash: [5, 5],
                    drawBorder: false,
                },
                ticks: {
                    callback: (value) => {
                        if (value >= 1000000) return `${value / 1000000}M`;
                        if (value >= 1000) return `${value / 1000}k`;
                        return value;
                    }
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };

    return (
        <div style={{ height: '100%', width: '100%', minHeight: '300px' }}>
            {period === 'daily' ? (
                <Line data={chartData} options={options} />
            ) : (
                <Bar data={chartData} options={options} />
            )}
        </div>
    );
};

export default RevenueChart;
